import { NextResponse } from "next/server";

import { db, storage } from "@/firebase";
import { headers } from "next/headers";
import admin from "@/firebase-admin";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  FrontendVideoObj,
  FrontendVideoObjSchema,
} from "@/constants/general/videos";
import { extractKeywordsFromText } from "@/lib/backend/preferences/extract-keywords";
import { clusterKeywords } from "@/lib/backend/preferences/cluster-keywords";
import { uploadPreference } from "@/lib/backend/preferences/upload-preferences";

/**
 * POST route for processing video data sent from the quiz part of the website and storing user those extracted prefernces.
 * @async
 * @function
 */
export async function POST(req: Request) {
  const headersInstance = headers();
  const authorization = headersInstance.get("authorization");
  const { videos }: { videos: FrontendVideoObj[] } = await req.json();

  console.log(`videos`, videos, `authorization`, authorization);

  const isAuthButNoBearer =
    authorization !== null && !authorization.startsWith("Bearer ");
  if (videos === undefined || isAuthButNoBearer) {
    return new NextResponse(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
    });
  }

  try {
    FrontendVideoObjSchema.parse(videos);

    // get all or at most the last 500 videos that the user liked

    const text = videos
      .map((video) => `${video.text}, ${video.tags}`)
      .join(",");
    const extractedKeywords = await extractKeywordsFromText(text);
    if (extractedKeywords === undefined)
      throw new Error(
        "no keywords could be extracted from the given titles and tags"
      );
    const keywordClusters = await clusterKeywords(extractedKeywords);

    const userData = JSON.stringify({ videos, keywords: keywordClusters });
    if (authorization !== null) {
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
        await uploadPreference(
          key as "videos" | "channels" | "keywords",
          value,
          firebase_uid
        );
      }
    }
    return NextResponse.json({ keywords: keywordClusters });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
