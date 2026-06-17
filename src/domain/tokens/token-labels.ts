import { COMMON_ETHEREUM_TOKEN_LABELS } from "@/domain/ethereum/addresses";
import {
  getRepTokenByAddress,
  REP_TOKEN_LIST,
  shortenAddress,
} from "./rep-tokens";

const REP_TOKEN_LABELS_BY_ADDRESS = Object.fromEntries(
  REP_TOKEN_LIST.map((token) => [token.address, token.symbol]),
);

const TOKEN_LABELS_BY_ADDRESS = {
  ...COMMON_ETHEREUM_TOKEN_LABELS,
  ...REP_TOKEN_LABELS_BY_ADDRESS,
} as const;

export function normalizeTokenAddress(address: string): string | null {
  const trimmed = address.trim();
  return /^0[xX][a-fA-F0-9]{40}$/.test(trimmed) ? trimmed.toLowerCase() : null;
}

export function getTokenAddressLabel(address: string): string | undefined {
  const normalizedAddress = normalizeTokenAddress(address);

  if (!normalizedAddress) {
    return undefined;
  }

  return (
    getRepTokenByAddress(normalizedAddress)?.symbol ??
    TOKEN_LABELS_BY_ADDRESS[
      normalizedAddress as keyof typeof TOKEN_LABELS_BY_ADDRESS
    ]
  );
}

export function getTokenLabel(address: string): string {
  return getTokenAddressLabel(address) ?? shortenAddress(address);
}

export function getAbbreviatedTokenAddressLabel(token: string): string | null {
  const abbreviated = token.match(
    /^0[xX]([a-fA-F0-9]{2,8})\.\.\.([a-fA-F0-9]{2,8})$/,
  );

  if (!abbreviated) {
    return null;
  }

  const [, prefix, suffix] = abbreviated;
  const matches = Object.entries(TOKEN_LABELS_BY_ADDRESS).filter(
    ([address]) => {
      const hex = address.slice(2);
      return (
        hex.toLowerCase().startsWith(prefix.toLowerCase()) &&
        hex.toLowerCase().endsWith(suffix.toLowerCase())
      );
    },
  );

  return matches.length === 1 ? matches[0][1] : null;
}

export function replaceKnownTokenAddresses(value: string): string {
  return value.replace(/\b0[xX][a-fA-F0-9]{40}\b/g, (address) => {
    return getTokenAddressLabel(address) ?? shortenAddress(address);
  });
}
