import { describe, expect, it } from "vitest";
import {
  calculateMigrationPercentFromRaw,
  getMigrationProgressDataUrl,
  parseMigrationProgressPayload,
} from "./migration-progress.helpers";

describe("migration progress helpers", () => {
  it("calculates migration percentage with fixed-point bigint arithmetic", () => {
    expect(
      calculateMigrationPercentFromRaw({
        decimals: 18,
        migratedRaw: 2_946_674_861_494_239_596_308_538n,
        totalRep: 11_000_000,
      }),
    ).toBe(26.78);
  });

  it("joins migration data URLs with an Astro base path", () => {
    expect(getMigrationProgressDataUrl("/augur-forkwatch-website/")).toBe(
      "/augur-forkwatch-website/data/migration-progress.json",
    );
  });

  it("accepts migration JSON with specific safe RPC provenance", () => {
    expect(
      parseMigrationProgressPayload({
        schemaVersion: 1,
        status: "loaded",
        checkedAt: "2026-06-17T00:00:00.000Z",
        lastSuccessAt: "2026-06-17T00:00:00.000Z",
        source: "github-actions",
        chainId: 1,
        blockNumber: "1",
        token: {
          address: "0xCf6A0A7826fa124B7705d6f3c675eAD76f1e540D",
          symbol: "REPv2_Yes_1",
          decimals: 18,
          label: "REP migrated",
        },
        migratedRaw: "1000000000000000000",
        migratedRep: "1",
        migratedPercent: 0.01,
        forkEndTime: 1785718859,
        totalRep: "11000000",
        rpcInfo: {
          endpointLabel: "PublicNode",
          fallbacksAttempted: 0,
          latencyMs: 100,
          sourceChainId: 1,
          sourceRpcHost: "ethereum-rpc.publicnode.com",
          sourceRpcId: "publicnode",
          sourceRpcLabel: "PublicNode",
          sourceRpcPublic: true,
        },
        error: null,
      }),
    ).not.toBeNull();
  });

  it("rejects migration JSON without specific RPC provenance", () => {
    expect(
      parseMigrationProgressPayload({
        schemaVersion: 1,
        status: "loaded",
        checkedAt: "2026-06-17T00:00:00.000Z",
        lastSuccessAt: "2026-06-17T00:00:00.000Z",
        source: "github-actions",
        chainId: 1,
        blockNumber: "1",
        token: {
          address: "0xCf6A0A7826fa124B7705d6f3c675eAD76f1e540D",
          symbol: "REPv2_Yes_1",
          decimals: 18,
          label: "REP migrated",
        },
        migratedRaw: "1000000000000000000",
        migratedRep: "1",
        migratedPercent: 0.01,
        forkEndTime: 1785718859,
        totalRep: "11000000",
        rpcInfo: {
          endpointLabel: "Ethereum mainnet",
          fallbacksAttempted: 0,
          latencyMs: 100,
        },
        error: null,
      }),
    ).toBeNull();
  });
});
