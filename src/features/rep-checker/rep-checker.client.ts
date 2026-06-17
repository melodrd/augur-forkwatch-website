import {
  type Address,
  createPublicClient,
  formatUnits,
  http,
  type PublicClient,
} from "viem";
import { mainnet } from "viem/chains";
import {
  type EthereumRpcEndpoint,
  getEthereumRpcEndpoints,
  getEthereumRpcSourceInfo,
} from "@/domain/ethereum/rpc-endpoints";
import { REP_TOKEN_LIST, type RepToken } from "@/domain/tokens/rep-tokens";
import { readErc20BalanceOf } from "@/services/ethereum/erc20";
import { REP_CHECKER_RPC_ERROR_MESSAGE } from "./rep-checker.copy";
import {
  deriveStatusFromBalances,
  formatRepBalance,
  normalizeAddressInput,
} from "./rep-checker.helpers";
import type {
  RepBalanceCheckError,
  RepBalanceCheckResult,
  RepTokenBalance,
} from "./rep-checker.types";

const REP_CHECKER_RPC_TIMEOUT_MS = 10_000;
const ETHEREUM_MAINNET_CHAIN_ID = 1;

type CheckWalletRepOptions = {
  createClient?: (endpoint: EthereumRpcEndpoint) => PublicClient;
  endpoints?: readonly EthereumRpcEndpoint[];
  now?: () => Date;
  readBalance?: (
    client: PublicClient,
    tokenConfig: RepToken,
    address: Address,
  ) => Promise<RepTokenBalance>;
};

function createRepCheckerClient(endpoint: EthereumRpcEndpoint): PublicClient {
  return createPublicClient({
    chain: mainnet,
    transport: http(endpoint.url, {
      retryCount: 0,
      timeout: REP_CHECKER_RPC_TIMEOUT_MS,
    }),
  });
}

async function readRepTokenBalance(
  client: PublicClient,
  tokenConfig: RepToken,
  address: Address,
): Promise<RepTokenBalance> {
  const balanceRaw = await readErc20BalanceOf(
    client,
    tokenConfig.address,
    address,
  );
  const formattedBalance = formatUnits(balanceRaw, tokenConfig.decimals);

  return {
    balance: formatRepBalance(formattedBalance),
    balanceRaw: balanceRaw.toString(),
    chainId: tokenConfig.chainId,
    chainName: tokenConfig.chainName,
    decimals: tokenConfig.decimals,
    hasBalance: balanceRaw > BigInt(0),
    readStatus: "loaded",
    token: tokenConfig.symbol,
    tokenAddress: tokenConfig.address,
  };
}

function failedRepTokenBalance(tokenConfig: RepToken): RepTokenBalance {
  return {
    balance: "Unavailable",
    balanceRaw: null,
    chainId: tokenConfig.chainId,
    chainName: tokenConfig.chainName,
    decimals: tokenConfig.decimals,
    error: "Could not read this token balance.",
    hasBalance: false,
    readStatus: "error",
    token: tokenConfig.symbol,
    tokenAddress: tokenConfig.address,
  };
}

function rpcError(address: string, checkedAt: string): RepBalanceCheckError {
  return {
    address,
    checkedAt,
    message: REP_CHECKER_RPC_ERROR_MESSAGE,
    status: "error",
  };
}

export async function checkWalletRep(
  inputAddress: string,
  options: CheckWalletRepOptions = {},
): Promise<RepBalanceCheckResult | RepBalanceCheckError> {
  const checkedAt = (options.now?.() ?? new Date()).toISOString();
  const normalizedInput = normalizeAddressInput(inputAddress);

  if (!normalizedInput.ok) {
    return {
      address: normalizedInput.address,
      checkedAt,
      message: normalizedInput.message,
      status: "invalid",
    };
  }

  const endpoints = options.endpoints ?? getEthereumRpcEndpoints();
  const createClient = options.createClient ?? createRepCheckerClient;
  const readBalance = options.readBalance ?? readRepTokenBalance;

  for (const [index, endpoint] of endpoints.entries()) {
    try {
      const client = createClient(endpoint);
      const startedAt = Date.now();
      const sourceChainId = await client.getChainId();

      if (sourceChainId !== ETHEREUM_MAINNET_CHAIN_ID) {
        throw new Error("RPC endpoint did not return Ethereum mainnet.");
      }

      const balanceResults = await Promise.allSettled(
        REP_TOKEN_LIST.map((tokenConfig) =>
          readBalance(client, tokenConfig, normalizedInput.address),
        ),
      );
      const balances = balanceResults.map((result, resultIndex) =>
        result.status === "fulfilled"
          ? result.value
          : failedRepTokenBalance(REP_TOKEN_LIST[resultIndex]),
      );

      if (balances.every((balance) => balance.readStatus === "error")) {
        throw new Error("RPC endpoint could not read supported REP tokens.");
      }

      const rpcSource = getEthereumRpcSourceInfo(endpoint);

      return {
        address: normalizedInput.address,
        balances,
        checkedAt,
        rpcInfo: {
          endpoint: endpoint.displaySource,
          fallbacksAttempted: index,
          latency: Date.now() - startedAt,
          sourceChainId: ETHEREUM_MAINNET_CHAIN_ID,
          sourceRpcHost: rpcSource.sourceRpcHost,
          sourceRpcId: rpcSource.sourceRpcId,
          sourceRpcLabel: rpcSource.sourceRpcLabel,
          sourceRpcPublic: rpcSource.sourceRpcPublic,
        },
        status: deriveStatusFromBalances(balances),
      };
    } catch {}
  }

  return rpcError(normalizedInput.address, checkedAt);
}
