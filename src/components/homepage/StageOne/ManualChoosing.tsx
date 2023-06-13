import React, { useRef, useState, useEffect } from "react";
import { StageOneOption } from "../StageOneInteractions";
import {
  ManualLanguageOption,
  ManualLanguageOptions,
} from "@/constants/homepage/manualChoosingOptions";
import { UserLanguagesLevel } from "@/constants/general/languages";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useSprings, useSpring, animated, config } from "react-spring";
import { useDrag } from "react-use-gesture";
import clamp from "lodash.clamp";
import swap from "lodash-move";
import Image from "next/image";
import LanguageCard from "./LanguageCard";
import { useUserStore } from "../../../store/UserStore";

interface props {
  setChosenOption: React.Dispatch<React.SetStateAction<StageOneOption>>;
  setProgressStage: React.Dispatch<React.SetStateAction<1 | 2 | 3>>;
}
const ManualChoosing = ({ setChosenOption, setProgressStage }: props) => {
  const [hearingLevel, setHearingLevel] = useState<null | UserLanguagesLevel>(
    null
  );
  const [readingLevel, setReadingLevel] = useState<null | UserLanguagesLevel>(
    null
  );

  const hearingRef = useRef<HTMLDivElement | null>(null);
  const readingRef = useRef<HTMLDivElement | null>(null);

  const [MODIFY_LEVEL] = useUserStore((store) => [store.MODIFY_LEVEL]);
  useEffect(() => {
    if (hearingLevel !== null && readingLevel !== null) {
      MODIFY_LEVEL("de", hearingLevel, readingLevel);
      setProgressStage(2);
    }
  }, [hearingLevel, readingLevel]);

  return (
    <div className="relative flex h-full min-h-[70vh] w-full grow flex-col space-y-4">
      <button
        className="absolute left-0 top-0 h-6 w-6"
        onClick={() => setChosenOption(null)}
      >
        <ArrowBackIosNewIcon color="inherit" />
      </button>
      <h2 className="my-6 w-auto text-center font-cinzel text-4xl font-bold text-yellow-600">
        How good are you at comprehending german?<br></br>
      </h2>
      <div className="flex w-full flex-grow border-r-4 border-black ">
        <div className="flex w-full flex-1 grow flex-col items-center justify-center space-y-4 align-middle">
          <h3 className="font-cinzel text-4xl text-orange-600">Hearing</h3>
          <div
            ref={hearingRef}
            className="relative  h-full w-full flex-1 grow  items-stretch overflow-clip"
          >
            <DeckDropdown
              level={hearingLevel}
              optionsArr={ManualLanguageOptions}
              setLevel={setHearingLevel}
              parentRef={hearingRef}
            />
          </div>
        </div>

        <div className="flex w-full flex-1 grow flex-col items-center justify-center space-y-4 align-middle">
          <h3 className="font-cinzel text-4xl text-orange-600">Reading</h3>

          <div
            ref={readingRef}
            className="relative  w-full flex-1 grow  overflow-clip border-l-4 border-black"
          >
            <DeckDropdown
              level={readingLevel}
              optionsArr={ManualLanguageOptions}
              setLevel={setReadingLevel}
              parentRef={readingRef}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualChoosing;

// This is being used down there in the view, it interpolates rotation and scale into a css transform

interface DeckProps {
  optionsArr: ManualLanguageOption[];
  level: UserLanguagesLevel | null;
  setLevel: React.Dispatch<
    React.SetStateAction<"A1" | "A2" | "B1" | "B2" | "C1" | "C2" | null>
  >;
  parentRef: React.MutableRefObject<HTMLElement | null>;
}
const DeckDropdown = ({
  optionsArr,
  level,
  setLevel,
  parentRef,
}: DeckProps) => {
  if (parentRef === undefined || parentRef.current === null) return <></>;

  //these variables are used in order to determine the parent's middle point, namely the middle point where the drag should stop. They will be used in determining if the card reached its place
  const parentWidth = parentRef.current.offsetWidth;
  const parentHeight = parentRef.current.offsetHeight;

  const styles = useSpring({
    from: { opacity: 0, transform: `translateY(${-10 * Math.random()}%)` },
    to: { opacity: 1, transform: `translateY(0%)` },
    config: config.gentle,
  });
  // Now we're just mapping the animated values to our view, that's it. Btw, this component only renders once. :-)
  return (
    <>
      <animated.div className="relative grid h-full w-full " style={styles}>
        {optionsArr.map((option, i) => (
          <LanguageCard
            key={option.level}
            option={option}
            index={i}
            parentWidth={parentWidth}
            parentHeight={parentHeight}
            selectedLevel={level}
            setSelectedLevel={setLevel}
          />
        ))}
      </animated.div>
      <div
        className={`absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-lg border-4 border-dashed ${
          level !== null ? `border-orange-700/60` : `border-white/20`
        }    `}
      >
        {}
      </div>
    </>
  );
};
