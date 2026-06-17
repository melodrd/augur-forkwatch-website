import type { PublicClient } from "viem";
import { describe, expect, it } from "vitest";
import type { EthereumRpcEndpoint } from "@/domain/ethereum/rpc-endpoints";
import type { RepToken } from "@/domain/tokens/rep-tokens";
import { checkWalletRep } from "./rep-checker.client";
import type { RepTokenBalance } from "./rep-checker.types";

const endpoints: EthereumRpcEndpoint[] = [
  {
    displaySource: "Wrong Chain",
    id: "wrong-chain",
    isPublic: false,
    isSecret: false,
    label: "Wrong Chain",
    privacyNote: "Test endpoint.",
    priority: 0,
    url: "https://wrong-chain.example",
  },
  {
    displaySource: "PublicNode",
    id: "publicnode",
    isPublic: true,
    isSecret: false,
    label: "PublicNode",
    privacyNote: "Test endpoint.",
    priority: 1,
    url: "https://ethereum-rpc.publicnode.com",
  },
];

function loadedBalance(
  token: RepToken,
  overrides: Partial<RepTokenBalance> = {},
): RepTokenBalance {
  return {
    balance: "0 REP",
    balanceRaw: "0",
    chainId: token.chainId,
    chainName: token.chainName,
    decimals: token.decimals,
    hasBalance: false,
    readStatus: "loaded",
    token: token.symbol,
    tokenAddress: token.address,
    ...overrides,
  };
}

describe("checkWalletRep", () => {
  it("falls back after a non-mainnet endpoint and records the successful source", async () => {
    const result = await checkWalletRep(
      "0x0000000000000000000000000000000000000000",
      {
        createClient: (endpoint) =>
          ({
            getChainId: async () => (endpoint.id === "wrong-chain" ? 5 : 1),
          }) as PublicClient,
        endpoints,
        readBalance: async (_client, token) => loadedBalance(token),
      },
    );

    expect(result.status).toBe("clear");

    if (result.status === "clear") {
      expect(result.rpcInfo.fallbacksAttempted).toBe(1);
      expect(result.rpcInfo.sourceRpcLabel).toBe("PublicNode");
      expect(result.rpcInfo.sourceRpcHost).toBe("ethereum-rpc.publicnode.com");
    }
  });

  it("returns partial when at least one supported token read fails and no REP is found", async () => {
    const result = await checkWalletRep(
      "0x0000000000000000000000000000000000000000",
      {
        createClient: () =>
          ({
            getChainId: async () => 1,
          }) as PublicClient,
        endpoints: [endpoints[1]],
        readBalance: async (_client, token) => {
          if (token.symbol === "REPv2") {
            throw new Error("token read failed");
          }

          return loadedBalance(token);
        },
      },
    );

    expect(result.status).toBe("partial");

    if (result.status === "partial") {
      expect(
        result.balances.some((balance) => balance.readStatus === "error"),
      ).toBe(true);
    }
  });

  it("prioritizes found when any supported REP token has a balance", async () => {
    const result = await checkWalletRep(
      "0x0000000000000000000000000000000000000000",
      {
        createClient: () =>
          ({
            getChainId: async () => 1,
          }) as PublicClient,
        endpoints: [endpoints[1]],
        readBalance: async (_client, token) =>
          loadedBalance(
            token,
            token.symbol === "REPv2"
              ? {
                  balance: "1 REP",
                  balanceRaw: "1000000000000000000",
                  hasBalance: true,
                }
              : {},
          ),
      },
    );

    expect(result.status).toBe("found");
  });
});
