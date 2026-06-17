import type { RepTokenSymbol } from "@/domain/tokens/rep-tokens";

export type RepTokenName = RepTokenSymbol;

export type RepCheckerStatus =
  | "idle"
  | "checking"
  | "clear"
  | "found"
  | "partial"
  | "invalid"
  | "error";

export type WalletRepResultKind =
  | "both"
  | "error"
  | "invalid"
  | "none"
  | "partial"
  | "repv1"
  | "repv2"
  | "repv2Yes1";

export type RepTokenBalance = {
  chainId: 1;
  chainName: "Ethereum Mainnet";
  token: RepTokenName;
  tokenAddress: string;
  balanceRaw: string | null;
  balance: string;
  decimals: number;
  error?: string;
  hasBalance: boolean;
  readStatus: "error" | "loaded";
};

export type RepBalanceCheckResult = {
  address: string;
  checkedAt: string;
  status: "clear" | "found" | "partial";
  balances: RepTokenBalance[];
  rpcInfo: {
    endpoint: string;
    latency: number;
    fallbacksAttempted: number;
    sourceChainId: 1;
    sourceRpcHost: string | null;
    sourceRpcId: string;
    sourceRpcLabel: string;
    sourceRpcPublic: boolean;
  };
};

export type RepBalanceCheckError = {
  status: "invalid" | "error";
  address: string;
  checkedAt: string;
  message: string;
};

export type RepBalanceCheckResponse =
  | RepBalanceCheckResult
  | RepBalanceCheckError;
