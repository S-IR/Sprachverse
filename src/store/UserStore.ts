import { LanguageLevel } from "@/constants/general/languages";
import { create } from "zustand";
import { modifyLevel } from "./LevelActionTypes";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { UserLanguagesLevel } from "@/firebase";
import { produce } from "immer";

type State = {
  UserLanguagesLevel: UserLanguagesLevel;
  preferences: string; // to BE DETERMINED
};

type Actions = {
  MODIFY_LEVEL: modifyLevel;
};

export const useUserStore = create<State & Actions>((set) => ({
  UserLanguagesLevel: { de: { reading: null, hearing: null } },
  MODIFY_LEVEL: (targetedLanguage, hearing, reading) =>
    set(
      produce((state) => {
        let targetObj = state.UserLanguagesLevel[targetedLanguage];
        if (targetObj === undefined) {
          return (state.UserLanguagesLevel[targetedLanguage] = {
            reading,
            hearing,
          });
        }
        if (hearing !== undefined) {
          targetObj.hearing = hearing;
        }
        if (reading !== undefined) {
          targetObj.reading = reading;
        }
        return state;
      })
    ),
  preferences: "",
}));
if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("UserStore", useUserStore);
}
