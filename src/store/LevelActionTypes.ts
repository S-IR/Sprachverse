import { LANGUAGE_CODES, LanguageLevel } from "@/constants/general/languages";

export type modifyLevel = (
  targetedLanguage : (typeof LANGUAGE_CODES)[number],
  hearing: LanguageLevel | null | undefined,
  reading: LanguageLevel | null | undefined
) => void;
