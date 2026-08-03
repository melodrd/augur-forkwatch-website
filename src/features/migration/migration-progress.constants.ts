import type { Address } from "viem";
import type { MigrationOutcomeKey } from "./migration-progress.types";

export const AUGUR_GENESIS_UNIVERSE_ADDRESS =
  "0xe991247b78f937d7b69cfc00f1a487a293557677";

/**
 * Immutable cutoff for this Ethereum mainnet fork, in Unix seconds.
 *
 * The completed-fork UI and generated supply record both use this historical
 * event fact; the client does not switch states based on its local clock.
 */
export const AUGUR_FORK_END_TIME_FALLBACK_UNIX_SECONDS = 1_785_718_859;

export const AUGUR_PARENT_UNIVERSE_ADDRESS =
  "0x49244BD018Ca9fd1f06ecC07B9E9De773246e5AA" as const satisfies Address;
export const REP_MIGRATION_YES_UNIVERSE_ADDRESS =
  "0x281171519Fb41540528398d8ED3EA257f0F32A9f" as const satisfies Address;
export const REP_MIGRATION_NO_UNIVERSE_ADDRESS =
  "0xbaaD633FAa0E4847A4b66043E3E92102e5800546" as const satisfies Address;
export const REP_MIGRATION_YES_TOKEN_ADDRESS =
  "0xCf6A0A7826fa124B7705d6f3c675eAD76f1e540D" as const satisfies Address;
export const REP_MIGRATION_NO_TOKEN_ADDRESS =
  "0x2F4005456c2F098358213f01DbE34abDAa2989A4" as const satisfies Address;

export const REP_MIGRATION_OUTCOME_CONFIG = {
  yes: {
    decimals: 18,
    label: "Yes outcome REP",
    tokenAddress: REP_MIGRATION_YES_TOKEN_ADDRESS,
    universeAddress: REP_MIGRATION_YES_UNIVERSE_ADDRESS,
  },
  no: {
    decimals: 18,
    label: "No outcome REP",
    tokenAddress: REP_MIGRATION_NO_TOKEN_ADDRESS,
    universeAddress: REP_MIGRATION_NO_UNIVERSE_ADDRESS,
  },
} as const satisfies Record<
  MigrationOutcomeKey,
  {
    decimals: number;
    label: string;
    tokenAddress: Address;
    universeAddress: Address;
  }
>;

export const TOTAL_REP_SUPPLY = 11_000_000;
export const MIGRATION_PROGRESS_DATA_PATH = "data/migration-progress.json";
export const MIGRATION_PROGRESS_SOURCE = "github-actions";
export const FRESH_MS = 60 * 60 * 1000;
export const VERY_STALE_MS = 6 * 60 * 60 * 1000;
