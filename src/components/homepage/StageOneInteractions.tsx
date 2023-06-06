import Image from "next/image";
import React, { useEffect } from "react";
import { useState, Dispatch, SetStateAction } from "react";
import ChooseOptions from "./StageOne/ChooseOptions";
import { useTransition, animated, config } from "react-spring";
import ManualChoosing from "./StageOne/ManualChoosing";
interface props {
  setProgressStage: Dispatch<SetStateAction<1 | 2 | 3>>;
}
export type StageOneOption = "manual" | "test" | "AI" | null;

const DetermineDisplayedComp = (
  chosenOption: StageOneOption,
  setChosenOption: React.Dispatch<React.SetStateAction<StageOneOption>>,
  setProgressStage: Dispatch<SetStateAction<1 | 2 | 3>>
) => {
  switch (chosenOption) {
    case null:
      return <ChooseOptions setChosenOption={setChosenOption} />;
    case "manual":
      return (
        <ManualChoosing
          setChosenOption={setChosenOption}
          setProgressStage={setProgressStage}
        />
      );
    default:
      throw new Error("WORK IN PROGRESS");
  }
};

const StageOneInteractions = ({ setProgressStage }: props) => {
  const [chosenOption, setChosenOption] = useState<StageOneOption>(null);

  const transitions = useTransition(chosenOption, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { ...config.gentle, duration: 300 },
  });

  return (
    <section className="relative  mx-[5vw] my-[5vh] h-full min-h-[75vh] w-3/4 flex-1 flex-col items-center justify-center  rounded-3xl bg-rose-950/40 p-4 align-middle shadow-md shadow-rose-700/20 lg:p-10 ">
      <Image
        className="absolute left-0 top-0 -z-10 rounded-3xl opacity-5 "
        fill
        src={"/homepage/stage-one/bg1.png"}
        alt={"Background image for stage one"}
        style={{ objectFit: "cover" }}
      />

      {transitions((style, item) => (
        <animated.div
          style={style}
          className="absolute left-0 top-0 z-10 h-full w-full  "
        >
          {DetermineDisplayedComp(item, setChosenOption, setProgressStage)}
        </animated.div>
      ))}
    </section>
  );
};

export default StageOneInteractions;
