import React from "react";
import { useState, Dispatch, SetStateAction } from "react";

interface props {
  setProgressStage: Dispatch<SetStateAction<1 | 2 | 3>>;
}
const StageThreeInteractions = ({}: props) => {
  return <div>StageThreeInteractions</div>;
};

export default StageThreeInteractions;
