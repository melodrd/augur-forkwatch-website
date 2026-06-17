import { type Address, type PublicClient, parseAbi } from "viem";

export const ERC20_ABI = parseAbi([
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
]);

export async function readErc20Decimals(
  client: PublicClient,
  tokenAddress: Address,
  fallback = 18,
): Promise<number> {
  try {
    const decimals = Number(
      await client.readContract({
        abi: ERC20_ABI,
        address: tokenAddress,
        functionName: "decimals",
      }),
    );

    if (Number.isInteger(decimals) && decimals >= 0) {
      return decimals;
    }
  } catch {
    return fallback;
  }

  return fallback;
}

export async function readErc20Symbol(
  client: PublicClient,
  tokenAddress: Address,
): Promise<string | null> {
  try {
    const symbol = String(
      await client.readContract({
        abi: ERC20_ABI,
        address: tokenAddress,
        functionName: "symbol",
      }),
    ).trim();

    return symbol.length > 0 ? symbol : null;
  } catch {
    return null;
  }
}

export async function readErc20TotalSupply(
  client: PublicClient,
  tokenAddress: Address,
): Promise<bigint> {
  return client.readContract({
    abi: ERC20_ABI,
    address: tokenAddress,
    functionName: "totalSupply",
  });
}

export async function readErc20BalanceOf(
  client: PublicClient,
  tokenAddress: Address,
  ownerAddress: Address,
): Promise<bigint> {
  return client.readContract({
    abi: ERC20_ABI,
    address: tokenAddress,
    args: [ownerAddress],
    functionName: "balanceOf",
  });
}
