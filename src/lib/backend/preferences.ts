import {
  SubscribedChannelsType,
  VideoData,
} from "@/constants/preferences/preference-types";
import { youtube_v3 } from "googleapis";

/**
 * Using the youtube API get all of the liked videos or at MOST the latest 500 liked videos of the usert
 * @param youtube The youtube instance that has the user's OAuth
 * @returns
 */
export const getUserLikedVideos = async (
  youtube: youtube_v3.Youtube
): Promise<Map<string, VideoData>> => {
  let videos = new Map<string, VideoData>();

  let totalVideoResults = 0;
  const playlistId = "LL";

  let pageToken = undefined;

  while (totalVideoResults < 500) {
    const youtubeRes = (await youtube.playlistItems.list({
      part: ["snippet"],
      playlistId: playlistId,
      maxResults: 50,
      pageToken,
    })) as unknown as { data: youtube_v3.Schema$PlaylistItemListResponse };
    const items = youtubeRes.data.items;
    //if items is undefined that means that there are no more videos to be added as the response was empty
    if (items === undefined) break;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const fields = extractVideoInformation(item, i, totalVideoResults);
      if (fields === undefined) continue;
      const {
        title,
        description,
        videoOwnerChannelId,
        videoOwnerChannelTitle,
        publishedAt,
        videoId,
      } = fields;
      videos.set(videoId, {
        title,
        description,
        videoOwnerChannelId,
        videoOwnerChannelTitle,
        publishedAt,
        tags: [],
        liked: true,
      });
    }
    totalVideoResults += items.length;
    pageToken = youtubeRes.data.nextPageToken;
    if (!pageToken) {
      break;
    }
  }
  return videos;
};

/**
 * Using the youtube API get all of the channels the user is subscribed to or at MOST the latest 150 subscribed channels
 * @returns
 */
export const getUserSubscribedChannels = async (
  youtube: youtube_v3.Youtube
): Promise<Map<string, SubscribedChannelsType>> => {
  let pageToken = undefined;
  let totalChannelResults = 0;
  let subscribedChannels = new Map<string, SubscribedChannelsType>();

  while (totalChannelResults < 150) {
    const youtubeRes = (await youtube.subscriptions.list({
      part: ["snippet"],
      maxResults: 50,
      pageToken,
      mine: true,
    })) as unknown as { data: youtube_v3.Schema$PlaylistItemListResponse };
    const items = youtubeRes.data.items;
    if (items === undefined) break;

    items?.forEach((item, i) => {
      if (item.snippet === undefined) {
        return console.log(
          `snippet is undefined for ${i}th item at a total len of ${
            totalChannelResults + i + 1
          } for channels`
        );
      }
      const { title, description, resourceId } = item.snippet;
      if (resourceId === undefined) {
        return console.log(
          `resourceId is undefined for ${i}th item at a total len of results of ${
            totalChannelResults + i + 1
          }  for channels`
        );
      }
      const channelId = resourceId.channelId;

      if (title === undefined || title === null) {
        return console.log(
          `videoTtile is undefined for ${i}th item at a total len of results of ${
            totalChannelResults + i + 1
          }, channelId ${channelId}`
        );
      }

      if (description === undefined || description === null) {
        return console.log(
          `description is undefined for ${i}th item at a total len of results of ${
            totalChannelResults + i + 1
          }, channelId ${channelId}`
        );
      }

      if (channelId === undefined || channelId === null) {
        return console.log(
          `publishedAt is undefined for ${i}th item at a total len of results of ${
            totalChannelResults + i + 1
          }}`
        );
      }
      subscribedChannels.set(channelId, {
        title,
        description,
      });
    });
    totalChannelResults += items.length;
    pageToken = youtubeRes.data.nextPageToken;
    if (!pageToken) {
      break;
    }
  }
  return subscribedChannels;
};

/**
 * Retrieves the top 25 most viewed videos from the last 100 videos of each subscribed channel.
 * The videos are added to the provided videosMap with the 'liked' property set to false.
 * Tags for each video are also extracted.
 *
 * @param {youtube_v3.Youtube} youtube - The YouTube API client object.
 * @param {string[]} channelIds - An array of channel IDs for the user's subscribed channels.
 * @param {Map<string, VideoData>} videosMap - The existing Map object to store video data.
 * @returns {Promise<Map<string, VideoData>>} A Promise that resolves to the updated videosMap containing the top 25 most viewed videos from each subscribed channel.
 */
export const getTop20VideosForChannels = async (
  youtube: youtube_v3.Youtube,
  channelIds: string[],
  videosMap: Map<string, VideoData>
) => {
  for (const channelId in channelIds) {
    // Get the channel's 'uploads' playlist ID
    const channelResponse = (await youtube.channels.list({
      part: "contentDetails",
      id: channelId,
    })) as unknown as { data: youtube_v3.Schema$ChannelListResponse };

    const items = channelResponse.data.items;
    if (
      items === undefined ||
      items === null ||
      items[0] === undefined ||
      items[0] === null
    )
      break;
    if (items[0].contentDetails === undefined) break;
    if (
      items[0].contentDetails.relatedPlaylists === null ||
      items[0].contentDetails.relatedPlaylists === undefined
    )
      break;
    const uploadsPlaylistId = items[0].contentDetails.relatedPlaylists
      .uploads as string;

    // Fetch the first 100 videos from the 'uploads' playlist
    let totalUploadPlaylistResults = 0;
    let pageToken = undefined;
    let intermediateVideos = new Map<
      string,
      VideoData & { viewCount: number }
    >();

    while (totalUploadPlaylistResults < 100) {
      const response = (await youtube.playlistItems.list({
        part: ["snippet"],
        playlistId: uploadsPlaylistId,
        maxResults: 50,
        pageToken: pageToken,
      })) as unknown as { data: youtube_v3.Schema$PlaylistItemListResponse };

      const items = response.data.items;
      if (items === undefined) break;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const fields = extractVideoInformation(
          item,
          i,
          totalUploadPlaylistResults
        );
        if (fields === undefined) continue;
        const {
          description,
          publishedAt,
          title,
          videoId,
          videoOwnerChannelId,
          videoOwnerChannelTitle,
        } = fields;
        intermediateVideos.set(videoId, {
          description,
          publishedAt,
          title,
          videoOwnerChannelId,
          videoOwnerChannelTitle,
          viewCount: 0,
          tags: [],
          liked: false,
        });
      }
      totalUploadPlaylistResults += items.length;
      pageToken = response.data.nextPageToken;
      if (!pageToken) {
        break;
      }
    }

    // Fetch video view counts, tags, and sort by view count
    const intermediateVideosKeysArr = Array.from(intermediateVideos.keys());
    const videoIdsString = intermediateVideosKeysArr.join(",");
    let statistics: youtube_v3.Schema$Video[] = [];
    for (
      let batchIndex = 0;
      batchIndex < intermediateVideosKeysArr.length;
      batchIndex += 50
    ) {
      const videoResponse = (await youtube.videos.list({
        part: "statistics,snippet",
        id: videoIdsString,
        maxResults: 50,
      })) as unknown as { data: youtube_v3.Schema$VideoListResponse };
      const items = videoResponse.data.items;
      if (items === undefined) {
        console.log(
          `video response for ${channelId} for all of the statistics of his uploaded videos is undefined`
        );
        break;
      }
      statistics.push(...items);
    }
    for (let j = 0; j < statistics.length; j++) {
      const videoStatistic = statistics[j];
      const viewCount = videoStatistic.statistics?.viewCount;
      if (
        videoStatistic === undefined ||
        viewCount === undefined ||
        viewCount === null ||
        videoStatistic.id === undefined ||
        videoStatistic.id === null
      ) {
        console.log(
          `statistical data for ${j}th element in the statistic is undefined or null, for the ${channelId}`
        );
        continue;
      }
      const id = videoStatistic.id;
      const tags = videoStatistic.snippet?.tags as string[];
      const newValueWithoutTags = intermediateVideos.get(id);
      if (newValueWithoutTags === undefined) {
        console.log(
          `could not find a video id given from statistic from the intermediate video map in order to set the tags, channelId: ${channelIds}`
        );
        continue;
      }
      intermediateVideos.set(id, { ...newValueWithoutTags, tags });
    }
    //filters the array to only include the top 25 results
    statistics = statistics
      .sort((a, b) => {
        const aStatistics = a.statistics?.viewCount;
        const bStatistics = b.statistics?.viewCount;
        if (
          aStatistics === undefined ||
          bStatistics === undefined ||
          aStatistics === null ||
          bStatistics === null
        )
          return 0;
        return parseInt(bStatistics) - parseInt(aStatistics);
      })
      .slice(0, 25);

    //filters the intermediate Map
    const filteredMap = new Map(
      statistics.map((statistic) => {
        const item = intermediateVideos.get(statistic.id as string);
        const newItem = { ...item };
        delete newItem.viewCount;
        return [statistic.id, newItem];
      })
    );

    videosMap = { ...filteredMap, ...videosMap };

    // Store the top 25 videos with tags in the map using the channel ID as key
  }
  return videosMap;
};

export const setVideoTags = async (
  youtube: youtube_v3.Youtube,
  videosMap: Map<string, VideoData>
) => {
  const videoIdsArr = Array.from(videosMap.keys());
  const filteredVideoIdsArr = videoIdsArr.filter((id) => {
    const item = videosMap.get(id);
    return item !== undefined && item.tags.length === 0;
  });

  for (let i = 0; i < filteredVideoIdsArr.length; i += 50) {
    const batch = filteredVideoIdsArr.slice(i, i + 50);
    const videoIdsString = batch.join(",");

    const videoResponse = (await youtube.videos.list({
      part: "snippet",
      id: videoIdsString,
    })) as unknown as { data: youtube_v3.Schema$VideoListResponse };

    const items = videoResponse.data.items;
    if (items === undefined) break;
    items.forEach((item, itemIterator) => {
      if (item.snippet === undefined) {
        console.log(
          `item.snippet given is undefined, at ${i + 1 + itemIterator} th video`
        );
        return;
      }

      const video = videosMap.get(item.id as string);
      if (video === undefined) {
        console.log(
          `video with the given key is undefined in the map,at ${
            i + 1 + itemIterator
          } th video `
        );
        return;
      }
      video.tags = item.snippet.tags as string[];
      videosMap.set(item.id as string, video);
    });
  }
  return videosMap;
};

/**
 * Extracts the video information that is necessary from the yotube playlistItem
 * @param item the instance of the playlist item
 * @param i the iterator referring to the position of the item in the larger items array
 * @param totalVideosCount the total videos that have been sent, as a number, before this items array
 * @returns an object containing every video data except liked (you can set it up depending on where you use this fn) alongside the videoId
 */
const extractVideoInformation = (
  item: youtube_v3.Schema$PlaylistItem,
  i: number,
  totalVideosCount: number = 0
): (Omit<VideoData, "liked"> & { videoId: string }) | void => {
  if (item.snippet === undefined) {
    return console.log(
      `snippet is undefined for ${i}th item at a total len of results of ${totalVideosCount} for videos`
    );
  }
  const {
    title,
    description,
    videoOwnerChannelId,
    videoOwnerChannelTitle,
    publishedAt,
    resourceId,
  } = item.snippet;
  if (resourceId === undefined) {
    return console.log(
      `resourceId is undefined for ${i}th item at a total len of results of ${
        totalVideosCount + i + 1
      } for videos`
    );
  }
  const videoId = item.hasOwnProperty("resourceId")
    ? resourceId.videoId
    : item.id;
  if (title === undefined || title === null) {
    return console.log(
      `videoTtile is undefined for ${i}th item at a total len of results of ${
        totalVideosCount + i + 1
      }, videoId ${videoId}  for videos`
    );
  }
  if (videoOwnerChannelId === undefined || videoOwnerChannelId === null) {
    return console.log(
      `videoOwnerChannelId is undefined for ${i}th item at a total len of results of ${
        totalVideosCount + i + 1
      }, videoId ${videoId} for videos`
    );
  }
  if (videoOwnerChannelTitle === undefined || videoOwnerChannelTitle === null) {
    return console.log(
      `videoOwnerChannelTitle is undefined for ${i}th item at a total len of results of ${
        totalVideosCount + i + 1
      }, videoId ${videoId} for videos`
    );
  }
  if (publishedAt === undefined || publishedAt === null) {
    return console.log(
      `publishedAt is undefined for ${i}th item at a total len of results of ${
        totalVideosCount + i + 1
      }, videoId ${videoId} for videos`
    );
  }
  const publishedAtDate = new Date(publishedAt);

  if (videoId === undefined || videoId === null) {
    return console.log(
      `publishedAt is undefined for ${i}th item at a total len of results of ${
        totalVideosCount + i + 1
      }} for videos`
    );
  }
  return {
    videoId,
    title,
    description,
    videoOwnerChannelId,
    publishedAt: publishedAtDate,
    tags: [],
    videoOwnerChannelTitle,
  };
};

export function mapToObject(map: Map<any, any>) {
  const obj: {[key: string] : any} = {};
  const mapKeyArr = Array.from(map.keys())
  for (const key of mapKeyArr) {
    obj[key] = map.get(key);
  }
  return obj;
} 