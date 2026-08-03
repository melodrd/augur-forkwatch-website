import type { PublicClient } from "viem";
import {
  readErc20Decimals,
  readErc20Symbol,
  readErc20TotalSupply,
} from "../../services/ethereum/erc20";
import { REP_MIGRATION_OUTCOME_CONFIG } from "./migration-progress.constants";
import type { MigrationOutcomeKey } from "./migration-progress.types";

export type MigrationOutcomeTokenSnapshot = {
  decimals: number;
  supplyRaw: bigint;
  symbol: string | null;
  tokenAddress: string;
  universeAddress: string;
};

async function readOutcomeTokenSnapshot(
  client: PublicClient,
  blockNumber: bigint,
  outcome: MigrationOutcomeKey,
): Promise<MigrationOutcomeTokenSnapshot> {
  const config = REP_MIGRATION_OUTCOME_CONFIG[outcome];
  const [supplyRaw, decimals, symbol] = await Promise.all([
    readErc20TotalSupply(client, config.tokenAddress, blockNumber),
    readErc20Decimals(
      client,
      config.tokenAddress,
      config.decimals,
      blockNumber,
    ),
    readErc20Symbol(client, config.tokenAddress, blockNumber),
  ]);

  return {
    decimals,
    supplyRaw,
    symbol,
    tokenAddress: config.tokenAddress,
    universeAddress: config.universeAddress,
  };
}

export async function readMigrationTokenSnapshot(
  client: PublicClient,
  blockNumber: bigint,
) {
  const [yes, no] = await Promise.all([
    readOutcomeTokenSnapshot(client, blockNumber, "yes"),
    readOutcomeTokenSnapshot(client, blockNumber, "no"),
  ]);

  return { no, yes };
}
