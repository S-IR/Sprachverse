import {
  FrontendVideoData,
  VideoData,
} from "@/constants/preferences/preference-types";
import { youtube_v3 } from "googleapis";

type Videos = Map<string, Partial<FrontendVideoData>>;
type ChannelIds = Map<string, Set<string>> | undefined;

export const searchYoutube = async (
  youtube: youtube_v3.Youtube,
  queries: string[],
  maxResults: number
): Promise<{
  videos: Videos | undefined;
  channelIds: ChannelIds | undefined;
}> => {
  let videos = new Map<string, Partial<FrontendVideoData>>();
  let channelIds = new Map<string, Set<string>>();

  const response = (await youtube.search.list({
    part: "snippet",
    q: queries.join("|"),
    type: "video",
    maxResults: 50,
  })) as unknown as { data: youtube_v3.Schema$SearchListResponse };
  if (
    response === undefined ||
    response.data === undefined ||
    response.data.items === undefined
  ) {
    console.log(`response is empty at search`);
  }
  const items = response.data.items;
  if (items === undefined) return { videos: undefined, channelIds: undefined };
  for (let itemIterator = 0; itemIterator < items.length; itemIterator++) {
    if (videos.entries.length >= maxResults) break;

    const item = items[itemIterator];
    const fields = extractVideoInformation(item, itemIterator);
    if (fields === undefined) continue;
    let {
      channelId: channelId,
      channelTitle: channelTitle,
      publishedAt,
      title,
      videoId,
      description,
    } = fields;
    videos.set(videoId, {
      title,
      description,
      thumbnails: undefined,
      channelId,
      channelTitle,
      publishedAt,
    });
    const particularChannelId = channelIds.get(channelId);
    if (particularChannelId === undefined) {
      channelIds.set(channelId, new Set([videoId]));
    } else {
      particularChannelId.add(videoId);
    }
  }
  return { videos, channelIds };
};

export const extractVideoInformation = (
  item: youtube_v3.Schema$SearchResult,
  i: number
  // totalVideosCount?: number
):
  | (Partial<VideoData> & {
      videoId: string;
      channelId: string;
    })
  | void => {
  if (item === undefined || item.snippet === undefined) {
    return console.log(`video is undefined for ${i}, tag`);
  }
  if (
    item.id === undefined ||
    item.id === null ||
    item.id.videoId === undefined
  ) {
    return console.log(`video ID is undefined for ${i}, tag`);
  }

  const { videoId } = item.id;
  let { title, description, channelId, channelTitle, thumbnails, publishedAt } =
    item.snippet;
  if (!videoId || !channelId) {
    return;
  }
  title = title === null ? undefined : title;
  channelTitle = channelTitle === null ? undefined : channelTitle;

  let publishedAtDate = publishedAt ? new Date(publishedAt) : undefined;

  return {
    videoId,
    title,
    description,
    channelId: channelId,
    channelTitle: channelTitle,
    publishedAt: publishedAtDate,
  };
};

export const getExtraDataForVideos = async (
  youtube: youtube_v3.Youtube,
  videos: Videos
): Promise<Videos | undefined> => {
  const videoKeys = Array.from(videos.keys());
  const totalVideosCount = videoKeys.length;

  for (
    let videoBatchIndex = 0;
    videoBatchIndex < totalVideosCount;
    videoBatchIndex += 50
  ) {
    const videoBatch = videoKeys.slice(videoBatchIndex, videoBatchIndex + 50);
    console.log("DOING A REQUEST TO youtube.videos");

    const videoInfoResponse = (await youtube.videos.list({
      part: "snippet,statistics",
      id: videoBatch.join(","),
      maxResults: 50,
    })) as unknown as { data: youtube_v3.Schema$VideoListResponse };

    const data = videoInfoResponse?.data;
    const items = data?.items;

    if (
      videoInfoResponse === undefined ||
      data === undefined ||
      items === undefined
    ) {
      console.log(`video response is undefined for the list of videos`);
      return;
    }
    for (
      let videoResIterator = 0;
      videoResIterator < items.length;
      videoResIterator++
    ) {
      const videoExtraInfo = items[videoResIterator];

      if (
        videoExtraInfo === undefined ||
        videoExtraInfo.id === undefined ||
        videoExtraInfo.id === null ||
        videoExtraInfo.statistics === undefined ||
        videoExtraInfo.statistics.viewCount === undefined
      ) {
        continue;
      }

      const videoId = videoExtraInfo.id;
      const video = videos.get(videoId);

      if (video === undefined) {
        continue;
      }

      video.views = Number(videoExtraInfo.statistics.viewCount);
      video.tags = videoExtraInfo.snippet?.tags;
      video.thumbnails = videoExtraInfo.snippet?.thumbnails;
      videos.set(videoId, video);
    }
  }
  return videos;
};

export const getChannelThumbnails = async (
  youtube: youtube_v3.Youtube,
  channelIds: Map<string, Set<string>>,
  videos: Videos
): Promise<Videos | undefined> => {
  const channelKeys = Array.from(channelIds.keys());
  const totalChannelsCount = channelKeys.length;
  console.log(
    "getChannelThumbnails ran",
    "totalChannelsCount",
    totalChannelsCount
  );

  for (
    let channelBatchIndex = 0;
    channelBatchIndex < totalChannelsCount;
    channelBatchIndex += 50
  ) {
    const channelBatch = channelKeys.slice(
      channelBatchIndex,
      channelBatchIndex + 50
    );
    console.log("DOING A REQUEST TO youtube.channels");
    const channelResponse = (await youtube.channels.list({
      part: "snippet",
      id: channelBatch.join(","),
      maxResults: 50,
    })) as unknown as { data: youtube_v3.Schema$ChannelListResponse };

    const data = channelResponse?.data;
    const items = data?.items;

    if (
      channelResponse === undefined ||
      data === undefined ||
      items === undefined
    ) {
      console.log(`channel response is undefined for the list of channels`);
      continue;
    }

    for (
      let channelResIterator = 0;
      channelResIterator < items.length;
      channelResIterator++
    ) {
      const channelExtraInfo = items[channelResIterator];

      if (
        channelExtraInfo === undefined ||
        channelExtraInfo.id === undefined ||
        channelExtraInfo.id === null ||
        channelExtraInfo.snippet === undefined ||
        channelExtraInfo.snippet.thumbnails === undefined
      ) {
        continue;
      }

      const thumbnails = channelExtraInfo.snippet.thumbnails;
      const setOfVideos = channelIds.get(channelExtraInfo.id);

      if (setOfVideos === undefined) {
        continue;
      }

      setOfVideos.forEach((videoId) => {
        const video = videos.get(videoId);

        if (video === undefined) {
          console.log(
            `no VIDEO FOUND with with this channelId ${channelExtraInfo.id} `
          );

          return;
        }
        console.log(`'thumbnails NOT undefined`, thumbnails !== undefined);

        video.channelThumbnails = thumbnails;
        videos.set(videoId, video);
      });
    }
  }
  return videos;
};
