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
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";

const Navbar = () => {
  const { language, setLanguage } = useLanguage();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const langButtonRef = useRef<HTMLButtonElement | null>(null);
  const [user, userLoading] = useAuthState(auth);

  return (
    <nav className="sticky flex h-[75px] w-full items-center border-b-2 border-black/30 ">
      <div className="flex flex-1 items-center space-x-44">
        <button className=" rounded-full">
          <Image
            src={"/navbar/sprachverse-icon1.png"}
            alt={"Sprachverse icon"}
            width={50}
            height={50}
            className="ml-6 rounded-full brightness-100 filter transition-all duration-300 hover:brightness-75"
            style={{ objectFit: "scale-down", width: 50, height: 50 }}
          />
        </button>
        <button className="h-8 w-14 font-fantasy font-bold text-white transition-all duration-300 hover:text-gray-300">
          Videos
        </button>
        <button className="h-8 w-14 font-fantasy font-bold text-white transition-all duration-300 hover:text-gray-300">
          Reading
        </button>
      </div>
      <div className="relative flex flex-1 items-center justify-end">
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
      {user && <p>USER, {user.displayName}</p>}
    </nav>
  );
};
export default Navbar;
