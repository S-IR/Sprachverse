import { NextApiRequest, NextApiResponse } from "next";
import util from "util";
import { google, youtube_v3 } from "googleapis";
import { NextResponse } from "next/server";

import { db, storage } from "@/firebase";
import { Key } from "@mui/icons-material";
import { headers } from "next/headers";
import admin from "@/firebase-admin";
import { doc, getDoc, setDoc } from "firebase/firestore";

export async function GET(req: Request) {
  const headersInstance = headers();
  const authorization = headersInstance.get("authorization");
  const { access_token } = await req.json();

  if (
    access_token === undefined ||
    !authorization ||
    !authorization.startsWith("Bearer ")
  ) {
    return new NextResponse(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
    });
  }

  try {
    const token = authorization.split(" ")[1];
    const { uid: firebase_uid } = await admin.auth().verifyIdToken(token);
    const docRef = doc(db, "users", firebase_uid);
    const docSnap = await getDoc(docRef);
    let videoUrl,
      keywordUrl: string = "";
    if (docSnap.exists()) {
      const { videos, keywords } = docSnap.data();
      videoUrl = videos;
      keywordUrl = keywords;
    } else {
      return NextResponse.json(
        {
          error:
            "bad request. The user does not have a firebas field containing the videos and the keywords",
        },
        { status: 401 }
      );
    }
    const videosRes = await fetch(videoUrl as unknown as string);
    const jsonVideos = await videosRes.json();
    const keywordsRes = await fetch(keywordUrl as unknown as string);
    const jsonKeywords = await keywordsRes.json();

    const videos = JSON.parse(jsonVideos);
    const { keywords } = JSON.parse(jsonKeywords);

    console.log("videos", videos, "keywords", keywords);

    return NextResponse.json({ videos, keywords });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
