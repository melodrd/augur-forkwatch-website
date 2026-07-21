import { en } from "./copy/en";
import { ko } from "./copy/ko";
import type { SiteCopy } from "./copy/types";
import { INTL_LOCALES, type Locale } from "./locales";

const DICTIONARIES: Record<Locale, SiteCopy> = {
  en,
  ko,
};

/** Returns the full string dictionary for a locale. */
export function getCopy(locale: Locale): SiteCopy {
  return DICTIONARIES[locale];
}

/** Returns the BCP 47 tag used for Intl formatters (e.g. "en-US", "ko-KR"). */
export function getIntlLocale(locale: Locale): string {
  return INTL_LOCALES[locale];
}

export type { SiteCopy } from "./copy/types";
export {
  DEFAULT_LOCALE,
  INTL_LOCALES,
  isLocale,
  LOCALES,
  type Locale,
  OG_LOCALES,
} from "./locales";
