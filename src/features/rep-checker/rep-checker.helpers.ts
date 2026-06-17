import { type Address, getAddress, isAddress } from "viem";
import { withRepCheckerMigrationGuideHint } from "./rep-checker.copy";
import type {
  RepBalanceCheckResponse,
  RepBalanceCheckResult,
  RepTokenBalance,
  WalletRepResultKind,
} from "./rep-checker.types";

type AddressNormalizationResult =
  | {
      address: Address;
      ok: true;
    }
  | {
      address: string;
      message: string;
      ok: false;
    };

export function normalizeAddressInput(
  inputAddress: string,
): AddressNormalizationResult {
  const address = inputAddress.trim();

  if (!isAddress(address)) {
    return {
      address,
      message: withRepCheckerMigrationGuideHint(
        "Enter a valid Ethereum address.",
      ),
      ok: false,
    };
  }

  return {
    address: getAddress(address),
    ok: true,
  };
}

export function deriveStatusFromBalances(
  balances: Pick<RepTokenBalance, "hasBalance" | "readStatus">[],
): "clear" | "found" | "partial" {
  if (balances.some((balance) => balance.hasBalance)) {
    return "found";
  }

  return balances.some((balance) => balance.readStatus === "error")
    ? "partial"
    : "clear";
}

export function isRepBalanceCheckResult(
  result: RepBalanceCheckResponse,
): result is RepBalanceCheckResult {
  return (
    result.status === "clear" ||
    result.status === "found" ||
    result.status === "partial"
  );
}

function getTokenBalance(
  result: RepBalanceCheckResult,
  token: RepTokenBalance["token"],
) {
  return result.balances.find((balance) => balance.token === token);
}

export function getWalletRepResultKind(
  result: RepBalanceCheckResponse,
): WalletRepResultKind {
  if (!isRepBalanceCheckResult(result)) {
    return result.status === "invalid" ? "invalid" : "error";
  }

  if (result.status === "partial") {
    return "partial";
  }

  const hasRepV1 = getTokenBalance(result, "REPv1")?.hasBalance ?? false;
  const hasRepV2 = getTokenBalance(result, "REPv2")?.hasBalance ?? false;
  const hasRepV2Yes1 =
    getTokenBalance(result, "REPv2_Yes_1")?.hasBalance ?? false;

  if (hasRepV1 && hasRepV2) {
    return "both";
  }

  if (hasRepV1) {
    return "repv1";
  }

  if (hasRepV2) {
    return "repv2";
  }

  if (hasRepV2Yes1) {
    return "repv2Yes1";
  }

  return "none";
}

function groupIntegerPart(value: string): string {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function visibleFractionDigits(
  integerPart: string,
  fractionPart: string,
): number {
  const defaultVisibleDigits = integerPart === "0" ? 18 : 4;
  const firstNonZeroIndex = fractionPart.search(/[1-9]/);

  if (firstNonZeroIndex === -1) {
    return defaultVisibleDigits;
  }

  return Math.max(defaultVisibleDigits, firstNonZeroIndex + 1);
}

export function formatRepBalance(value: string): string {
  const normalized = value.trim();

  if (!normalized) {
    return "0 REP";
  }

  const [rawIntegerPart, rawFractionPart = ""] = normalized.split(".");
  const isNegative = rawIntegerPart.startsWith("-");
  const unsignedIntegerPart = isNegative
    ? rawIntegerPart.slice(1)
    : rawIntegerPart;
  const integerPart = unsignedIntegerPart.replace(/^0+(?=\d)/, "") || "0";
  const fractionPart = rawFractionPart.replace(/0+$/, "");

  if (integerPart === "0" && !fractionPart) {
    return "0 REP";
  }

  const groupedIntegerPart = `${isNegative ? "-" : ""}${groupIntegerPart(
    integerPart,
  )}`;

  if (!fractionPart) {
    return `${groupedIntegerPart} REP`;
  }

  const digitsToShow = visibleFractionDigits(integerPart, fractionPart);
  const displayedFraction = fractionPart
    .slice(0, Math.min(fractionPart.length, digitsToShow))
    .replace(/0+$/, "");

  if (!displayedFraction) {
    return `${groupedIntegerPart} REP`;
  }

  return `${groupedIntegerPart}.${displayedFraction} REP`;
}
