import React, { useState } from "react";
import {
  animated,
  useSpring,
  config,
  useSpringRef,
  useTransition,
} from "react-spring";
import { StageOneOption } from "../StageOneInteractions";
interface props {
  setChosenOption: React.Dispatch<React.SetStateAction<StageOneOption>>;
}

const ChooseOptions = ({ setChosenOption }: props) => {
  const [testClicked, setTestClicked] = useState(false);
  const [manualClicked, setManualClicked] = useState(false);
  const [AIClicked, setAIClicked] = useState(false);

  const expandedButtonHeight = "100vh";
  const expandedButtonWidth = "100vw";

  const remainingHeight = "0vh";
  const remainingWidth = "0vw";

  return (
    <div className="flex h-full min-h-[60vh] w-full flex-col space-y-12  overflow-clip">
      <h2 className="my-2 w-auto text-center font-fantasy text-4xl font-bold text-yellow-600">
        Let us first assert your level of German
      </h2>
      <div className="relative flex h-full w-full flex-1 items-center justify-center space-x-12 pb-6 align-middle lg:space-x-24">
        <button
          style={{
            height: testClicked
              ? expandedButtonHeight
              : manualClicked || AIClicked
              ? remainingHeight
              : "60vh",
            width: testClicked
              ? expandedButtonWidth
              : manualClicked || AIClicked
              ? remainingWidth
              : "12vw",
          }}
          className="rounded-md bg-white/10 bg-opacity-20 font-cinzel text-4xl font-bold text-orange-400 shadow-lg shadow-white/5 transition-all duration-700 hover:bg-rose-800 lg:w-[25vh]"
          onClick={() => {
            setTestClicked(!testClicked);
            setChosenOption("test");
          }}
        >
          {!manualClicked && !AIClicked && `Take a test`}
        </button>

        {/* div that adds a light effect behind */}
        <div className="absolute left-1/2 top-1/2 -z-10 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full "></div>
        <button
          style={{
            height: manualClicked
              ? expandedButtonHeight
              : testClicked || AIClicked
              ? remainingHeight
              : "60vh",
            width: manualClicked
              ? expandedButtonWidth
              : testClicked || AIClicked
              ? remainingWidth
              : "12vw",
          }}
          className="rounded-md bg-white/10 bg-opacity-20 font-cinzel text-4xl font-bold text-orange-400 shadow-lg shadow-white/5 transition-all duration-700 hover:bg-rose-800 lg:w-[25vh]"
          onClick={() => {
            setManualClicked(!manualClicked);
            setChosenOption("manual");
          }}
        >
          {!testClicked && !AIClicked && `Choose Manually`}
        </button>
        <button
          style={{
            height: AIClicked
              ? expandedButtonHeight
              : testClicked || manualClicked
              ? remainingHeight
              : "60vh",
            width: AIClicked
              ? expandedButtonWidth
              : testClicked || manualClicked
              ? remainingWidth
              : "12vw",
          }}
          className="rounded-md bg-white/10 bg-opacity-20 font-cinzel text-4xl font-bold text-orange-400 shadow-lg shadow-white/5 transition-all duration-700 hover:bg-rose-800 lg:w-[25vh]"
          onClick={() => {
            setAIClicked(!AIClicked);
            setChosenOption("AI");
          }}
        >
          {!testClicked && !manualClicked && `Assert using an AI`}
        </button>
      </div>
    </div>
  );
};

export default ChooseOptions;
