"use client";
import Image from "next/image";
import { GetStaticProps } from "next";
import { useState, Dispatch, SetStateAction } from "react";
import { useTransition, animated } from "react-spring";
import { useEffect } from "react";
import {
  ProgressSidebar,
  StageOneInteractions,
  StageThreeInteractions,
  StageTwoInteractions,
} from "@/components/homepage";

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
  const [progressStage, setProgressStage] = useState<1 | 2 | 3>(1);
  const [transitions, api] = useTransition(progressStage, () => ({
    from: { opacity: 0, transitions: "translateY(10%)" },
    enter: { opacity: 1, transitions: "translateY(0)" },
    leave: { opacity: 0, transitions: "translateY(-10%)" },
  }));
  useEffect(() => {
    api.start();
  }, [progressStage]);

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
