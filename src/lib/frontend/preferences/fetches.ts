import {
  FrontendVideoObj,
  FrontendVideoObjSchema,
} from "@/constants/general/videos";
import {
  FrontendVideoData,
  FrontendVideoDataSchema,
} from "@/constants/preferences/preference-types";
import { mapToObject } from "@/lib/backend/preferences";
import { KeywordGroup } from "@/lib/backend/preferences/cluster-keywords";
import { z } from "zod";

type SetUserPreferencesHeader = {
  "Content-Type": "application/json";
  Authorization?: string | undefined;
};

export const setUserPreferences = async (
  access_token: string,
  firebase_jwt?: string
) => {
  const headers: SetUserPreferencesHeader = {
    "Content-Type": "application/json",
  };

  if (firebase_jwt) {
    headers["Authorization"] = `Bearer ${firebase_jwt}`;
  }
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER}/api/users/preferences/from-google-auth`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({ access_token }),
    }
  );
  return res;
};

export const setQuizUserPreferences = async (
  videos: FrontendVideoObj,
  firebase_jwt?: string
) => {
  const headers: SetUserPreferencesHeader = {
    "Content-Type": "application/json",
  };

  if (firebase_jwt) {
    headers["Authorization"] = `Bearer ${firebase_jwt}`;
  }
  FrontendVideoObjSchema.parse(videos);
  const res = await fetch("/api/users/preferences/from-quiz", {
    method: "POST",
    headers,
    body: JSON.stringify({ videos }),
  });

  if (!res.ok) throw new Error(res.text);
  const { keywords }: { keywords: KeywordGroup } = await res.json();
  z.array(z.string()).parse(keywords);
  return { videos, keywords };
};
