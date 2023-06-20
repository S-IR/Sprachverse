import { NextApiRequest, NextApiResponse } from "next";
import util from "util";
import { google, youtube_v3 } from "googleapis";
import { NextResponse } from "next/server";
import { GaxiosPromise } from "googleapis/build/src/apis/abusiveexperiencereport";
import internal from "stream";
import {
  SubscribedChannelsType,
  VideoData,
} from "@/constants/preferences/preference-types";
import {
  getTop20VideosForChannels,
  getUserLikedVideos,
  getUserSubscribedChannels,
  mapToObject,
  setVideoTags,
} from "@/lib/backend/preferences";
import fs, { readFile } from "fs";

import { db, storage } from "@/firebase";
import { Key } from "@mui/icons-material";
import { headers } from "next/headers";
import admin from "@/firebase-admin";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { extractKeywordsFromText } from "@/lib/backend/preferences/extract-keywords";
import { uploadPreference } from "@/lib/backend/preferences/upload-preferences";
import { clusterKeywords } from "@/lib/backend/preferences/cluster-keywords";

export async function POST(req: Request) {
  const headersInstance = headers();
  const authorization = headersInstance.get("authorization");
  const { access_token } = await req.json();

  console.log(`access_token`, access_token, `authorization`, authorization);

  if (
    access_token === undefined ||
    !authorization ||
    !authorization.startsWith("Bearer ")
  ) {
    return new NextResponse(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
    });
  }

  const oAuth2Client = new google.auth.OAuth2();
  oAuth2Client.setCredentials({ access_token });
  const youtube = google.youtube({ version: "v3", auth: oAuth2Client });

  try {
    // get all or at most the last 500 videos that the user liked
    let videos = await getUserLikedVideos(youtube);
    let lenAfterUserLikedVideos = Array.from(videos.keys()).length;

    let subscribedChannels = await getUserSubscribedChannels(youtube);

    const subscribedChannelIds = Array.from(subscribedChannels.keys());

    const top20Obj = await getTop20VideosForChannels(
      youtube,
      subscribedChannelIds,
      videos
    );
    if (top20Obj === undefined) return;
    const { videos: videosFromTop20 } = top20Obj;
    videos = videosFromTop20 as Map<string, VideoData>;
    let lenAfterTop20Videos = Array.from(videos.keys()).length;

    if (lenAfterTop20Videos <= lenAfterUserLikedVideos) {
      throw new Error(
        "THE LEN AFTER TOP 20 VIDEOS IS THE SAME OR SMALLER THAN AFTER USER LIKED VIDEOS"
      );
    }

    videos = await setVideoTags(youtube, videos);
    console.log(
      "VIDEOS AFTER setVideoTags len",
      Array.from(videos.keys()).length
    );
    const videosObj = mapToObject(videos);
    const subscribedChannelsObj = mapToObject(subscribedChannels);
    const jsonVideos = JSON.stringify(videosObj);
    const jsonChannels = JSON.stringify(subscribedChannelsObj);
    fs.writeFileSync("./jsonVideos.json", jsonVideos);
    fs.writeFileSync("./jsonChannels.json", jsonChannels);

    // const jsonVideos = require("./jsonVideos.json");

    // const channels = require("./jsonChannels.json");
    let text = "";

    const videoKeys = Array.from(videos.keys());
    videoKeys.forEach((key) => {
      const video = videos.get(key);
      if (!video) return;
      let { description, title, tags, liked } = video;

      if (tags !== undefined) {
        text += tags + " , ";
        if (liked) text += tags + " , " + tags;
      }
    });

    const extractedKeywords = await extractKeywordsFromText(text);
    if (extractedKeywords === undefined)
      throw new Error("no keywords could be extracted from the given text");
    const keywordClusters = await clusterKeywords(extractedKeywords);
    if (extractedKeywords === undefined || extractedKeywords?.length === 0) {
      throw new Error(
        "could not extract any keywords from any of the videos that were searched for in the youtube API"
      );
    }
    const jsonKeywords = JSON.stringify(keywordClusters);
    fs.writeFileSync("./keywords.json", jsonKeywords);

    // const jsonVideos = require("./jsonVideos.json");
    // const jsonChannels = require("./jsonChannels.json");
    // const jsonKeywords = require("./keywords.json");
    const userData = {
      videos: jsonVideos,
      channels: jsonChannels,
      keywords: jsonKeywords,
    } as { [key: string]: string };

    const token = authorization.split(" ")[1];
    const { uid: firebase_uid } = await admin.auth().verifyIdToken(token);
    const docRef = doc(db, "users", firebase_uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error(
        `the user firebase document does not exist, token: ${token}`
      );
    }
    for (const [key, value] of Object.entries(userData)) {
      // const storageRef = ref(
      //   storage,
      //   `/users/preference/${firebase_uid}/${fieldName}.json`
      // );
      // const jsonValue = JSON.stringify(value);
      // console.log("jsonValue undefined", jsonValue === undefined);
      // const byteArray = new Uint8Array(
      //   jsonValue.split("").map((char) => char.charCodeAt(0))
      // );

      // console.log("uintArray undefined", byteArray === undefined);
      // const snapshot = await uploadBytes(storageRef, byteArray);
      // const url = await getDownloadURL(snapshot.ref);
      // setDoc(docRef, { [fieldName]: url }, { merge: true });

      await uploadPreference(
        key as "videos" | "channels" | "keywords",
        value,
        firebase_uid
      );
    }

    return NextResponse.json(userData);
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
