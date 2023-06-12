import { UserLanguagesLevel } from "@/constants/general/languages";
import { ManualLanguageOption } from "@/constants/homepage/manualChoosingOptions";
import Image from "next/image";
import { useSpring, animated, config } from "react-spring";
import { useDrag } from "react-use-gesture";
import { z } from "zod";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Popover,
  Typography,
} from "@mui/material";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
interface props {
  index: number;
  option: ManualLanguageOption;
  parentWidth: number;
  parentHeight: number;
  selectedLevel: UserLanguagesLevel | null;
  setSelectedLevel: React.Dispatch<
    React.SetStateAction<UserLanguagesLevel | null>
  >;
}
const zodIndexSchema = z.number().lt(6).positive();

/**
 * Calcualtes the position that the card should have based on the index. The intended shape is for the cards to be placed in a circle fashion around the middle point.
 * @param index index of the card
 * @param parentWidth width of the parent element.
 * @param parentHeight height of the parent element
 * @returns an object containing the default x, y, and rotate for the card
 */
const calculatePos = (
  index: 0 | 1 | 2 | 3 | 4 | 5,
  parentWidth: number,
  parentHeight: number
): { x: number; y: number; rotate: number } => {
  switch (index) {
    case 0:
      return { x: 55, y: parentHeight / 3 - 128, rotate: 15 };
    case 1:
      return {
        x: parentWidth - 128 - 55,
        y: parentHeight / 3 - 128,
        rotate: -15,
      };
    case 2:
      return { x: 6, y: (parentHeight * 2) / 3 - 128, rotate: 0 };
    case 3:
      return {
        x: parentWidth - 128,
        y: (parentHeight * 2) / 3 - 128,
        rotate: 0,
      };
    case 4:
      return { x: 55, y: parentHeight - 128, rotate: -15 };
    case 5:
      return {
        x: parentWidth - 128 - 55,
        y: parentHeight - 128,
        rotate: 15,
      };
  }
};

/**
 * A card that is meant to represent a language level. It is meant to be dragged in a 'dropzone' position in order to save the current user's language preference
 * @returns
 */
const LanguageCard = ({
  index,
  option,
  parentWidth,
  parentHeight,
  selectedLevel,
  setSelectedLevel,
}: props) => {
  const [popupAnchor, setPopupAnchor] = useState<HTMLButtonElement | null>(
    null
  );

  // Define the snap position and threshold
  const snapPosition = { x: parentWidth / 2 - 64, y: parentHeight / 2 - 64 };
  const threshold = 50;
  const { x, y, rotate } = calculatePos(
    index as 0 | 1 | 2 | 3 | 4 | 5,
    parentWidth,
    parentHeight
  );

  //code to make sure no errors happen
  const isValidIndex = zodIndexSchema.safeParse(index);
  if (!isValidIndex)
    throw new Error("Index of the language card was greater than 5");
  // Set up the spring animation
  const [style, api] = useSpring(() => ({
    x,
    y,
    rotate,
    config: config.stiff,
  }));
  const isSelected = selectedLevel === option.level;
  const isDisabled = selectedLevel !== null && selectedLevel !== option.level;
  if (x === undefined || y === undefined) return <></>;
  // Set up the drag gesture
  const bind = useDrag(
    ({ movement: [mx, my], last }) => {
      const newX = x + mx;
      const newY = y + my;
      api.start({ x: newX, y: newY, rotate });

      if (last) {
        // Check if the dragged element has reached the desired threshold
        const deltaX = Math.abs(newX - snapPosition.x);
        const deltaY = Math.abs(newY - snapPosition.y);

        if (deltaX <= threshold && deltaY <= threshold) {
          // Snap the card to the defined position
          setSelectedLevel(option.level);
          api.start({
            x: snapPosition.x,
            y: snapPosition.y,
            rotate: 0,
          });
        } else {
          // Reset the card position
          api.start({ x, y, rotate });
        }
      } else {
        setSelectedLevel(null);

        // Update the card position while dragging
        api.start({ x: newX, y: newY, rotate });
      }
    },
    { enabled: !isDisabled }
    // {
    //   eventOptions: { passive: false },
    // }
  );
  //boolean that determines if the current card is selected
  const open = popupAnchor !== null;

  const id = open ? "language-level-describer" : undefined;

  return (
    <animated.div
      {...bind()}
      className={`absolute left-0 top-0 z-10 flex h-32 w-32 bg-rose-800/40  ${
        isDisabled ? `cursor-default` : `cursor-grab`
      }  items-center justify-center  rounded-2xl align-middle ${
        isSelected ? `shadow-none` : `shadow-2xl shadow-black`
      } `}
      style={{
        ...style,
      }}
    >
      <p
        className={`pointer-events-none font-fantasy text-4xl ${
          isSelected ? `text-orange-600` : `text-white`
        } transition-all duration-300 `}
      >
        {option.level}
      </p>
      <button
        className="absolute bottom-4 right-4 z-10 h-2 w-2 transition-all duration-300  "
        onClick={(e) => setPopupAnchor(e.currentTarget)}
      >
        <QuestionMarkIcon
          color="warning"
          aria-describedby={id}
          className={` opacity-25 !transition-all !duration-300 hover:opacity-100 `}
        />
      </button>

      <Popover
        id={id}
        open={open}
        anchorEl={popupAnchor}
        onClose={() => setPopupAnchor(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        PaperProps={{
          className: "!max-w-lg !bg-black !text-white ",
        }}
      >
        <Typography className=" " sx={{ p: 2 }}>
          <p className="w-full text-center font-cinzel text-xl font-bold text-orange-600">
            The British Councils defines {option.level} as follows
          </p>{" "}
          <br></br>
          {option.description}
        </Typography>
        <List>
          {option.bulletPoints.map((text, index) => (
            <ListItem key={index}>
              <RadioButtonUncheckedIcon className="mx-2" />
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Popover>
    </animated.div>
  );
};
export default LanguageCard;
