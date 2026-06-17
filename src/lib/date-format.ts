import { formatDate } from "./format";

export function formatTimestamp(value: string | null | undefined): string {
  return formatDate(value);
}

export function formatDurationSince(
  value: string | null | undefined,
  nowMs = Date.now(),
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
    return "less than 1 minute";
  }

  if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 48) {
    return `${hours} ${hours === 1 ? "hour" : "hours"}`;
  }

  const days = Math.floor(hours / 24);

  return `${days} ${days === 1 ? "day" : "days"}`;
}
