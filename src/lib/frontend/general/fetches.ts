import { FrontendVideoObj } from "@/constants/general/videos";
import {
  FrontendVideoData,
  VideoData,
} from "@/constants/preferences/preference-types";

export const fetchVideosForQuiz = async (
  queryArr: string[]
): Promise<FrontendVideoObj> => {
  const shuffledArr = [...queryArr].sort(() => 0.5 - Math.random());

  const randomTags = shuffledArr.slice(0, 4);
  console.log("random tags to be fetched", randomTags);

  const res = await fetch("/api/services/videos/quiz", {
    method: "POST",
    body: JSON.stringify({ queries: randomTags, maxResults: 100 }),
  });
  const { videos } = (await res.json()) as { videos: FrontendVideoObj };
  return videos;
};
export const requestSetSessionCookie = async (token: string): Promise<void> => {
  const res = await fetch("/api/users/session-cookie", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("response from setSession", res.statusText);

  if (!res.ok) {
    throw new Error(`Failed to set tier: ${res.statusText}`);
  }
};
