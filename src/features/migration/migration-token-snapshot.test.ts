import type { PublicClient } from "viem";
import { describe, expect, it, vi } from "vitest";
import {
  REP_MIGRATION_NO_TOKEN_ADDRESS,
  REP_MIGRATION_NO_UNIVERSE_ADDRESS,
  REP_MIGRATION_YES_TOKEN_ADDRESS,
  REP_MIGRATION_YES_UNIVERSE_ADDRESS,
} from "./migration-progress.constants";
import { readMigrationTokenSnapshot } from "./migration-token-snapshot";

describe("readMigrationTokenSnapshot", () => {
  it("reads both fixed outcome tokens at the same pinned block", async () => {
    const readContract = vi
      .fn()
      .mockImplementation(({ address, functionName }) => {
        if (functionName === "totalSupply") {
          return address === REP_MIGRATION_YES_TOKEN_ADDRESS
            ? 6_536_489_541_836_818_514_118_101n
            : 1_250_000_000_000_000_000_000n;
        }

        if (functionName === "decimals") {
          return 18;
        }

        if (functionName === "symbol") {
          return address === REP_MIGRATION_YES_TOKEN_ADDRESS
            ? "REPv2_Yes_1"
            : "REPv2_No_1";
        }

        throw new Error(`Unexpected contract read: ${String(functionName)}`);
      });
    const client = { readContract } as unknown as PublicClient;

    await expect(readMigrationTokenSnapshot(client, 12_345n)).resolves.toEqual({
      no: {
        decimals: 18,
        supplyRaw: 1_250_000_000_000_000_000_000n,
        symbol: "REPv2_No_1",
        tokenAddress: REP_MIGRATION_NO_TOKEN_ADDRESS,
        universeAddress: REP_MIGRATION_NO_UNIVERSE_ADDRESS,
      },
      yes: {
        decimals: 18,
        supplyRaw: 6_536_489_541_836_818_514_118_101n,
        symbol: "REPv2_Yes_1",
        tokenAddress: REP_MIGRATION_YES_TOKEN_ADDRESS,
        universeAddress: REP_MIGRATION_YES_UNIVERSE_ADDRESS,
      },
    });

    expect(readContract).toHaveBeenCalledTimes(6);
    const tokenAddresses = new Set(
      readContract.mock.calls.map(([request]) => request.address),
    );
    expect(tokenAddresses).toEqual(
      new Set([
        REP_MIGRATION_YES_TOKEN_ADDRESS,
        REP_MIGRATION_NO_TOKEN_ADDRESS,
      ]),
    );
    for (const call of readContract.mock.calls) {
      expect(call[0].blockNumber).toBe(12_345n);
    }
  });
});
