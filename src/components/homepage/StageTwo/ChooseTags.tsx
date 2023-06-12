import React, { Dispatch, SetStateAction } from "react";
import { useTransition, animated, config } from "react-spring";

interface props {
  tags: { name: string; selected: boolean }[];
  setTags: Dispatch<SetStateAction<{ name: string; selected: boolean }[]>>;
}

const ChooseTags = ({ tags, setTags }: props) => {
  const transitions = useTransition(tags, {
    from: { transform: "scale(0)", opacity: 0 },
    enter: { transform: "scale(1)", opacity: 1 },
    leave: { transform: "scale(0)", opacity: 0 },
    config: { tension: 200, friction: 20 },
  });

  const handleTagSelection = (index: number) => {
    const updatedTags = tags.map((tag, i) => {
      if (i === index) {
        return { ...tag, selected: !tag.selected };
      }
      return tag;
    });

    setTags(updatedTags);
  };
  return (
    <div className="mx-12 mt-12 grid grid-cols-6 gap-4 lg:grid-cols-8">
      {tags.map((tag, i) => {
        const selected = tag.selected;
        return transitions((style, tag) => (
          <animated.button
            key={tag.name}
            onClick={() => handleTagSelection(i)}
            className={`h-8 w-16 rounded-md border-2 bg-rose-950 font-youtube text-xs text-rose-400 lg:h-16 lg:w-24 ${
              selected
                ? `border-orange-700 text-orange-200`
                : `border-rose-950  transition-all duration-300 hover:bg-rose-600`
            }  `}
            style={style}
          >
            {tag.name}
          </animated.button>
        ));
      })}
    </div>
  );
};

export default ChooseTags;
