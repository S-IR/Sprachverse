import Image from "next/image";
import React from "react";
import { useState, Dispatch, SetStateAction } from "react";
import GoogleButton from "../general/buttons/GoogleButton";
import useAuthThirdParty from "@/hooks/useAuthThirdParty";

interface props {
  setProgressStage: Dispatch<SetStateAction<1 | 2 | 3>>;
}
const StageTwoInteractions = ({}: props) => {
  const [authWithGoogle] = useAuthThirdParty();
  return (
    <section className="relative mx-[5vw] my-[5vh] flex h-full min-h-[75vh] w-3/4 flex-1 flex-col items-center justify-center  overflow-clip rounded-3xl bg-rose-950/40 align-middle  ">
      <Image
        className="absolute left-0 top-0 -z-10 rounded-3xl opacity-5 "
        fill
        src={"/homepage/stage-two/bg.png"}
        alt={"Background image for stage one"}
        style={{ objectFit: "cover" }}
      />

      <h3 className="!md:my-8  w-full pt-12 text-center font-fantasy text-4xl font-bold text-yellow-600">
        Now let us see what you like
      </h3>
      <h4 className="w-full text-center font-fantasy font-bold text-yellow-600">
        You can either allow us to get your preferences from google or take a
        small quiz
      </h4>
      <div className="flex h-full w-full flex-row pt-4">
        <div className="relative flex h-full w-1/2 flex-col items-center border-2 border-black/40 bg-orange-900/10">
          <h4 className="absolute left-0 top-0 my-4 w-full text-center font-fantasy text-2xl font-bold text-white">
            Authenticate through Google
          </h4>
          <div className="my-4 flex grow flex-col items-center justify-center align-middle">
            <GoogleButton
              text="Sign up with Google"
              w="lg"
              onClick={async () => {
                const authRes = await authWithGoogle();
                if (authRes.status === "error") {
                  console.log(authRes.error);
                }
              }}
            />
          </div>
        </div>
        <div className="m relative flex  h-full w-1/2  flex-col items-center border-2 border-black/40 bg-orange-900/10">
          <h4 className="absolute left-0 top-0 my-4 w-full text-center font-fantasy text-2xl font-bold text-white">
            Take a small quiz
          </h4>
          <div className="my-4 flex grow flex-col items-center justify-center align-middle">
            <button
              className="h-12 w-64  rounded-md border-2 border-orange-900 bg-rose-950 font-fantasy text-xl transition-all duration-300 hover:bg-rose-800"
              onClick={() => {
                throw new Error("WORK IN PROGRESS");
              }}
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StageTwoInteractions;
