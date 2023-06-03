import { progressStages } from "@/constants/homepage/progressStage";
import Image from "next/image";
import React, { Dispatch, SetStateAction } from "react";
interface props {
  progressStage: number;
  setProgressStage: Dispatch<SetStateAction<1 | 2 | 3>>;
}
type StageStatus = "future" | "present" | "passed";
const determineStageStatus = (
  progressStage: number,
  row: number
): StageStatus => {
  if (progressStage > row) {
    return "passed";
  } else if (progressStage === row) {
    return "present";
  } else {
    return "future";
  }
};
const ProgressSidebar = ({ progressStage, setProgressStage }: props) => {
  return (
    <section className=" h-full min-h-[80vh] w-1/6 flex-col items-center bg-rose-950/10  ">
      {progressStages.map((stage) => {
        const stageStatus = determineStageStatus(progressStage, stage.number);
        return (
          <ProgressRow
            key={stage.text}
            stageStatus={stageStatus}
            rowObj={stage}
            setProgressStage={setProgressStage}
          />
        );
      })}
      <div className=" relative  mt-auto h-72 w-72">
        <Image
          src={"/homepage/progress-sidebar-icon1.png"}
          fill
          alt={"icon for progress bar"}
        />
      </div>
    </section>
  );
};

export default ProgressSidebar;

const ProgressRow = ({
  stageStatus,
  rowObj,
  setProgressStage,
}: {
  stageStatus: StageStatus;
  rowObj: { number: number; text: string };
  setProgressStage: Dispatch<SetStateAction<1 | 2 | 3>>;
}) => {
  const borderColor =
    stageStatus === "future"
      ? "border-gray-900/40"
      : stageStatus === "present"
      ? `border-red-700/10`
      : `border-green-700/10`;
  const textColor =
    stageStatus === "future"
      ? "text-gray-700/40"
      : stageStatus === "present"
      ? `text-white/80`
      : `text-green-700`;

  return (
    <div className="mt-14 flex w-full items-center justify-center space-x-4 p-4 align-middle">
      <p
        onClick={() => setProgressStage(rowObj.number as 1 | 2 | 3)}
        className={`flex h-20 w-20 ${
          stageStatus === "passed"
            ? "cursor-pointer transition-all duration-300 hover:bg-black/20 "
            : "cursor-default"
        }  items-center justify-center rounded-full  border-2 bg-none ${borderColor} ${textColor} text-center align-middle font-cinzel  text-4xl font-bold `}
      >
        {rowObj.number}
      </p>
      <p
        className={`w-min text-center font-cinzel text-2xl font-bold ${textColor}`}
      >
        {rowObj.text}
      </p>
    </div>
  );
};
