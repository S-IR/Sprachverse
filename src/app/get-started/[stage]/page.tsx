"use client";
import Image from "next/image";
import { GetStaticProps } from "next";
import { useState, Dispatch, SetStateAction, useRef } from "react";
import { useTransition, animated } from "react-spring";
import { useEffect } from "react";
import {
  ProgressSidebar,
  StageThreeInteractions,
  StageTwoInteractions,
} from "@/components/homepage";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import { useSearchParams, useParams, useRouter } from "next/navigation";

function determineStageComponent(
  progressStage: 1 | 2 | 3,
  setProgressStage: Dispatch<SetStateAction<1 | 2 | 3>>
) {
  switch (progressStage) {
    case 1:
    // return <StageOneInteractions setProgressStage={setProgressStage} />;
    case 2:
      return <StageTwoInteractions setProgressStage={setProgressStage} />;
    case 3:
      return <StageThreeInteractions setProgressStage={setProgressStage} />;
    default:
      throw new Error("no stage to show");
  }
}
export default function Page() {
  const { stage } = useParams();
  const router = useRouter();
  const isInitialRender = useRef(true);

  const [progressStage, setProgressStage] = useState<1 | 2 | 3>(
    Number(stage.replace("stage-", "")) as 1 | 2 | 3
  );
  useEffect(() => {
    console.log(`progressStage`, progressStage);
  }, [progressStage]);

  const [transitions, api] = useTransition(progressStage, () => ({
    from: { opacity: 0, transitions: "translateY(10%)" },
    enter: { opacity: 1, transitions: "translateY(0)" },
    leave: { opacity: 0, transitions: "translateY(-10%)" },
  }));

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    router.push(`/get-started/stage-${progressStage}`);
  }, [progressStage]);

  const [user, userLoading] = useAuthState(auth);

  return (
    <div className="flex min-h-screen ">
      <ProgressSidebar
        progressStage={progressStage}
        setProgressStage={setProgressStage}
      />
      <main className="relative h-full w-full flex-1">
        {transitions((style, item) => (
          <animated.div
            className={`absolute left-0 top-0 h-full w-full`}
            style={style}
          >
            {determineStageComponent(item, setProgressStage)}
          </animated.div>
        ))}
      </main>
    </div>
  );
}
export const getStaticPaths = async () => {
  return {
    paths: [
      { params: { stage: "stage-1" } },
      { params: { stage: "stage-2" } },
      { params: { stage: "stage-3" } },
    ],
    fallback: false,
  };
};

// export const getStaticProps: GetStaticProps = async () => {
//   return { props: {} };
// };
