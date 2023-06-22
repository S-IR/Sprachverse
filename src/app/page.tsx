"use client";

import {
  ProgressSidebar,
  StageOneInteractions,
  StageThreeInteractions,
  StageTwoInteractions,
} from "@/components/homepage";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useTransition, animated } from "react-spring";

function determineStageComponent(
  progressStage: 1 | 2 | 3,
  setProgressStage: Dispatch<SetStateAction<1 | 2 | 3>>
) {
  switch (progressStage) {
    case 1:
      return <StageOneInteractions setProgressStage={setProgressStage} />;
    case 2:
      return <StageTwoInteractions setProgressStage={setProgressStage} />;
    case 3:
      return <StageThreeInteractions setProgressStage={setProgressStage} />;
  }
}
export default function Home() {
  const router = useRouter();
  const [progressStage, setProgressStage] = useState<1 | 2 | 3>(1);
  const [transitions, api] = useTransition(progressStage, () => ({
    from: { opacity: 0, transitions: "translateY(10%)" },
    enter: { opacity: 1, transitions: "translateY(0)" },
    leave: { opacity: 0, transitions: "translateY(-10%)" },
  }));
  useEffect(() => {
    api.start();
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
