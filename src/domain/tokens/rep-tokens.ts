import type { Address } from "viem";
import {
  ETHEREUM_MAINNET_CHAIN_ID,
  ETHEREUM_MAINNET_CHAIN_NAME,
} from "@/domain/ethereum/chains";

type RepTokenDefinition = {
  address: Address;
  aliases?: readonly string[];
  chainId: typeof ETHEREUM_MAINNET_CHAIN_ID;
  chainName: typeof ETHEREUM_MAINNET_CHAIN_NAME;
  contractSymbol?: string;
  decimals: number;
  id: string;
  name: string;
  symbol: string;
};

export const REP_TOKENS = {
  repV1: {
    address: "0x1985365e9f78359a9b6ad760e32412f4a445e862",
    chainId: ETHEREUM_MAINNET_CHAIN_ID,
    chainName: ETHEREUM_MAINNET_CHAIN_NAME,
    decimals: 18,
    id: "rep-v1",
    name: "Reputation v1",
    symbol: "REPv1",
  },
  repV2: {
    address: "0x221657776846890989a759ba2973e427dff5c9bb",
    chainId: ETHEREUM_MAINNET_CHAIN_ID,
    chainName: ETHEREUM_MAINNET_CHAIN_NAME,
    decimals: 18,
    id: "rep-v2",
    name: "Reputation v2",
    symbol: "REPv2",
  },
  repV2Yes1: {
    address: "0xcf6a0a7826fa124b7705d6f3c675ead76f1e540d",
    aliases: ["REPv2_Yes_1"],
    chainId: ETHEREUM_MAINNET_CHAIN_ID,
    chainName: ETHEREUM_MAINNET_CHAIN_NAME,
    contractSymbol: "REPv2_Yes_1",
    decimals: 18,
    id: "rep-v2-yes-1",
    name: "REPv2_Yes_1",
    symbol: "REPv2_Yes_1",
  },
} as const satisfies Record<string, RepTokenDefinition>;

export type RepTokenKey = keyof typeof REP_TOKENS;
export type RepToken = (typeof REP_TOKENS)[RepTokenKey];
export type RepTokenSymbol = RepToken["symbol"];

export const REP_TOKEN_LIST = Object.values(REP_TOKENS);

export function getRepTokenByAddress(address: string): RepToken | undefined {
  const normalizedAddress = address.toLowerCase();
  return REP_TOKEN_LIST.find(
    (token) => token.address.toLowerCase() === normalizedAddress,
  );
}

export function shortenAddress(address: string): string {
  return address.replace(/\b0[xX][a-fA-F0-9]{40}\b/g, (value) => {
    return `${value.slice(0, 4)}...${value.slice(-3)}`;
  });
}

export function getRepTokenLabel(address: string): string {
  return getRepTokenByAddress(address)?.symbol ?? shortenAddress(address);
}
