import { NextApiRequest, NextApiResponse } from "next";
import util from "util";
import { google, youtube_v3 } from "googleapis";
import { NextResponse } from "next/server";
import { GaxiosPromise } from "googleapis/build/src/apis/abusiveexperiencereport";
import internal from "stream";
import {
  FrontendVideoData,
  SubscribedChannelsType,
  VideoData,
} from "@/constants/preferences/preference-types";
import {
  ChannelIds,
  getTop20VideosForChannels,
  mapToObject,
} from "@/lib/backend/preferences";
import fs from "fs";
import {
  getChannelThumbnails,
  getExtraDataForVideos,
  searchYoutube,
} from "@/lib/backend/videos/search-video";
import { assert } from "console";

/**
 * This route is meant to fetch youtube videos for the stage two interactions on the main page.
 * It is a post route in order to not have problems with the limit of titles | tags that can be sent
 * Due to the fact that the user does not have a specific set of tags already at the very beginning, this route will let him search videos based only on tags and then display the results
 * The other option is to search based on a set of titles (which can be a combination of a title and a tag we choose to).
 * This API will fetcth the youtube API based on those sent values and then return the desired amount of videos
 * @param req
 * @returns
 */
export async function POST(req: Request) {
  const { queries, maxResults }: { queries: string[]; maxResults: number } =
    await req.json();
  if (queries === undefined || maxResults === undefined || maxResults > 150) {
    return new NextResponse(JSON.stringify({ error: "bad request" }), {
      status: 400,
    });
  }

  if (process.env.NODE_ENV === "development") {
    console.log("sending developer json");

    const videosObj = JSON.parse(fs.readFileSync("./videosObj.json", "utf-8"));
    return NextResponse.json({ videos: videosObj });
  }
  const youtube = google.youtube({
    version: "v3",
    auth: process.env.YOUTUBE_API_KEY,
  });

  try {
    //channel ids represents a map where the key is the channnel id and the value is all of the videos fetched that have that particular channel as the channel that they uplaoded them from

    let { videos, channelIds } = await searchYoutube(
      youtube,
      queries,
      maxResults
    );
    if (videos === undefined || channelIds === undefined) {
      return NextResponse.json(
        { message: "Youtube did not respond with any videos in searching" },
        { status: 500 }
      );
    }
    let videosChannelIds = Array.from(
      new Set(Array.from(videos.values()).map((vid) => vid.channelId))
    ).sort();

    let channelIdsKeys = Array.from(channelIds.keys()).sort();
    console.log(
      `videosChannelIds`,
      videosChannelIds,
      `channelIdsKeys`,
      channelIdsKeys
    );

    assert(
      JSON.stringify(videosChannelIds) == JSON.stringify(channelIdsKeys),
      "THE ARRAYS ARE NOT THE SAME after SEARCH"
    );
    const top20Obj = await getTop20VideosForChannels(
      youtube,
      Array.from(channelIds.keys()),
      videos,
      maxResults,
      channelIds
    );
    if (top20Obj === undefined) return;
    videos = top20Obj.videos;
    channelIds = top20Obj.channelIds as ChannelIds;

    videosChannelIds = Array.from(
      new Set(Array.from(videos.values()).map((vid) => vid.channelId))
    ).sort();
    channelIdsKeys = Array.from(channelIds.keys()).sort();
    console.log(
      `videosChannelIds`,
      videosChannelIds,
      `channelIdsKeys`,
      channelIdsKeys
    );

    assert(
      JSON.stringify(videosChannelIds) == JSON.stringify(channelIdsKeys),
      "THE ARRAYS ARE NOT THE SAME after TOP 20"
    );
    videos = top20Obj.videos;
    channelIds = top20Obj.channelIds;
    if (videos === undefined || channelIds === undefined) {
      return NextResponse.json(
        {
          message:
            "Youtube did not respond with top videos for the channels in searching",
        },
        { status: 500 }
      );
    }
    videos = await getExtraDataForVideos(youtube, videos);
    if (videos === undefined || channelIds === undefined) {
      return NextResponse.json(
        {
          message:
            "Youtube did not respond with the views for the videos in searching",
        },
        { status: 500 }
      );
    }
    videosChannelIds = Array.from(
      new Set(Array.from(videos.values()).map((vid) => vid.channelId))
    ).sort();
    channelIdsKeys = Array.from(channelIds.keys()).sort();
    console.log(
      `videosChannelIds`,
      videosChannelIds,
      `channelIdsKeys`,
      channelIdsKeys
    );

    assert(
      JSON.stringify(videosChannelIds) == JSON.stringify(channelIdsKeys),
      "THE ARRAYS ARE NOT THE SAME after EXTRA DATA"
    );

    videos = await getChannelThumbnails(youtube, channelIds, videos);
    if (videos === undefined || channelIds === undefined) {
      return NextResponse.json(
        { message: "Youtube did not respond with the channel thumbnails" },
        { status: 500 }
      );
    }
    videosChannelIds = Array.from(
      new Set(Array.from(videos.values()).map((vid) => vid.channelId))
    ).sort();
    channelIdsKeys = Array.from(channelIds.keys()).sort();
    console.log(
      `videosChannelIds`,
      videosChannelIds,
      `channelIdsKeys`,
      channelIdsKeys
    );

    assert(
      JSON.stringify(videosChannelIds) == JSON.stringify(channelIdsKeys),
      "THE ARRAYS ARE NOT THE SAME after getChannelThumbnails"
    );

    const videosObj = mapToObject(videos);
    fs.writeFileSync("./videosObj.json", JSON.stringify(videosObj));

    return NextResponse.json({ videos: videosObj });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
