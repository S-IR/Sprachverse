import { useLanguage } from "@/app/layout";
import {
  WebsiteLanguage,
  websiteLanguageOptions,
} from "@/constants/display-language/website-languages";
import {
  ClickAwayListener,
  Fade,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from "@mui/material";
import Image from "next/image";
import React from "react";
import { useSpring, animated } from "react-spring";

interface props {
  anchorEl: null | HTMLElement;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
}
const ChooseLangPopover = ({ anchorEl, setAnchorEl }: props) => {
  const { language, setLanguage } = useLanguage();
  const open = anchorEl?.id === "lang-popover";
  const handleClose = (event: Event | React.SyntheticEvent) => {
    setAnchorEl(null);
  };
  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setAnchorEl(null);
    } else if (event.key === "Escape") {
      setAnchorEl(null);
    }
  }
  const styles = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    config: { duration: 0 },
  });

  const AnimatedFade = animated(Fade);
  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      role={undefined}
      placement="bottom-start"
      transition
      disablePortal
    >
      {({ TransitionProps, placement }) => (
        <AnimatedFade
          in={open}
          style={{
            transformOrigin:
              placement === "bottom-start" ? "left top" : "left bottom",
            ...styles,
          }}
          {...TransitionProps}
        >
          <Paper className="!bg-transparent">
            <ClickAwayListener onClickAway={handleClose}>
              <MenuList
                autoFocusItem={open}
                id="composition-menu"
                aria-labelledby="composition-button"
                onKeyDown={handleListKeyDown}
                className="!bg-orange-900 rounded-sm"
              >
                {websiteLanguageOptions.map((langToSelect) => {
                  const selected = langToSelect === language;
                  return (
                    <MenuItem
                      value={langToSelect}
                      onClick={() => changeLocalization(langToSelect)}
                      className={`${
                        selected ? `!bg-black/10` : `bg-none`
                      } transition-all duration-300`}
                    >
                      <Image
                        src={`/icons/languages/${langToSelect}-icon.png`}
                        alt={`flag icon for the ${langToSelect} language`}
                        width={25}
                        height={25}
                      />
                      <p
                        className={`font-serif ml-2  ${
                          selected ? "text-red-400" : "text-white"
                        } `}
                      >
                        {langToSelect.toUpperCase()}
                      </p>
                    </MenuItem>
                  );
                })}
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </AnimatedFade>
      )}
    </Popper>
  );
};

export default ChooseLangPopover;
