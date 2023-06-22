import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
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
import { PuffLoader } from "react-spinners";
import { SupervisedUserCircle } from "@mui/icons-material";
import UserDropdown from "./navbar/UserDropdown";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLButtonElement>(null);

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
      {/* <div className="relative flex flex-1 items-center justify-end">
        <button
          ref={langButtonRef}
          onClick={() => setAnchorEl(langButtonRef.current)}
          id={"lang-popover"}
          className="mr-16 font-fantasy text-orange-600"
        >
          {language}
        </button>
      </div> */}
      {/* <ChooseLangPopover anchorEl={anchorEl} setAnchorEl={setAnchorEl} /> */}
      {
        //user profile icon component
        userLoading ? (
          <PuffLoader
            size={20}
            color="orange"
            className="ml-auto  mr-8 rounded-full "
          />
        ) : (
          <div
            className={` ml-auto mr-8 flex h-[35px] w-[35px] items-center justify-center rounded-full border-dotted border-gray-500 align-middle transition-all  duration-300 hover:border-red-500 `}
          >
            {user && user.photoURL !== null && (
              <button
                id={"user-dropdown"}
                onClick={(e) => setAnchorEl(e.currentTarget)}
                className="h-auto w-auto"
              >
                <Image
                  src={user.photoURL}
                  width={25}
                  height={25}
                  alt={"user profile picture"}
                  className={` rounded-full  `}
                />
              </button>
            )}
            {user && !user.photoURL && (
              <SupervisedUserCircle width={25} height={25} />
            )}
          </div>
        )
      }
      <UserDropdown anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
    </nav>
  );
};
export default Navbar;
