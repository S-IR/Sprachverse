import { LanguageLevel } from "@/constants/general/language-levels";
import { create } from "zustand";
import { modifyLevel } from "./LevelActionTypes";
import { mountStoreDevtool } from "simple-zustand-devtools";

type State = {
  hearingLevel: LanguageLevel | null;
  readingLevel: LanguageLevel | null;
  preferences: string; // to BE DETERMINED
};

type Actions = {
  MODIFY_LEVEL: modifyLevel;
};

export const useUserStore = create<State & Actions>((set) => ({
  hearingLevel: null,
  readingLevel: null,
  MODIFY_LEVEL: (hearing, reading) =>
    set((state) => {
      if (hearing !== undefined) {
        state.hearingLevel = hearing;
      }
      if (reading !== undefined) {
        state.readingLevel = reading;
      }
      return state;
    }),
  preferences: "",
}));
if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("UserStore", useUserStore);
}
