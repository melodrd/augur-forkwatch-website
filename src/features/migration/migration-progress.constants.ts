import type { Address } from "viem";
import { REP_TOKENS } from "@/domain/tokens/rep-tokens";

export const AUGUR_GENESIS_UNIVERSE_ADDRESS =
  "0xe991247b78f937d7b69cfc00f1a487a293557677";
export const AUGUR_FORK_MARKET_ADDRESSES = [
  "0x963eed85778cc23e2d4636cd4f29eecdf9827e9e",
] as const satisfies readonly Address[];
export const AUGUR_MIGRATION_OUTCOME_INDEX = 1;

export const REP_MIGRATION_TOKEN = REP_TOKENS.repV2Yes1;
export const REP_MIGRATION_TOKEN_ADDRESS = REP_MIGRATION_TOKEN.address;

export const TOTAL_REP_SUPPLY = 11_000_000;
export const MIGRATION_PROGRESS_DATA_PATH = "data/migration-progress.json";
export const MIGRATION_PROGRESS_SOURCE = "github-actions";
export const FRESH_MS = 60 * 60 * 1000;
export const VERY_STALE_MS = 6 * 60 * 60 * 1000;
