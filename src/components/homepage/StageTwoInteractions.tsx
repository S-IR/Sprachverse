import React from "react";
import { useState, Dispatch, SetStateAction } from "react";

interface props {
  setProgressStage: Dispatch<SetStateAction<1 | 2 | 3>>;
}
const StageTwoInteractions = ({}: props) => {
  return <div>StageTwoInteractions</div>;
};

export default StageTwoInteractions;
