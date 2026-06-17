export type MigrationProgressStatus = "error" | "loaded";

export type MigrationProgressErrorCode =
  | "CONTRACT_READ_FAILED"
  | "RPC_UNAVAILABLE"
  | "UNKNOWN";

export type MigrationProgressFreshness =
  | "fresh"
  | "stale"
  | "unknown"
  | "very-stale";

export type MigrationProgressJson = {
  schemaVersion: 1;
  status: MigrationProgressStatus;
  checkedAt: string;
  lastSuccessAt: string | null;
  source: "github-actions";
  chainId: 1;
  blockNumber: string | null;
  token: {
    address: string;
    symbol: string | null;
    decimals: number;
    label: string;
  };
  migratedRaw: string | null;
  migratedRep: string | null;
  migratedPercent: number | null;
  forkEndTime: number | null;
  totalRep: string;
  rpcInfo: {
    endpointLabel: string | null;
    fallbacksAttempted: number | null;
    latencyMs: number | null;
    sourceChainId: 1 | null;
    sourceRpcHost: string | null;
    sourceRpcId: string | null;
    sourceRpcLabel: string | null;
    sourceRpcPublic: boolean | null;
  };
  error: null | {
    code: MigrationProgressErrorCode;
    message: string;
  };
};

export type MigrationProgressLoadState =
  | {
      error: null;
      progress: null;
      status: "loading";
    }
  | {
      error: null;
      progress: MigrationProgressJson;
      status: "ready";
    }
  | {
      error: string;
      progress: null;
      status: "unavailable";
    };
