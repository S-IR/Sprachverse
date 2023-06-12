import { useEffect } from "react";
import { StageTwoOption } from "../StageTwoInteractions";
import { PuffLoader } from "react-spinners";
import { useQuery, useQueryClient } from "react-query";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import {
  setQuizUserPreferences,
  setUserPreferences,
} from "@/lib/frontend/preferences/fetches";
import { VideoData } from "@/constants/preferences/preference-types";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { FrontendVideoObj } from "@/constants/general/videos";

interface props {
  setChosenOption: React.Dispatch<React.SetStateAction<StageTwoOption>>;
  setProgressStage: React.Dispatch<React.SetStateAction<1 | 2 | 3>>;
}
const PleaseWaitStageTwo = ({ setChosenOption, setProgressStage }: props) => {
  const queryClient = useQueryClient();

  const { data: userGoogleAccessToken } = useQuery<string>(
    "userGoogleAccessToken"
  );
  const { data: keywords } = useQuery<string[]>("userKeywords");
  const { data: selectedVideos } = useQuery<FrontendVideoObj>("userVideos");

  const [user, userLoading] = useAuthState(auth);

  const userPreferences = useUserPreferences(user, userLoading);
  useEffect(() => {
    console.log("userPreferences", userPreferences);
  }, [userPreferences]);

  useEffect(() => {
    console.log("selectedVideos", selectedVideos);
  }, [selectedVideos]);
  useEffect(() => {
    console.log("keywords", keywords);
  }, [keywords]);

  useEffect(() => {
    if (userPreferences !== null) {
      setProgressStage(3);
    }
    const isGoogleOption = userGoogleAccessToken !== undefined;
    const isQuizRoute = selectedVideos !== undefined && keywords === undefined;
    if (isGoogleOption) {
      if (!user || userLoading) return;
      const awaitBackendRes = async () => {
        const token = await user.getIdToken();
        const userPreferencesRes = await setUserPreferences(
          userGoogleAccessToken,
          token
        );
        if (userPreferencesRes.ok) {
          setProgressStage(3);
        }
      };
      awaitBackendRes();
    } else if (isQuizRoute) {
      const goToStageThree = async () => {
        const firebase_jwt = user ? await user.getIdToken() : undefined;
        const { keywords } = await setQuizUserPreferences(
          selectedVideos,
          firebase_jwt
        );
        queryClient.setQueryData("userKeywords", keywords);

        setProgressStage(3);
      };
      goToStageThree();
    }
  }, []);

  return (
    <section className="flex h-full min-h-[60vh] w-full flex-col items-center justify-center space-y-14 align-middle ">
      <h3 className="font-fantasy text-4xl text-yellow-600">Please Wait</h3>
      <PuffLoader
        className=" h-24 w-24"
        color="orange"
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </section>
  );
};

export default PleaseWaitStageTwo;
