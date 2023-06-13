import { FrontendVideoData } from "@/constants/preferences/preference-types";
import { FrontendVideoObj } from "../../../constants/general/videos";

/**
 * Returns a new array containing a specified number of random videos from the input object.
 * Ensures that every two videos in the output array have an 80% chance of having at least two similar tags.
 *
 * @function
 * @param {FrontendVideoObj} videos - The input object containing video data.
 * @param {number} number - The number of videos to be pulled from the input object. Must be an even number.
 * @returns {FrontendVideoObj} - A new array containing the specified number of random videos.
 * @throws {Error} If the provided number is not an even number.
 *
 * @example
 * const inputVideos = {
 *   video1: { tags: ['gaming', 'sports'] },
 *   video2: { tags: ['sports', 'gaming'] },
 *   video3: { tags: ['fashion', 'books'] },
 * };
 *
 * const result = pullRandomVideos(inputVideos, 2);
 * // result might be:
 * // {
 * //   video1: { tags: ['gaming', 'sports'] },
 * //   video2: { tags: ['sports', 'gaming'] },
 * // }
 */
export const pullRandomVideos = (
  videos: FrontendVideoObj,
  number: number
): (FrontendVideoData & { videoId: string })[] => {
  if (number % 2 !== 0)
    throw new Error("the number that is sent to pullRandomVideos must be pair");

  const indexArr = Object.keys(videos);
  const shuffledIndexArr = indexArr.slice(); // Create a copy of the index array
  const maxAttempts = 20; // Maximum number of attempts to shuffle elements

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Fisher-Yates shuffle algorithm
    for (let i = shuffledIndexArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledIndexArr[i], shuffledIndexArr[j]] = [
        shuffledIndexArr[j],
        shuffledIndexArr[i],
      ];
    }

    let isSimilar = true;
    for (let i = 0; i < number - 1; i += 2) {
      const video1 = videos[shuffledIndexArr[i]];
      const video2 = videos[shuffledIndexArr[i + 1]];

      if (!haveCommonElements(video1.tags, video2.tags)) {
        isSimilar = false;
        break;
      }
    }

    if (isSimilar) {
      break;
    }
  }

  // Select the first `number` elements from the shuffled array
  const selectedKeys = shuffledIndexArr.slice(0, number);

  // Construct the final array of video objects
  const arr: (FrontendVideoData & { videoId: string })[] = selectedKeys.map(
    (key) => {
      const video = videos[key];
      return { ...video, videoId: key };
    }
  );

  return arr;
};

function haveCommonElements(
  arr1: any[] | undefined | null,
  arr2: any[] | undefined | null
) {
  if (!arr1 || !arr2) return false;
  const commonElements = arr1.filter((value) => arr2.includes(value));

  return commonElements.length >= 2;
}
