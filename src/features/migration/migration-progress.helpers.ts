import { formatUnits, isAddress } from "viem";
import type { EthereumRpcSourceInfo } from "@/domain/ethereum/rpc-endpoints";
import { joinBasePath } from "@/lib/base-url";
import {
  AUGUR_FORK_END_TIME_FALLBACK_UNIX_SECONDS,
  FRESH_MS,
  MIGRATION_PROGRESS_DATA_PATH,
  MIGRATION_PROGRESS_SOURCE,
  REP_MIGRATION_OUTCOME_CONFIG,
  TOTAL_REP_SUPPLY,
  VERY_STALE_MS,
} from "./migration-progress.constants";
import type {
  MigrationOutcomeKey,
  MigrationOutcomeSnapshot,
  MigrationProgressErrorCode,
  MigrationProgressFreshness,
  MigrationProgressJson,
  MigrationTokenMetadata,
} from "./migration-progress.types";
import type { MigrationOutcomeTokenSnapshot } from "./migration-token-snapshot";

const MAX_DATE_UNIX_SECONDS = 8_640_000_000_000;
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
function addressesEqual(left: string, right: string): boolean {
  return left.toLowerCase() === right.toLowerCase();
}

function isNonZeroAddress(value: unknown): value is string {
  return (
    typeof value === "string" &&
    isAddress(value) &&
    !addressesEqual(value, ZERO_ADDRESS)
  );
}

function isValidIsoTimestamp(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }

  const timestamp = Date.parse(value);
  return (
    Number.isFinite(timestamp) && new Date(timestamp).toISOString() === value
  );
}

function isSafeUnixTimestamp(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isSafeInteger(value) &&
    value >= 0 &&
    value <= MAX_DATE_UNIX_SECONDS
  );
}

function isValidTokenMetadata(value: unknown): value is MigrationTokenMetadata {
  return (
    isObject(value) &&
    isNonZeroAddress(value.address) &&
    (typeof value.symbol === "string" || value.symbol === null) &&
    typeof value.decimals === "number" &&
    Number.isInteger(value.decimals) &&
    value.decimals >= 0 &&
    value.decimals <= 255 &&
    typeof value.label === "string" &&
    value.label.trim().length > 0
  );
}

function isNonNegativeIntegerString(value: unknown): value is string {
  return typeof value === "string" && /^\d+$/.test(value);
}

function isValidPercent(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0 &&
    value <= 100
  );
}

export function unixTimestampToSafeNumber(
  timestamp: bigint,
  label = "Unix timestamp",
): number {
  if (timestamp < 0n || timestamp > BigInt(MAX_DATE_UNIX_SECONDS)) {
    throw new Error(`${label} is outside the safe JavaScript Date range.`);
  }

  return Number(timestamp);
}

export function tokenSupplyToNumber(
  totalSupplyRaw: bigint,
  decimals: number,
): number | null {
  const formatted = formatUnits(totalSupplyRaw, decimals);
  const supply = Number(formatted);

  return Number.isFinite(supply) ? supply : null;
}

export function calculateMigrationPercent(
  migratedRep: number | null,
  totalRep: number,
): number | null {
  if (
    migratedRep === null ||
    !Number.isFinite(migratedRep) ||
    !Number.isFinite(totalRep) ||
    totalRep <= 0
  ) {
    return null;
  }

  return Math.min(100, Math.max(0, (migratedRep / totalRep) * 100));
}

export function calculateMigrationPercentFromRaw({
  decimals,
  migratedRaw,
  totalRep,
}: {
  decimals: number;
  migratedRaw: bigint;
  totalRep: number;
}): number | null {
  if (
    !Number.isInteger(decimals) ||
    decimals < 0 ||
    migratedRaw < 0n ||
    !Number.isFinite(totalRep) ||
    totalRep <= 0
  ) {
    return null;
  }

  const scale = 10_000n;
  const denominator = BigInt(totalRep) * 10n ** BigInt(decimals);

  if (denominator <= 0n) {
    return null;
  }

  const scaledSupply = migratedRaw * scale;
  const basisPoints = (scaledSupply * 2n + denominator) / (denominator * 2n);
  const clampedBasisPoints = basisPoints > scale ? scale : basisPoints;

  return Number(clampedBasisPoints) / 100;
}

export function tokenSupplyToDecimalString(
  totalSupplyRaw: bigint,
  decimals: number,
): string {
  return formatUnits(totalSupplyRaw, decimals);
}

export function getMigrationProgressDataUrl(baseUrl: string): string {
  return joinBasePath(baseUrl, MIGRATION_PROGRESS_DATA_PATH);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isValidMigrationError(value: unknown): boolean {
  if (value === null) {
    return true;
  }

  if (!isObject(value)) {
    return false;
  }

  return (
    (value.code === "RPC_UNAVAILABLE" ||
      value.code === "CONTRACT_READ_FAILED" ||
      value.code === "UNKNOWN") &&
    typeof value.message === "string"
  );
}

function isCanonicalUintString(value: unknown): value is string {
  return (
    isNonNegativeIntegerString(value) && BigInt(value).toString() === value
  );
}

function isValidRpcInfo(
  value: unknown,
  hasSuccessfulSnapshot: boolean,
): boolean {
  if (!isObject(value)) {
    return false;
  }

  if (!hasSuccessfulSnapshot) {
    return (
      value.endpointLabel === null &&
      value.fallbacksAttempted === null &&
      value.latencyMs === null &&
      value.sourceChainId === null &&
      value.sourceRpcHost === null &&
      value.sourceRpcId === null &&
      value.sourceRpcLabel === null &&
      value.sourceRpcPublic === null
    );
  }

  return (
    typeof value.endpointLabel === "string" &&
    value.endpointLabel.trim().length > 0 &&
    typeof value.fallbacksAttempted === "number" &&
    Number.isInteger(value.fallbacksAttempted) &&
    value.fallbacksAttempted >= 0 &&
    typeof value.latencyMs === "number" &&
    Number.isFinite(value.latencyMs) &&
    value.latencyMs >= 0 &&
    value.sourceChainId === 1 &&
    typeof value.sourceRpcHost === "string" &&
    value.sourceRpcHost.trim().length > 0 &&
    typeof value.sourceRpcId === "string" &&
    value.sourceRpcId.trim().length > 0 &&
    typeof value.sourceRpcLabel === "string" &&
    value.sourceRpcLabel.trim().length > 0 &&
    typeof value.sourceRpcPublic === "boolean"
  );
}

function isValidOutcomeSnapshot(
  value: unknown,
  outcome: MigrationOutcomeKey,
  hasSuccessfulSnapshot: boolean,
): value is MigrationOutcomeSnapshot {
  const config = REP_MIGRATION_OUTCOME_CONFIG[outcome];

  if (
    !isObject(value) ||
    !isObject(value.token) ||
    !isValidTokenMetadata(value.token) ||
    !isNonZeroAddress(value.universeAddress) ||
    !addressesEqual(value.universeAddress, config.universeAddress) ||
    !addressesEqual(value.token.address as string, config.tokenAddress) ||
    value.token.decimals !== config.decimals ||
    value.token.label !== config.label
  ) {
    return false;
  }

  if (!hasSuccessfulSnapshot) {
    return (
      value.supplyRaw === null &&
      value.supplyRep === null &&
      value.supplyPercent === null
    );
  }

  if (
    !isCanonicalUintString(value.supplyRaw) ||
    typeof value.supplyRep !== "string" ||
    !isValidPercent(value.supplyPercent)
  ) {
    return false;
  }

  const supplyRaw = BigInt(value.supplyRaw);

  return (
    value.supplyRep ===
      tokenSupplyToDecimalString(supplyRaw, value.token.decimals) &&
    value.supplyPercent ===
      calculateMigrationPercentFromRaw({
        decimals: value.token.decimals,
        migratedRaw: supplyRaw,
        totalRep: TOTAL_REP_SUPPLY,
      })
  );
}

export function isMigrationProgressJson(
  value: unknown,
): value is MigrationProgressJson {
  if (
    !isObject(value) ||
    !isObject(value.outcomes) ||
    !isObject(value.rpcInfo)
  ) {
    return false;
  }

  const hasSuccessfulSnapshot = value.blockNumber !== null;

  if (
    value.schemaVersion !== 2 ||
    (value.status !== "loaded" && value.status !== "error") ||
    !isValidIsoTimestamp(value.checkedAt) ||
    value.source !== MIGRATION_PROGRESS_SOURCE ||
    value.chainId !== 1 ||
    value.totalRep !== TOTAL_REP_SUPPLY.toString() ||
    !isValidMigrationError(value.error) ||
    !isValidOutcomeSnapshot(value.outcomes.yes, "yes", hasSuccessfulSnapshot) ||
    !isValidOutcomeSnapshot(value.outcomes.no, "no", hasSuccessfulSnapshot) ||
    !isValidRpcInfo(value.rpcInfo, hasSuccessfulSnapshot)
  ) {
    return false;
  }

  if (!hasSuccessfulSnapshot) {
    return (
      value.status === "error" &&
      value.error !== null &&
      value.blockNumber === null &&
      value.lastSuccessAt === null &&
      value.forkEndTime === null &&
      value.migratedRaw === null &&
      value.migratedRep === null &&
      value.migratedPercent === null
    );
  }

  if (
    !isCanonicalUintString(value.blockNumber) ||
    !isValidIsoTimestamp(value.lastSuccessAt) ||
    !isSafeUnixTimestamp(value.forkEndTime) ||
    value.forkEndTime !== AUGUR_FORK_END_TIME_FALLBACK_UNIX_SECONDS ||
    !isCanonicalUintString(value.migratedRaw) ||
    typeof value.migratedRep !== "string" ||
    !isValidPercent(value.migratedPercent) ||
    value.outcomes.yes.supplyRaw === null ||
    value.outcomes.no.supplyRaw === null
  ) {
    return false;
  }

  const combinedRaw =
    BigInt(value.outcomes.yes.supplyRaw) + BigInt(value.outcomes.no.supplyRaw);
  const decimals = value.outcomes.yes.token.decimals;

  if (
    value.outcomes.no.token.decimals !== decimals ||
    value.migratedRaw !== combinedRaw.toString() ||
    value.migratedRep !== tokenSupplyToDecimalString(combinedRaw, decimals) ||
    value.migratedPercent !==
      calculateMigrationPercentFromRaw({
        decimals,
        migratedRaw: combinedRaw,
        totalRep: TOTAL_REP_SUPPLY,
      })
  ) {
    return false;
  }

  return value.status === "loaded"
    ? value.error === null && value.lastSuccessAt === value.checkedAt
    : value.error !== null;
}

export function parseMigrationProgressPayload(
  payload: unknown,
): MigrationProgressJson | null {
  return isMigrationProgressJson(payload) ? payload : null;
}

export function calculateMigrationProgressFreshness(
  progress: MigrationProgressJson,
  nowMs = Date.now(),
): MigrationProgressFreshness {
  const referenceTime = progress.lastSuccessAt ?? progress.checkedAt;
  const checkedAtMs = Date.parse(referenceTime);

  if (Number.isNaN(checkedAtMs)) {
    return "unknown";
  }

  const ageMs = Math.max(0, nowMs - checkedAtMs);

  if (ageMs <= FRESH_MS) {
    return "fresh";
  }

  if (ageMs <= VERY_STALE_MS) {
    return "stale";
  }

  return "very-stale";
}

export function buildLoadedMigrationProgressJson({
  blockNumber,
  checkedAt,
  endpointLabel,
  fallbacksAttempted,
  forkEndTime,
  latencyMs,
  outcomes,
  rpcSource,
  sourceChainId,
}: {
  blockNumber: string;
  checkedAt: string;
  endpointLabel: string;
  fallbacksAttempted: number;
  forkEndTime: bigint;
  latencyMs: number;
  outcomes: Record<MigrationOutcomeKey, MigrationOutcomeTokenSnapshot>;
  rpcSource: EthereumRpcSourceInfo;
  sourceChainId: 1;
}): MigrationProgressJson {
  const forkEndTimeNumber = unixTimestampToSafeNumber(
    forkEndTime,
    "Augur fork end time",
  );

  if (forkEndTimeNumber !== AUGUR_FORK_END_TIME_FALLBACK_UNIX_SECONDS) {
    throw new Error(
      `Fork end time ${forkEndTimeNumber} does not match configured cutoff ${AUGUR_FORK_END_TIME_FALLBACK_UNIX_SECONDS}.`,
    );
  }

  const buildOutcome = (
    outcome: MigrationOutcomeKey,
  ): MigrationOutcomeSnapshot => {
    const input = outcomes[outcome];
    const config = REP_MIGRATION_OUTCOME_CONFIG[outcome];

    if (
      !addressesEqual(input.tokenAddress, config.tokenAddress) ||
      !addressesEqual(input.universeAddress, config.universeAddress)
    ) {
      throw new Error(
        `${outcome.toUpperCase()} migration supply must use the configured token and child universe.`,
      );
    }

    if (input.decimals !== config.decimals) {
      throw new Error(
        `${outcome.toUpperCase()} migration token returned ${input.decimals} decimals; expected ${config.decimals}.`,
      );
    }

    if (input.supplyRaw < 0n) {
      throw new Error(
        `${outcome.toUpperCase()} migration token returned a negative supply.`,
      );
    }

    return {
      supplyPercent: calculateMigrationPercentFromRaw({
        decimals: input.decimals,
        migratedRaw: input.supplyRaw,
        totalRep: TOTAL_REP_SUPPLY,
      }),
      supplyRaw: input.supplyRaw.toString(),
      supplyRep: tokenSupplyToDecimalString(input.supplyRaw, input.decimals),
      token: {
        address: input.tokenAddress,
        decimals: input.decimals,
        label: config.label,
        symbol: input.symbol,
      },
      universeAddress: input.universeAddress,
    };
  };

  const outcomeSnapshots = {
    no: buildOutcome("no"),
    yes: buildOutcome("yes"),
  };
  const combinedRaw = outcomes.yes.supplyRaw + outcomes.no.supplyRaw;
  const combinedDecimals = outcomes.yes.decimals;

  if (outcomes.no.decimals !== combinedDecimals) {
    throw new Error("Migration outcome tokens must use the same decimals.");
  }

  const progress: MigrationProgressJson = {
    schemaVersion: 2,
    blockNumber,
    chainId: 1,
    checkedAt,
    error: null,
    forkEndTime: forkEndTimeNumber,
    lastSuccessAt: checkedAt,
    migratedPercent: calculateMigrationPercentFromRaw({
      decimals: combinedDecimals,
      migratedRaw: combinedRaw,
      totalRep: TOTAL_REP_SUPPLY,
    }),
    migratedRaw: combinedRaw.toString(),
    migratedRep: tokenSupplyToDecimalString(combinedRaw, combinedDecimals),
    outcomes: outcomeSnapshots,
    rpcInfo: {
      endpointLabel,
      fallbacksAttempted,
      latencyMs,
      sourceChainId,
      sourceRpcHost: rpcSource.sourceRpcHost,
      sourceRpcId: rpcSource.sourceRpcId,
      sourceRpcLabel: rpcSource.sourceRpcLabel,
      sourceRpcPublic: rpcSource.sourceRpcPublic,
    },
    source: MIGRATION_PROGRESS_SOURCE,
    status: "loaded",
    totalRep: TOTAL_REP_SUPPLY.toString(),
  };

  if (!isMigrationProgressJson(progress)) {
    throw new Error("Generated migration progress snapshot is inconsistent.");
  }

  return progress;
}

export function buildErrorMigrationProgressJson({
  checkedAt,
  code,
  message,
  previousProgress = null,
}: {
  checkedAt: string;
  code: MigrationProgressErrorCode;
  message: string;
  previousProgress?: MigrationProgressJson | null;
}): MigrationProgressJson {
  const hasLastSuccessfulSnapshot =
    previousProgress !== null && previousProgress.blockNumber !== null;

  if (hasLastSuccessfulSnapshot) {
    return {
      ...previousProgress,
      checkedAt,
      error: {
        code,
        message,
      },
      status: "error",
    };
  }

  return {
    schemaVersion: 2,
    blockNumber: null,
    chainId: 1,
    checkedAt,
    error: {
      code,
      message,
    },
    forkEndTime: null,
    lastSuccessAt: null,
    migratedPercent: null,
    migratedRaw: null,
    migratedRep: null,
    outcomes: {
      no: {
        supplyPercent: null,
        supplyRaw: null,
        supplyRep: null,
        token: {
          address: REP_MIGRATION_OUTCOME_CONFIG.no.tokenAddress,
          decimals: REP_MIGRATION_OUTCOME_CONFIG.no.decimals,
          label: REP_MIGRATION_OUTCOME_CONFIG.no.label,
          symbol: null,
        },
        universeAddress: REP_MIGRATION_OUTCOME_CONFIG.no.universeAddress,
      },
      yes: {
        supplyPercent: null,
        supplyRaw: null,
        supplyRep: null,
        token: {
          address: REP_MIGRATION_OUTCOME_CONFIG.yes.tokenAddress,
          decimals: REP_MIGRATION_OUTCOME_CONFIG.yes.decimals,
          label: REP_MIGRATION_OUTCOME_CONFIG.yes.label,
          symbol: null,
        },
        universeAddress: REP_MIGRATION_OUTCOME_CONFIG.yes.universeAddress,
      },
    },
    rpcInfo: {
      endpointLabel: null,
      fallbacksAttempted: null,
      latencyMs: null,
      sourceChainId: null,
      sourceRpcHost: null,
      sourceRpcId: null,
      sourceRpcLabel: null,
      sourceRpcPublic: null,
    },
    source: MIGRATION_PROGRESS_SOURCE,
    status: "error",
    totalRep: TOTAL_REP_SUPPLY.toString(),
  };
}
