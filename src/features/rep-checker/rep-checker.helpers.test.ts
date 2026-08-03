import { describe, expect, it } from "vitest";
import {
  deriveStatusFromBalances,
  formatRepBalance,
  getWalletRepResultKind,
  normalizeAddressInput,
} from "./rep-checker.helpers";
import type {
  RepBalanceCheckResult,
  RepTokenBalance,
} from "./rep-checker.types";

function tokenBalance(
  token: RepTokenBalance["token"],
  hasBalance: boolean,
): RepTokenBalance {
  return {
    balance: hasBalance ? "1" : "0",
    balanceRaw: hasBalance ? "1000000000000000000" : "0",
    chainId: 1,
    chainName: "Ethereum Mainnet",
    decimals: 18,
    hasBalance,
    readStatus: "loaded",
    token,
    tokenAddress: "0x0000000000000000000000000000000000000001",
  };
}

function resultWithBalances(
  balances: RepTokenBalance[],
): RepBalanceCheckResult {
  return {
    address: "0x0000000000000000000000000000000000000001",
    balances,
    checkedAt: "2026-08-03T01:01:00.000Z",
    rpcInfo: {
      endpoint: "PublicNode",
      fallbacksAttempted: 0,
      latency: 1,
      sourceChainId: 1,
      sourceRpcHost: "ethereum-rpc.publicnode.com",
      sourceRpcId: "publicnode",
      sourceRpcLabel: "PublicNode",
      sourceRpcPublic: true,
    },
    status: "found",
  };
}

describe("REP checker helpers", () => {
  it("normalizes valid Ethereum addresses to checksum form", () => {
    expect(
      normalizeAddressInput("0xcf6a0a7826fa124b7705d6f3c675ead76f1e540d"),
    ).toMatchObject({
      address: "0xCf6A0A7826fa124B7705d6f3c675eAD76f1e540D",
      ok: true,
    });
  });

  it("rejects invalid addresses", () => {
    expect(normalizeAddressInput("not-an-address")).toMatchObject({
      ok: false,
    });
  });

  it("formats REP balances without hiding small non-zero values", () => {
    expect(formatRepBalance("0.000000000000000001")).toBe(
      "0.000000000000000001 REP",
    );
    expect(formatRepBalance("1234.500000")).toBe("1,234.5 REP");
  });

  it("derives partial status when no REP is found but a token read failed", () => {
    expect(
      deriveStatusFromBalances([
        { hasBalance: false, readStatus: "loaded" },
        { hasBalance: false, readStatus: "error" },
      ]),
    ).toBe("partial");
  });

  it("classifies a No-only wallet as migrated REP", () => {
    expect(
      getWalletRepResultKind(
        resultWithBalances([
          tokenBalance("REPv1", false),
          tokenBalance("REPv2", false),
          tokenBalance("REPv2_Yes_1", false),
          tokenBalance("REPv2_No_1", true),
        ]),
      ),
    ).toBe("migrated");
  });

  it("classifies a wallet holding both outcome tokens as migrated REP", () => {
    expect(
      getWalletRepResultKind(
        resultWithBalances([
          tokenBalance("REPv1", false),
          tokenBalance("REPv2", false),
          tokenBalance("REPv2_Yes_1", true),
          tokenBalance("REPv2_No_1", true),
        ]),
      ),
    ).toBe("migrated");
  });

  it("classifies a wallet holding No and legacy REP as mixed", () => {
    expect(
      getWalletRepResultKind(
        resultWithBalances([
          tokenBalance("REPv1", false),
          tokenBalance("REPv2", true),
          tokenBalance("REPv2_Yes_1", false),
          tokenBalance("REPv2_No_1", true),
        ]),
      ),
    ).toBe("legacyAndMigrated");
  });
});
