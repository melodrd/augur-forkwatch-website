import { describe, expect, it } from "vitest";
import {
  REP_MIGRATION_NO_TOKEN_ADDRESS,
  REP_MIGRATION_NO_UNIVERSE_ADDRESS,
  REP_MIGRATION_YES_TOKEN_ADDRESS,
  REP_MIGRATION_YES_UNIVERSE_ADDRESS,
} from "./migration-progress.constants";
import {
  buildErrorMigrationProgressJson,
  buildLoadedMigrationProgressJson,
  calculateMigrationPercentFromRaw,
  getMigrationProgressDataUrl,
  parseMigrationProgressPayload,
  unixTimestampToSafeNumber,
} from "./migration-progress.helpers";

const YES_RAW = 6_000_000_000_000_000_000_000_000n;
const NO_RAW = 1_000_000_000_000_000_000_000_000n;

function loadedPayload() {
  return {
    schemaVersion: 2,
    status: "loaded",
    checkedAt: "2026-08-03T01:01:30.000Z",
    lastSuccessAt: "2026-08-03T01:01:30.000Z",
    source: "github-actions",
    chainId: 1,
    blockNumber: "25670864",
    outcomes: {
      yes: {
        universeAddress: REP_MIGRATION_YES_UNIVERSE_ADDRESS,
        token: {
          address: REP_MIGRATION_YES_TOKEN_ADDRESS,
          symbol: "REPv2_Yes_1",
          decimals: 18,
          label: "Yes outcome REP",
        },
        supplyRaw: YES_RAW.toString(),
        supplyRep: "6000000",
        supplyPercent: 54.55,
      },
      no: {
        universeAddress: REP_MIGRATION_NO_UNIVERSE_ADDRESS,
        token: {
          address: REP_MIGRATION_NO_TOKEN_ADDRESS,
          symbol: "REPv2_No_1",
          decimals: 18,
          label: "No outcome REP",
        },
        supplyRaw: NO_RAW.toString(),
        supplyRep: "1000000",
        supplyPercent: 9.09,
      },
    },
    migratedRaw: (YES_RAW + NO_RAW).toString(),
    migratedRep: "7000000",
    migratedPercent: 63.64,
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
  } as const;
}

function outcomeInputs() {
  return {
    no: {
      decimals: 18,
      supplyRaw: NO_RAW,
      symbol: "REPv2_No_1",
      tokenAddress: REP_MIGRATION_NO_TOKEN_ADDRESS,
      universeAddress: REP_MIGRATION_NO_UNIVERSE_ADDRESS,
    },
    yes: {
      decimals: 18,
      supplyRaw: YES_RAW,
      symbol: "REPv2_Yes_1",
      tokenAddress: REP_MIGRATION_YES_TOKEN_ADDRESS,
      universeAddress: REP_MIGRATION_YES_UNIVERSE_ADDRESS,
    },
  };
}

function buildLoadedProgress() {
  return buildLoadedMigrationProgressJson({
    blockNumber: "25670864",
    checkedAt: "2026-08-03T01:01:30.000Z",
    endpointLabel: "PublicNode",
    fallbacksAttempted: 0,
    forkEndTime: 1_785_718_859n,
    latencyMs: 100,
    outcomes: outcomeInputs(),
    rpcSource: {
      sourceRpcHost: "ethereum-rpc.publicnode.com",
      sourceRpcId: "publicnode",
      sourceRpcLabel: "PublicNode",
      sourceRpcPublic: true,
    },
    sourceChainId: 1,
  });
}

describe("migration progress helpers", () => {
  it("rounds migration percentages half-up with fixed-point bigint arithmetic", () => {
    expect(
      calculateMigrationPercentFromRaw({
        decimals: 18,
        migratedRaw: 2_946_674_861_494_239_596_308_538n,
        totalRep: 11_000_000,
      }),
    ).toBe(26.79);

    expect(
      calculateMigrationPercentFromRaw({
        decimals: 3,
        migratedRaw: 4n,
        totalRep: 100,
      }),
    ).toBe(0);
    expect(
      calculateMigrationPercentFromRaw({
        decimals: 3,
        migratedRaw: 5n,
        totalRep: 100,
      }),
    ).toBe(0.01);
  });

  it("rounds the current Yes, No, and combined supplies coherently", () => {
    const yesRaw = 6_536_489_541_836_818_514_118_101n;
    const noRaw = 1_786_227_400_866_527_400_056n;

    expect(
      calculateMigrationPercentFromRaw({
        decimals: 18,
        migratedRaw: yesRaw,
        totalRep: 11_000_000,
      }),
    ).toBe(59.42);
    expect(
      calculateMigrationPercentFromRaw({
        decimals: 18,
        migratedRaw: noRaw,
        totalRep: 11_000_000,
      }),
    ).toBe(0.02);
    expect(
      calculateMigrationPercentFromRaw({
        decimals: 18,
        migratedRaw: yesRaw + noRaw,
        totalRep: 11_000_000,
      }),
    ).toBe(59.44);
  });

  it("joins migration data URLs with an Astro base path", () => {
    expect(getMigrationProgressDataUrl("/augur-forkwatch-website/")).toBe(
      "/augur-forkwatch-website/data/migration-progress.json",
    );
  });

  it("accepts a coherent dual-outcome migration snapshot", () => {
    expect(parseMigrationProgressPayload(loadedPayload())).not.toBeNull();
    expect(buildLoadedProgress()).toEqual(loadedPayload());
  });

  it("rejects migration JSON without specific RPC provenance", () => {
    expect(
      parseMigrationProgressPayload({
        ...loadedPayload(),
        rpcInfo: {
          ...loadedPayload().rpcInfo,
          sourceRpcHost: null,
          sourceRpcLabel: "Ethereum mainnet",
        },
      }),
    ).toBeNull();
  });

  it("rejects the wrong token or child universe for either outcome", () => {
    expect(
      parseMigrationProgressPayload({
        ...loadedPayload(),
        outcomes: {
          ...loadedPayload().outcomes,
          yes: {
            ...loadedPayload().outcomes.yes,
            token: {
              ...loadedPayload().outcomes.yes.token,
              address: "0x221657776846890989a759ba2973e427dff5c9bb",
            },
          },
        },
      }),
    ).toBeNull();

    expect(
      parseMigrationProgressPayload({
        ...loadedPayload(),
        outcomes: {
          ...loadedPayload().outcomes,
          no: {
            ...loadedPayload().outcomes.no,
            universeAddress: REP_MIGRATION_YES_UNIVERSE_ADDRESS,
          },
        },
      }),
    ).toBeNull();
  });

  it("rejects an unexpected decimals value on either outcome", () => {
    for (const outcome of ["yes", "no"] as const) {
      expect(
        parseMigrationProgressPayload({
          ...loadedPayload(),
          outcomes: {
            ...loadedPayload().outcomes,
            [outcome]: {
              ...loadedPayload().outcomes[outcome],
              token: {
                ...loadedPayload().outcomes[outcome].token,
                decimals: 17,
              },
            },
          },
        }),
      ).toBeNull();
    }
  });

  it("rejects combined totals that do not equal Yes plus No", () => {
    for (const invalidCombined of [
      { migratedRaw: "1" },
      { migratedRep: "1" },
      { migratedPercent: 1 },
    ]) {
      expect(
        parseMigrationProgressPayload({
          ...loadedPayload(),
          ...invalidCombined,
        }),
      ).toBeNull();
    }
  });

  it("rejects partial supply data and incoherent status/error fields", () => {
    const unavailable = buildErrorMigrationProgressJson({
      checkedAt: "2026-08-03T02:00:00.000Z",
      code: "RPC_UNAVAILABLE",
      message: "Scheduled read failed.",
    });

    expect(parseMigrationProgressPayload(unavailable)).not.toBeNull();
    expect(
      parseMigrationProgressPayload({
        ...unavailable,
        outcomes: {
          ...unavailable.outcomes,
          yes: { ...unavailable.outcomes.yes, supplyRaw: "0" },
        },
      }),
    ).toBeNull();
    expect(
      parseMigrationProgressPayload({
        ...loadedPayload(),
        status: "error",
      }),
    ).toBeNull();
  });

  it("converts only Unix timestamps safe for JavaScript dates", () => {
    expect(unixTimestampToSafeNumber(1_785_718_859n)).toBe(1_785_718_859);
    expect(() => unixTimestampToSafeNumber(-1n)).toThrow("safe JavaScript");
    expect(() => unixTimestampToSafeNumber(8_640_000_000_001n)).toThrow(
      "safe JavaScript",
    );
  });

  it("rejects a loaded cutoff that differs from the immutable event fact", () => {
    expect(() =>
      buildLoadedMigrationProgressJson({
        blockNumber: "25670864",
        checkedAt: "2026-08-03T01:01:30.000Z",
        endpointLabel: "PublicNode",
        fallbacksAttempted: 0,
        forkEndTime: 1_785_718_860n,
        latencyMs: 100,
        outcomes: outcomeInputs(),
        rpcSource: {
          sourceRpcHost: "ethereum-rpc.publicnode.com",
          sourceRpcId: "publicnode",
          sourceRpcLabel: "PublicNode",
          sourceRpcPublic: true,
        },
        sourceChainId: 1,
      }),
    ).toThrow("does not match configured cutoff");
  });

  it("rejects a builder input with a wrong outcome contract", () => {
    const outcomes = outcomeInputs();

    expect(() =>
      buildLoadedMigrationProgressJson({
        blockNumber: "25670864",
        checkedAt: "2026-08-03T01:01:30.000Z",
        endpointLabel: "PublicNode",
        fallbacksAttempted: 0,
        forkEndTime: 1_785_718_859n,
        latencyMs: 100,
        outcomes: {
          ...outcomes,
          no: {
            ...outcomes.no,
            tokenAddress: REP_MIGRATION_YES_TOKEN_ADDRESS,
          },
        },
        rpcSource: {
          sourceRpcHost: "ethereum-rpc.publicnode.com",
          sourceRpcId: "publicnode",
          sourceRpcLabel: "PublicNode",
          sourceRpcPublic: true,
        },
        sourceChainId: 1,
      }),
    ).toThrow("configured token and child universe");
  });

  it("retains the full dual snapshot across repeated RPC errors", () => {
    const successfulProgress = buildLoadedProgress();
    const firstError = buildErrorMigrationProgressJson({
      checkedAt: "2026-08-03T02:00:00.000Z",
      code: "RPC_UNAVAILABLE",
      message: "First scheduled read failed.",
      previousProgress: successfulProgress,
    });
    const repeatedError = buildErrorMigrationProgressJson({
      checkedAt: "2026-08-03T03:00:00.000Z",
      code: "RPC_UNAVAILABLE",
      message: "Second scheduled read failed.",
      previousProgress: firstError,
    });

    expect(repeatedError).toMatchObject({
      blockNumber: "25670864",
      checkedAt: "2026-08-03T03:00:00.000Z",
      lastSuccessAt: "2026-08-03T01:01:30.000Z",
      migratedRaw: (YES_RAW + NO_RAW).toString(),
      outcomes: {
        no: { supplyRaw: NO_RAW.toString() },
        yes: { supplyRaw: YES_RAW.toString() },
      },
      status: "error",
    });
    expect(parseMigrationProgressPayload(repeatedError)).not.toBeNull();
  });
});
