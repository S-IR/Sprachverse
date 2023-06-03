import { LanguageLevel } from "@/constants/general/language-levels";

export type modifyLevel = (
  hearing: LanguageLevel | null | undefined,
  reading: LanguageLevel | null | undefined
) => void;
