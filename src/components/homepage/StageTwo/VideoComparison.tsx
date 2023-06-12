import { FrontendVideoObj } from "@/constants/general/videos";
import { FrontendVideoData } from "@/constants/preferences/preference-types";
import { pullRandomVideos } from "@/lib/frontend/general/random";
import { Close } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import Image from "next/image";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  useQueryClient,
} from "react-query";
import { config, useTransition, animated, useSpring } from "react-spring";
import { CheckCircle } from "@mui/icons-material";

// I have decided to leave the fetchedVideos as an object because firstly it would take computation to transform it from an object to a map and also because it is not meant to change a lot by itself, but only change when the fetched data changes
interface props {
  fetchedVideos: FrontendVideoObj;
  selectedVideos: FrontendVideoObj;
  setSelectedVideos: Dispatch<SetStateAction<FrontendVideoObj>>;
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<FrontendVideoObj, unknown>>;
}
const VideoComparison = ({
  fetchedVideos,
  selectedVideos,
  setSelectedVideos,
  refetch,
}: props) => {
  const randomVideos = useMemo(
    () => pullRandomVideos(fetchedVideos, 20),
    [fetchedVideos]
  );
  useEffect(() => {
    console.log("randomVideos", randomVideos);
  }, [randomVideos]);

  const queryClient = useQueryClient();

  const [videosShown, setVideosShown] = useState(0);
  const [selectedVideoShown, setSelectedVideoShown] = useState<0 | 1 | null>(
    null
  );
  const [displayedVideos, setDisplayedVideos] = useState<
    (FrontendVideoData & { videoId: string })[]
  >(randomVideos.slice(0, 2));
  const [iconScale, setIconScale] = useState<Array<number[]>>([
    [0, 0],
    [0, 0],
  ]);

  const iconAnimations = iconScale.map((scale) =>
    useSpring({
      transform: `scale(${scale[0]}, ${scale[1]})`,
      config: config.default,
    })
  );
  useEffect(() => {
    const newIconScale = [...iconScale];
    if (selectedVideoShown === null) {
      newIconScale.forEach((_, i) => {
        newIconScale[i] = [0, 0];
      });
    } else {
      newIconScale.forEach((scale, i) => {
        if (i === selectedVideoShown) {
          newIconScale[i] = [1.2, 1.2];
        } else {
          newIconScale[i] = [0, 0];
        }
      });
    }
    setIconScale(newIconScale);
  }, [selectedVideoShown]);

  useEffect(() => {
    console.log(`displayedVideos`, displayedVideos);
  }, [displayedVideos]);

  const handleDisplayNextVideos = () => {
    if (videosShown === 18) {
      queryClient.setQueryData("userVideos", selectedVideos);
      refetch();
    }
    if (selectedVideoShown !== null) {
      setSelectedVideos((prev) => {
        const newObj: FrontendVideoObj = { ...prev };
        const { videoId, ...rest } = displayedVideos[selectedVideoShown];
        newObj[videoId] = rest;
        return newObj;
      });
      setSelectedVideoShown(null);
    }

    // in order to avoid having issues with react states not updating one after another I've added code to first update the displayed videos and just add +2, meaning I did not wait for the videos shown variable to change before changing shown videos
    setDisplayedVideos(randomVideos.slice(videosShown + 2, videosShown + 4));
    setVideosShown((prev) => prev + 2);
  };

  const transitions = useTransition(displayedVideos, {
    from: { opacity: 0, scale: 0.9 },
    enter: { opacity: 1, scale: 1 },
    leave: { opacity: 0, scale: 0.9 },
    config: { ...config.gentle, duration: 300 },
  });
  const absoluteElementRef = useRef<null | HTMLDivElement>(null);
  // const [height, setHeight] = useState(0);
  // useEffect(() => {
  //   if (!absoluteElementRef.current) return;

  //   const resizeObserver = new ResizeObserver((entries) => {
  //     for (const entry of entries) {
  //       setHeight(entry.contentRect.height);
  //     }
  //   });

  //   resizeObserver.observe(absoluteElementRef.current);

  //   return () => {
  //     resizeObserver.disconnect();
  //   };
  // }, [absoluteElementRef.current]);

  return (
    <>
      <div className="relative ">
        {transitions((styles) => (
          <animated.div
            ref={absoluteElementRef}
            style={styles}
            className="absolute left-0 top-0 flex h-auto w-full items-start justify-center space-x-12 align-middle lg:space-x-4"
          >
            {displayedVideos.map((video, i) => {
              const selected = selectedVideoShown === i;
              if (
                !video.thumbnails ||
                !video.thumbnails.medium ||
                !video.channelThumbnails ||
                !video.channelThumbnails.default
              ) {
                //due to the fact that the setStates will be bunched together I cannot update the videosShown variable and update the setDisplayedVideos based on the new videosShown value
                setDisplayedVideos(
                  randomVideos.slice(videosShown + 2, videosShown + 4)
                );
                setSelectedVideoShown(null);
                setVideosShown((prev) => prev + 2);
                return;
              }
              const { width, height, url } = video.thumbnails.medium;
              const {
                width: ctWidth,
                height: ctHeight,
                url: ctUrl,
              } = video.channelThumbnails.default;
              return (
                <button
                  className={`relative flex h-[330px] w-[380px] flex-col items-start rounded-md p-4 transition-all duration-300 hover:bg-white/20 ${
                    selected ? `outline-8 outline-rose-950 ` : ``
                  } `}
                  key={video.videoId}
                  onClick={() => {
                    if (i === selectedVideoShown) {
                      setSelectedVideoShown(null);
                    } else {
                      setSelectedVideoShown(i as 0 | 1);
                    }
                  }}
                >
                  <Image
                    quality={100}
                    src={url as string}
                    style={{
                      width: 360,
                      height: 200,
                      // objectFit: "scale-down",
                    }}
                    height={height as number}
                    width={width as number}
                    alt={video.description as string}
                    className={`  rounded-2xl  transition-all duration-300`}
                  />
                  <div className="mt-2 flex h-auto w-full space-x-4">
                    <Image
                      src={ctUrl as string}
                      style={{
                        width: 36,
                        height: 36,
                      }}
                      width={36}
                      height={36}
                      className="mt-2 rounded-full"
                      alt={`${video.channelTitle} profile picture`}
                    />
                    <div className="flex h-full flex-col items-start space-y-2">
                      <p className="max-w-[300px] text-ellipsis font-youtube">
                        {video.title}
                      </p>
                      <ul className="mt-auto font-youtube text-xs text-gray-700 ">
                        {Math.round(video.views / 1000) / 10}
                        {video.views > 100 ? "K" : ""} views
                      </ul>
                    </div>
                  </div>
                  <animated.div
                    className={`absolute right-0 top-0`}
                    style={iconAnimations[i]}
                  >
                    <CheckCircle color="success" />
                  </animated.div>
                </button>
              );
            })}
          </animated.div>
        ))}
      </div>

      <div
        style={{
          marginTop: 350,
        }}
        className="relative flex h-auto w-full flex-col items-center justify-center space-y-4 align-middle"
      >
        <Tooltip title="Choose none of the videos">
          <button
            className={`h-8 w-8 rounded-full transition-all duration-300 hover:bg-white/20 `}
            onClick={() => {
              setSelectedVideoShown(null);
              return handleDisplayNextVideos();
            }}
          >
            <Close color="warning" />
          </button>
        </Tooltip>

        <button
          disabled={selectedVideoShown === null}
          onClick={handleDisplayNextVideos}
          className="h-16 w-32 rounded-md border-2 border-orange-900 bg-rose-950 font-fantasy  transition-all duration-300 hover:bg-rose-800 disabled:opacity-25"
        >
          Confirm Choice
        </button>
      </div>
    </>
  );
};

export default VideoComparison;
