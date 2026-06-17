import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createPublicClient, http, type PublicClient } from "viem";
import { mainnet } from "viem/chains";
import {
  type EthereumRpcEndpoint,
  getEthereumRpcEndpoints,
  getEthereumRpcSourceInfo,
  getSafeRpcFailureLabel,
  sanitizeRpcErrorMessage,
} from "../src/domain/ethereum/rpc-endpoints";
import {
  AUGUR_FORK_MARKET_ADDRESSES,
  AUGUR_MIGRATION_OUTCOME_INDEX,
} from "../src/features/migration/migration-progress.constants";
import {
  buildErrorMigrationProgressJson,
  buildLoadedMigrationProgressJson,
  parseMigrationProgressPayload,
} from "../src/features/migration/migration-progress.helpers";
import type {
  MigrationProgressErrorCode,
  MigrationProgressJson,
} from "../src/features/migration/migration-progress.types";
import { readAugurMigrationMarketStateFromMarkets } from "../src/services/ethereum/augur-universe";
import {
  readErc20Decimals,
  readErc20Symbol,
  readErc20TotalSupply,
} from "../src/services/ethereum/erc20";

const OUTPUT_PATH = fileURLToPath(
  new URL("../public/data/migration-progress.json", import.meta.url),
);

const RPC_TIMEOUT_MS = 10_000;
const ETHEREUM_MAINNET_CHAIN_ID = 1;

const RPC_ENDPOINTS = getEthereumRpcEndpoints(
  process.env.ETH_RPC_URL,
  process.env.ETH_RPC_LABEL,
);

function createClient(endpoint: EthereumRpcEndpoint): PublicClient {
  return createPublicClient({
    chain: mainnet,
    transport: http(endpoint.url, {
      retryCount: 0,
      timeout: RPC_TIMEOUT_MS,
    }),
  });
}

async function readExistingProgress(): Promise<MigrationProgressJson | null> {
  try {
    return parseMigrationProgressPayload(
      JSON.parse(await readFile(OUTPUT_PATH, "utf8")) as unknown,
    );
  } catch {
    return null;
  }
}

function buildSafeErrorJson({
  checkedAt,
  code,
  message,
  previousProgress,
}: {
  checkedAt: string;
  code: MigrationProgressErrorCode;
  message: string;
  previousProgress: MigrationProgressJson | null;
}): MigrationProgressJson {
  const lastSuccessAt =
    previousProgress?.lastSuccessAt ??
    (previousProgress?.status === "loaded" ? previousProgress.checkedAt : null);

  if (previousProgress?.status === "loaded") {
    return {
      ...previousProgress,
      checkedAt,
      error: {
        code,
        message,
      },
      lastSuccessAt,
      status: "error",
    };
  }

  return buildErrorMigrationProgressJson({
    checkedAt,
    code,
    lastSuccessAt,
    message,
  });
}

async function generateMigrationProgress(): Promise<MigrationProgressJson> {
  const checkedAt = new Date().toISOString();
  const errors: string[] = [];
  let sawMainnetRpc = false;

  for (const [index, endpoint] of RPC_ENDPOINTS.entries()) {
    const startedAt = Date.now();
    const client = createClient(endpoint);

    try {
      const sourceChainId = await client.getChainId();

      if (sourceChainId !== ETHEREUM_MAINNET_CHAIN_ID) {
        throw new Error(
          `RPC returned chain ID ${sourceChainId}; expected Ethereum mainnet chain ID 1.`,
        );
      }

      sawMainnetRpc = true;

      const blockNumber = await client.getBlockNumber();
      const { forkEndTime, migrationTokenAddress } =
        await readAugurMigrationMarketStateFromMarkets(
          client,
          AUGUR_FORK_MARKET_ADDRESSES,
          AUGUR_MIGRATION_OUTCOME_INDEX,
        );

      const [migratedRaw, decimals, symbol] = await Promise.all([
        readErc20TotalSupply(client, migrationTokenAddress),
        readErc20Decimals(client, migrationTokenAddress),
        readErc20Symbol(client, migrationTokenAddress),
      ]);

      return buildLoadedMigrationProgressJson({
        blockNumber: blockNumber.toString(),
        checkedAt,
        decimals,
        endpointLabel: endpoint.label,
        fallbacksAttempted: index,
        forkEndTime,
        latencyMs: Date.now() - startedAt,
        migratedRaw,
        rpcSource: getEthereumRpcSourceInfo(endpoint),
        sourceChainId: ETHEREUM_MAINNET_CHAIN_ID,
        symbol,
        tokenAddress: migrationTokenAddress,
        tokenLabel: "REP migrated",
      });
    } catch (error) {
      errors.push(
        `${getSafeRpcFailureLabel(endpoint)}: ${sanitizeRpcErrorMessage(
          error,
          RPC_ENDPOINTS,
        )}`,
      );
    }
  }

  return buildSafeErrorJson({
    checkedAt,
    code: sawMainnetRpc ? "CONTRACT_READ_FAILED" : "RPC_UNAVAILABLE",
    message:
      errors.length > 0
        ? errors.join(" | ")
        : "No Ethereum RPC endpoints were configured.",
    previousProgress: await readExistingProgress(),
  });
}

const progress = await generateMigrationProgress();

await mkdir(dirname(OUTPUT_PATH), { recursive: true });
await writeFile(OUTPUT_PATH, `${JSON.stringify(progress, null, 2)}\n`);

if (progress.status === "loaded") {
  console.log(
    `Migration progress generated: ${progress.migratedRep} REP migrated, ${progress.migratedPercent?.toFixed(
      4,
    )}% migrated. Source: ${progress.rpcInfo.sourceRpcLabel}. Block: ${
      progress.blockNumber
    }.`,
  );
} else {
  console.warn(
    `Migration progress generated with error: ${progress.error?.code}. Last success: ${
      progress.lastSuccessAt ?? "none"
    }.`,
  );
}
