export type Locale = "en" | "ko";

export const LOCALES: readonly Locale[] = ["en", "ko"];

export const DEFAULT_LOCALE: Locale = "en";

/** BCP 47 tags used for Intl formatting (numbers, dates, percentages). */
export const INTL_LOCALES: Record<Locale, string> = {
  en: "en-US",
  ko: "ko-KR",
};

/** Open Graph `og:locale` values. */
export const OG_LOCALES: Record<Locale, string> = {
  en: "en_US",
  ko: "ko_KR",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
