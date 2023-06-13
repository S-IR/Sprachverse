import React, { useEffect, useState } from "react";
import { StageTwoOption } from "../StageTwoInteractions";
import { useQuery, useQueryClient } from "react-query";
import { FrontendVideoObj, youtubeCategory } from "@/constants/general/videos";
import { fetchVideosForQuiz } from "@/lib/frontend/general/fetches";
import { getTagsFromCategories } from "@/lib/frontend/homepage/stage-two";
import { PuffLoader } from "react-spinners";
import ChooseTags from "./ChooseTags";
import { FrontendVideoData } from "@/constants/preferences/preference-types";
import VideoComparison from "@/components/homepage/StageTwo/VideoComparison";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";

interface props {
  setChosenOption: React.Dispatch<React.SetStateAction<StageTwoOption>>;
  setProgressStage: React.Dispatch<React.SetStateAction<1 | 2 | 3>>;
}
const ChooseVideoQuiz = ({ setChosenOption, setProgressStage }: props) => {
  const queryClient = useQueryClient();

  const { data: userCategories } = useQuery<youtubeCategory[]>(
    "userVideoCategories"
  );
  const { data: userVideos } = useQuery<FrontendVideoObj[]>("userVideos");
  if (!userCategories) {
    setChosenOption("category-quiz");
    return <></>;
  }
  // const [tags, setTags] = useState<{ name: string; selected: boolean }[]>(
  //   () => {
  //     const tags = getTagsFromCategories(userCategories);
  //     const tagsObjArr = tags.map((tag) => {
  //       return { name: tag, selected: false };
  //     });
  //     return tagsObjArr;
  //   }
  // );

  const {
    data: fetchedVideos,
    isLoading,
    isFetching,
    refetch,
  } = useQuery(
    "quizVideos",
    async () => {
      const queryArr =
        userVideos === undefined
          ? getTagsFromCategories(userCategories)
          : userVideos.map((video) => ` ${video.title}, ${video.tags}`);
      return await fetchVideosForQuiz(queryArr);
    },
    {
      cacheTime: 1000 * 60 * 60, // 60 minutes
      staleTime: 1000 * 60 * 60, // 60 minutes
      refetchOnWindowFocus: false,
    }
  );
  const [selectedVideos, setSelectedVideos] = useState<{
    [key: string]: FrontendVideoData;
  }>({});
  useEffect(() => {
    if (Object.keys(selectedVideos).length < 18) return;
    queryClient.setQueryData("userVideos", selectedVideos);
    setChosenOption("please-wait");
  }, [Object.keys(selectedVideos).length]);

  useEffect(() => {
    console.log("videos", fetchedVideos);
  }, [fetchedVideos]);

  return (
    <section className="relative !my-8 flex h-auto min-h-[85vh] w-full flex-col items-center space-y-12 overflow-clip">
      <button
        className="absolute left-0 top-0 h-6 w-6"
        onClick={() => setChosenOption(null)}
      >
        <ArrowBackIosNewIcon color="inherit" />
      </button>
      <h3
        className={
          "w-full text-center font-fantasy text-2xl text-yellow-600 lg:text-4xl "
        }
      >
        Which video would you watch from the following?
      </h3>
      {isLoading || isFetching ? (
        <div className="flex  h-full w-full flex-col items-center justify-center space-y-4 align-middle ">
          <h4 className="font-fantasy text-2xl text-yellow-600">Please Wait</h4>
          <PuffLoader />
        </div>
      ) : fetchedVideos === undefined ? (
        <h3
          className={
            "w-full text-center font-fantasy text-2xl text-yellow-600 "
          }
        >
          A server error has occured
        </h3>
      ) : (
        <div className="h-auto w-full">
          <VideoComparison
            fetchedVideos={fetchedVideos}
            setSelectedVideos={setSelectedVideos}
            selectedVideos={selectedVideos}
            refetch={refetch}
          />
          {/* <ChooseTags tags={tags} setTags={setTags} /> */}
        </div>
      )}
    </section>
  );
};

export default ChooseVideoQuiz;
