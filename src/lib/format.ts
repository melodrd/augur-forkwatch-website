export const NULL_VALUE = "NULL";

type FormatPercentOptions = Intl.NumberFormatOptions & {
  signed?: boolean;
};

function isFiniteNumber(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function formatNumber(
  value: number | null | undefined,
  options: Intl.NumberFormatOptions = {},
): string {
  if (!isFiniteNumber(value)) {
    return NULL_VALUE;
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
    ...options,
  }).format(value);
}

export function formatCompactNumber(value: number | null | undefined): string {
  if (!isFiniteNumber(value)) {
    return NULL_VALUE;
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
    notation: "compact",
  }).format(value);
}

export function formatUsd(
  value: number | null | undefined,
  options: Intl.NumberFormatOptions = {},
): string {
  if (!isFiniteNumber(value)) {
    return NULL_VALUE;
  }

  const maximumFractionDigits =
    options.maximumFractionDigits ??
    (Math.abs(value) > 0 && Math.abs(value) < 1 ? 6 : 2);

  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits,
    minimumFractionDigits:
      options.minimumFractionDigits ?? Math.min(maximumFractionDigits, 2),
    style: "currency",
    ...options,
  }).format(value);
}

export const formatCurrency = formatUsd;

export function formatPercent(
  value: number | null | undefined,
  options: FormatPercentOptions = {},
): string {
  if (!isFiniteNumber(value)) {
    return NULL_VALUE;
  }

  const { signed = false, ...numberOptions } = options;
  const prefix = signed && value > 0 ? "+" : "";

  return `${prefix}${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    ...numberOptions,
  }).format(value)}%`;
}

export function formatDate(
  value: number | string | Date | null | undefined,
): string {
  if (value === null || value === undefined || value === "") {
    return NULL_VALUE;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return NULL_VALUE;
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function formatAddress(address: string | null | undefined): string {
  if (!address) {
    return NULL_VALUE;
  }

  const trimmed = address.trim();

  if (!trimmed) {
    return NULL_VALUE;
  }

  if (trimmed.length <= 12) {
    return trimmed;
  }

  return `${trimmed.slice(0, 6)}...${trimmed.slice(-4)}`;
}

export const shortAddress = formatAddress;

export function shortHash(value: string | null | undefined): string {
  return formatAddress(value);
}
