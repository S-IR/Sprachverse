import { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import { User } from "firebase/auth";

export const useUserPreferences = (
  user: User | null | undefined,
  userLoading: boolean
): { videosUrl: string; keywordsUrl: string } | null => {
  const [userPreferences, setUserPreferences] = useState<{
    videosUrl: string;
    keywordsUrl: string;
  } | null>(null);

  useEffect(() => {
    if (!userLoading && user) {
      user
        .getIdTokenResult()
        .then((idTokenResult) => {
          console.log("idToken", idTokenResult);

          const { videosUrl, keywordsUrl } = idTokenResult.claims;
          setUserPreferences({ videosUrl, keywordsUrl });
        })
        .catch(() => setUserPreferences(null));
    }
  }, [userLoading, user]);

  return userPreferences;
};
