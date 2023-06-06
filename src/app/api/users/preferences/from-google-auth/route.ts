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
import fs from "fs";
// generate a url that asks permissions for Blogger and Google Calendar scopes

export async function POST(req: Request) {
  const { access_token, firebase_UID } = await req.json();

  console.log(`access_token`, access_token, `firebase_uid`, firebase_UID);

  if (access_token === undefined || firebase_UID === undefined) {
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
    console.log(
      "VIDEOS AFTER getUserLikedVideos  is EMPTY?",
      Array.from(videos.keys()).length === 0
    );

    let subscribedChannels = await getUserSubscribedChannels(youtube);
    console.log(
      "subscribedChannels AFTER getUserSubscribedChannels  is EMPTY?",
      Array.from(subscribedChannels.keys()).length === 0
    );

    const subscribedChannelIds = Array.from(subscribedChannels.keys());

    videos = await getTop20VideosForChannels(
      youtube,
      subscribedChannelIds,
      videos
    );
    console.log(
      "VIDEOS AFTER getTop20VideosForChannels is EMPTY?",
      Array.from(videos.keys()).length === 0
    );

    videos = await setVideoTags(youtube, videos);
    console.log(
      "VIDEOS AFTER setVideoTags  is EMPTY?",
      Array.from(videos.keys()).length === 0
    );
    const videosObj = mapToObject(videos);
    const subscribedChannelsObj = mapToObject(subscribedChannels);
    const jsonVideos = JSON.stringify(videosObj);
    const jsonChannels = JSON.stringify(subscribedChannelsObj);
    fs.writeFileSync("./jsonVideos.json", jsonVideos);
    fs.writeFileSync("./jsonChannels.json", jsonChannels);
    return NextResponse.json({ videosObj, subscribedChannelsObj });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({ error: error.message });
  }
}
