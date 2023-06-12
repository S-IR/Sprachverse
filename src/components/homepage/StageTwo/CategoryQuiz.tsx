import React, { useState, useEffect } from "react";
import { StageTwoOption } from "../StageTwoInteractions";
import { youtubeCategories, youtubeCategory } from "@/constants/general/videos";
import { useMutation, useQueryClient } from "react-query";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

interface props {
  setChosenOption: React.Dispatch<React.SetStateAction<StageTwoOption>>;
  setProgressStage: React.Dispatch<React.SetStateAction<1 | 2 | 3>>;
}
const CategoryQuiz = ({ setChosenOption, setProgressStage }: props) => {
  const queryClient = useQueryClient();

  const [selectedCategories, setSelectedCategories] = useState<
    youtubeCategory[]
  >([]);

  const handleClick = (category: youtubeCategory) =>
    setSelectedCategories((arr) => {
      if (!arr.includes(category)) {
        return [...arr, category];
      } else {
        const index = arr.indexOf(category);
        if (index > -1) {
          //this should not happen but I will just leave it in just in case
          arr.splice(index, 1);
          return [...arr];
        }
      }
      return arr;
    });
  return (
    <section className="flex relative h-auto  min-h-[60vh] w-full flex-col items-center space-y-12 overflow-clip !p-8">
            <button
        className="absolute left-0 top-0 h-6 w-6"
        onClick={() => setChosenOption(null)}
      >
        <ArrowBackIosNewIcon color="inherit" />
      </button>
      <h3 className="text-fantasy w-full py-4 text-center font-fantasy text-2xl text-yellow-600 ">
        Look at the following main categories on youtube. Choose which one you
        are interested in the most
      </h3>
      <div className="grid h-auto w-full grid-cols-3 gap-4 lg:grid-cols-4 xl:grid-cols-5">
        {youtubeCategories.map((category) => {
          const selected = selectedCategories.includes(category);
          return (
            <button
              key={category}
              onClick={() => handleClick(category)}
              className={`h-24 w-32 rounded-2xl border-2 font-fantasy text-sm hover:bg-white/20 ${
                selected
                  ? `border-rose-900 text-rose-300`
                  : `border-rose-300 text-white`
              }  transition-all duration-300 `}
            >
              {category}
            </button>
          );
        })}
      </div>
      <button
        onClick={() => {
          queryClient.setQueryData("userVideoCategories", selectedCategories);
          setChosenOption("choose-video-quiz");
        }}
        disabled={selectedCategories.length === 0}
        className="h-12 w-32 rounded-md border-2 border-orange-900 bg-rose-950 font-fantasy text-xl transition-all duration-300 hover:bg-rose-800 disabled:opacity-25"
      >
        Next
      </button>
    </section>
  );
};

export default CategoryQuiz;
