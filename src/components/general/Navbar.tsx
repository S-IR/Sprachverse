import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import { useLanguage } from "../../app/layout";
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  ListItemText,
  Menu,
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuList,
} from "@mui/material";
import {
  WebsiteLanguage,
  websiteLanguageOptions,
} from "@/constants/display-language/website-languages";
import ChooseLangPopover from "./navbar/ChooseLangPopover";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/navigation";
import { NextRouter, withRouter } from "next/router";

const Navbar = () => {
  const { language, setLanguage } = useLanguage();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const langButtonRef = useRef<HTMLButtonElement | null>(null);

  return (
    <nav className="w-full h-[75px] sticky flex items-center border-b-2 border-black/30 ">
      <div className="flex-1 flex items-center space-x-44">
        <button className=" rounded-full">
          <Image
            src={"/navbar/sprachverse-icon1.png"}
            alt={"Sprachverse icon"}
            width={50}
            height={50}
            className="rounded-full ml-6 filter brightness-100 hover:brightness-75 transition-all duration-300"
            style={{ objectFit: "scale-down", width: 50, height: 50 }}
          />
        </button>
        <button className="font-fantasy w-14 h-8 font-bold text-white hover:text-gray-300 transition-all duration-300">
          Videos
        </button>
        <button className="font-fantasy w-14 h-8 font-bold text-white hover:text-gray-300 transition-all duration-300">
          Reading
        </button>
      </div>
      <div className="flex-1 flex items-center justify-end relative">
        <button
          ref={langButtonRef}
          onClick={() => setAnchorEl(langButtonRef.current)}
          id={"lang-popover"}
          className="mr-16 font-fantasy text-orange-600"
        >
          {language}
        </button>
      </div>
      <ChooseLangPopover anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
    </nav>
  );
};
export default Navbar;
