import Image from "next/image";
import React, { useEffect } from "react";
import { useState, Dispatch, SetStateAction, useRef } from "react";
import GoogleButton from "../general/buttons/GoogleButton";
import useAuthThirdParty from "@/hooks/useAuthThirdParty";
import { setUserPreferences } from "@/lib/frontend/preferences/fetches";
import { config, useTransition, animated, useSpring } from "react-spring";
import ChooseOptionsStageTwo from "./StageTwo/ChooseOptionStageTwo";
import PleaseWaitStageTwo from "./StageTwo/PleaseWaitStageTwo";
import CategoryQuiz from "./StageTwo/CategoryQuiz";
import ChooseVideoQuiz from "./StageTwo/ChooseVideoQuiz";

interface props {
  setProgressStage: Dispatch<SetStateAction<1 | 2 | 3>>;
}

const DetermineDisplayedComp = (
  chosenOption: StageTwoOption,
  setChosenOption: React.Dispatch<React.SetStateAction<StageTwoOption>>,
  setProgressStage: Dispatch<SetStateAction<1 | 2 | 3>>
) => {
  switch (chosenOption) {
    case null:
      return (
        <ChooseOptionsStageTwo
          setProgressStage={setProgressStage}
          setChosenOption={setChosenOption}
        />
      );
    case "please-wait":
      return (
        <PleaseWaitStageTwo
          setProgressStage={setProgressStage}
          setChosenOption={setChosenOption}
        />
      );
    case "category-quiz":
      return (
        <CategoryQuiz
          setProgressStage={setProgressStage}
          setChosenOption={setChosenOption}
        />
      );
    case "choose-video-quiz":
      return (
        <ChooseVideoQuiz
          setProgressStage={setProgressStage}
          setChosenOption={setChosenOption}
        />
      );
  }
};
export type StageTwoOption =
  | "please-wait"
  | "category-quiz"
  | null
  | "choose-video-quiz";
const StageTwoInteractions = ({ setProgressStage }: props) => {
  const [height, setHeight] = useState(0);

  const [chosenOption, setChosenOption] = useState<StageTwoOption>(null);

  const sectionStyles = useSpring({
    from: { height: "75vh" },
    to: { height: height > 0 ? Math.max(height, 75) + "vh" : "75vh" },
    config: config.stiff,
  });
  const transitions = useTransition(chosenOption, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { ...config.gentle, duration: 300 },
  });
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const absoluteElementRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (!absoluteElementRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newHeight = (entry.contentRect.height * 100) / window.innerHeight;
        setHeight(newHeight);
      }
    });
    setHeight(
      (absoluteElementRef.current.offsetHeight * 100) / window.innerHeight
    );
    resizeObserver.observe(absoluteElementRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [chosenOption, absoluteElementRef.current]);

  return (
    <animated.section
      ref={sectionRef}
      className="relative mx-[5vw] my-[5vh] flex h-auto min-h-[75vh] w-3/4 flex-1 flex-col items-center justify-center overflow-clip  rounded-3xl bg-rose-950/40 p-4 align-middle"
      style={sectionStyles}
    >
      <Image
        className="absolute left-0 top-0 -z-10 rounded-3xl opacity-5 "
        fill
        src={"/homepage/stage-two/bg.png"}
        alt={"Background image for stage one"}
        style={{ objectFit: "cover" }}
      />
      {transitions((style, item) => (
        <animated.div
          ref={absoluteElementRef}
          style={style}
          className="absolute left-0 top-0 z-10 h-auto w-full  "
        >
          {DetermineDisplayedComp(item, setChosenOption, setProgressStage)}
        </animated.div>
      ))}
    </animated.section>
  );
};

export default StageTwoInteractions;
