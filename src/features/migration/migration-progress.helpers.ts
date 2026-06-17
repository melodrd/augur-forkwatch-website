import { formatUnits } from "viem";
import type { EthereumRpcSourceInfo } from "@/domain/ethereum/rpc-endpoints";
import { joinBasePath } from "@/lib/base-url";
import {
  FRESH_MS,
  MIGRATION_PROGRESS_DATA_PATH,
  MIGRATION_PROGRESS_SOURCE,
  REP_MIGRATION_TOKEN,
  REP_MIGRATION_TOKEN_ADDRESS,
  TOTAL_REP_SUPPLY,
  VERY_STALE_MS,
} from "./migration-progress.constants";
import type {
  MigrationProgressErrorCode,
  MigrationProgressFreshness,
  MigrationProgressJson,
} from "./migration-progress.types";

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

  const basisPoints = (migratedRaw * scale) / denominator;
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

export function isMigrationProgressJson(
  value: unknown,
): value is MigrationProgressJson {
  if (!isObject(value) || !isObject(value.token) || !isObject(value.rpcInfo)) {
    return false;
  }

  return (
    value.schemaVersion === 1 &&
    (value.status === "loaded" || value.status === "error") &&
    typeof value.checkedAt === "string" &&
    (typeof value.lastSuccessAt === "string" || value.lastSuccessAt === null) &&
    value.source === MIGRATION_PROGRESS_SOURCE &&
    value.chainId === 1 &&
    (typeof value.blockNumber === "string" || value.blockNumber === null) &&
    typeof value.token.address === "string" &&
    (typeof value.token.symbol === "string" || value.token.symbol === null) &&
    typeof value.token.decimals === "number" &&
    typeof value.token.label === "string" &&
    (typeof value.migratedRaw === "string" || value.migratedRaw === null) &&
    (typeof value.migratedRep === "string" || value.migratedRep === null) &&
    (typeof value.migratedPercent === "number" ||
      value.migratedPercent === null) &&
    (typeof value.forkEndTime === "number" || value.forkEndTime === null) &&
    typeof value.totalRep === "string" &&
    (typeof value.rpcInfo.endpointLabel === "string" ||
      value.rpcInfo.endpointLabel === null) &&
    (typeof value.rpcInfo.latencyMs === "number" ||
      value.rpcInfo.latencyMs === null) &&
    (typeof value.rpcInfo.fallbacksAttempted === "number" ||
      value.rpcInfo.fallbacksAttempted === null) &&
    (value.rpcInfo.sourceChainId === 1 ||
      value.rpcInfo.sourceChainId === null) &&
    (typeof value.rpcInfo.sourceRpcHost === "string" ||
      value.rpcInfo.sourceRpcHost === null) &&
    (typeof value.rpcInfo.sourceRpcId === "string" ||
      value.rpcInfo.sourceRpcId === null) &&
    (typeof value.rpcInfo.sourceRpcLabel === "string" ||
      value.rpcInfo.sourceRpcLabel === null) &&
    (typeof value.rpcInfo.sourceRpcPublic === "boolean" ||
      value.rpcInfo.sourceRpcPublic === null) &&
    isValidMigrationError(value.error)
  );
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
  decimals,
  endpointLabel,
  fallbacksAttempted,
  forkEndTime,
  latencyMs,
  migratedRaw,
  rpcSource,
  sourceChainId,
  symbol,
  tokenAddress = REP_MIGRATION_TOKEN_ADDRESS,
  tokenLabel = REP_MIGRATION_TOKEN.name,
}: {
  blockNumber: string;
  checkedAt: string;
  decimals: number;
  endpointLabel: string;
  fallbacksAttempted: number;
  forkEndTime: bigint;
  latencyMs: number;
  migratedRaw: bigint;
  rpcSource: EthereumRpcSourceInfo;
  sourceChainId: 1;
  symbol: string | null;
  tokenAddress?: string;
  tokenLabel?: string;
}): MigrationProgressJson {
  const migratedRep = tokenSupplyToDecimalString(migratedRaw, decimals);

  return {
    schemaVersion: 1,
    blockNumber,
    chainId: 1,
    checkedAt,
    error: null,
    forkEndTime: Number(forkEndTime),
    lastSuccessAt: checkedAt,
    migratedPercent: calculateMigrationPercentFromRaw({
      decimals,
      migratedRaw,
      totalRep: TOTAL_REP_SUPPLY,
    }),
    migratedRaw: migratedRaw.toString(),
    migratedRep,
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
    token: {
      address: tokenAddress,
      decimals,
      label: tokenLabel,
      symbol,
    },
    totalRep: TOTAL_REP_SUPPLY.toString(),
  };
}

export function buildErrorMigrationProgressJson({
  checkedAt,
  code,
  lastSuccessAt = null,
  message,
}: {
  checkedAt: string;
  code: MigrationProgressErrorCode;
  lastSuccessAt?: string | null;
  message: string;
}): MigrationProgressJson {
  return {
    schemaVersion: 1,
    blockNumber: null,
    chainId: 1,
    checkedAt,
    error: {
      code,
      message,
    },
    forkEndTime: null,
    lastSuccessAt,
    migratedPercent: null,
    migratedRaw: null,
    migratedRep: null,
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
    token: {
      address: REP_MIGRATION_TOKEN_ADDRESS,
      decimals: REP_MIGRATION_TOKEN.decimals,
      label: REP_MIGRATION_TOKEN.name,
      symbol: null,
    },
    totalRep: TOTAL_REP_SUPPLY.toString(),
  };
}
