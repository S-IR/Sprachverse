import React, { useState } from "react";
import {
  animated,
  useSpring,
  config,
  useSpringRef,
  useTransition,
} from "react-spring";
import GoogleButton from "@/components/general/buttons/GoogleButton";
import useAuthThirdParty from "@/hooks/useAuthThirdParty";
import { setUserPreferences } from "@/lib/frontend/preferences/fetches";
import { StageTwoOption } from "../StageTwoInteractions";
import { useMutation, useQueryClient } from "react-query";
import { useUserStore } from "@/store/UserStore";
import { useModalStore } from "@/store/ModalBoxStore";

interface props {
  setChosenOption: React.Dispatch<React.SetStateAction<StageTwoOption>>;
  setProgressStage: React.Dispatch<React.SetStateAction<1 | 2 | 3>>;
}

const ChooseOptionsStageTwo = ({
  setChosenOption,
  setProgressStage,
}: props) => {
  const queryClient = useQueryClient();
  const [languageLevel] = useUserStore((store) => [store.UserLanguagesLevel]);
  const [CHANGE_MODAL_TYPE, CHANGE_MODAL_TEXT] = useModalStore((store) => [
    store.CHANGE_MODAL_TYPE,
    store.CHANGE_MODAL_TEXT,
  ]);

  const [authWithGoogle] = useAuthThirdParty(languageLevel);
  const googleMutation = useMutation(authWithGoogle, {
    onSuccess: async (data) => {
      console.log("data", data);

      if (data.status === "success") {
        console.log("auth successful");

        if (!data.oauthAccessToken)
          throw new Error("no oAuthAccessToken from authRes");
        const accessToken = data.oauthAccessToken;
        queryClient.setQueryData("userGoogleAccessToken", accessToken);
        // const token = await data.user.getIdToken();
        // const userPreferencesRes = await setUserPreferences(
        //   accessToken,
        //   token
        // );
        // const json = await userPreferencesRes.json();
        // console.log("json", json);
        return setChosenOption("please-wait");
      } else {
        CHANGE_MODAL_TYPE("generic-error");
        CHANGE_MODAL_TEXT({
          title: "Error while authenticating",
          text: "An error has occured while trying to authenticate you. Please try again later",
        });
      }
    },
  });

  return (
    <div className="flex h-full min-h-[75vh] w-full flex-col justify-center overflow-clip ">
      <h2 className="!md:my-8  w-full pt-12 text-center font-fantasy text-4xl font-bold text-yellow-600">
        Now let us determine your preferences
      </h2>
      <h4 className="w-full text-center font-fantasy font-bold text-yellow-600">
        You can either allow us to get your preferences from google or take a
        small quiz
      </h4>
      <div className="flex h-96 w-full flex-row pt-4">
        <div className="relative flex h-full w-1/2 flex-col items-center border-2 border-black/40 bg-orange-900/10">
          <h4 className="absolute left-0 top-0 my-4 w-full text-center font-fantasy text-2xl font-bold text-white">
            Authenticate through Google
          </h4>
          <div className="my-4 flex grow flex-col items-center justify-center align-middle">
            <GoogleButton
              text="Sign up with Google"
              w="lg"
              onClick={() => googleMutation.mutate()}
            />
          </div>
        </div>
        <div className="m relative flex  h-full w-1/2  flex-col items-center border-2 border-black/40 bg-orange-900/10">
          <h4 className="absolute left-0 top-0 my-4 w-full text-center font-fantasy text-2xl font-bold text-white">
            Take a small quiz
          </h4>
          <div className="my-4 flex grow flex-col items-center justify-center align-middle">
            <button
              className="h-12 w-64 rounded-md border-2 border-orange-900 bg-rose-950 font-fantasy text-xl transition-all duration-300 hover:bg-rose-800"
              onClick={() => setChosenOption("category-quiz")}
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseOptionsStageTwo;
