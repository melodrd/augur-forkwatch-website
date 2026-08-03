import type { Locale } from "@/i18n/locales";
import { formatDate } from "./format";

export function formatTimestamp(
  value: string | null | undefined,
  locale: Locale = "en",
): string {
  return formatDate(value, locale);
}
