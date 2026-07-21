import { getCopy } from "@/i18n";
import type { SiteCopy } from "@/i18n/copy/types";
import type { Locale } from "@/i18n/locales";
import { formatDate } from "./format";

export function formatTimestamp(
  value: string | null | undefined,
  locale: Locale = "en",
): string {
  return formatDate(value, locale);
}

export function formatDurationSince(
  value: string | null | undefined,
  nowMs = Date.now(),
  duration: SiteCopy["duration"] = getCopy("en").duration,
): string | null {
  if (!value) {
    return null;
  }

  const timestamp = Date.parse(value);

  if (Number.isNaN(timestamp)) {
    return null;
  }

  const elapsedMs = Math.max(0, nowMs - timestamp);
  const minutes = Math.floor(elapsedMs / 60_000);

  if (minutes < 1) {
    return duration.lessThanMinute;
  }

  if (minutes < 60) {
    return duration.minutes(minutes);
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 48) {
    return duration.hours(hours);
  }

  const days = Math.floor(hours / 24);

  return duration.days(days);
}
