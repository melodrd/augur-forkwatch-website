import {
  type Address,
  encodePacked,
  getAddress,
  type Hex,
  keccak256,
  type PublicClient,
  parseAbi,
} from "viem";

export const AUGUR_UNIVERSE_ABI = parseAbi([
  "function getChildUniverse(bytes32 parentPayoutDistributionHash) view returns (address)",
  "function getForkEndTime() view returns (uint256)",
  "function getReputationToken() view returns (address)",
  "function getWinningChildUniverse() view returns (address)",
]);

export const AUGUR_MARKET_ABI = parseAbi([
  "function getUniverse() view returns (address)",
  "function getNumberOfOutcomes() view returns (uint256)",
  "function getNumTicks() view returns (uint256)",
]);

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const MAX_UNIVERSE_DEPTH = 16;

export type AugurMigrationMarketState = {
  forkEndTime: bigint;
  migrationTokenAddress: Address;
  universeAddress: Address;
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error && error.message.trim()
    ? error.message
    : "Unknown Augur contract read error.";
}

function isZeroAddress(address: Address): boolean {
  return address.toLowerCase() === ZERO_ADDRESS;
}

export function buildSingleOutcomePayoutHash({
  numTicks,
  outcomeCount,
  outcomeIndex,
}: {
  numTicks: bigint;
  outcomeCount: number;
  outcomeIndex: number;
}): Hex {
  if (!Number.isInteger(outcomeCount) || outcomeCount <= 0) {
    throw new Error("Augur market has an invalid outcome count.");
  }

  if (
    !Number.isInteger(outcomeIndex) ||
    outcomeIndex < 0 ||
    outcomeIndex >= outcomeCount
  ) {
    throw new Error("Augur migration outcome index is out of range.");
  }

  const payoutNumerators = Array.from({ length: outcomeCount }, (_, index) =>
    index === outcomeIndex ? numTicks : 0n,
  );
  const payoutTypes = Array.from(
    { length: outcomeCount },
    () => "uint256" as const,
  );

  return keccak256(encodePacked(payoutTypes, payoutNumerators));
}

export async function readAugurMarketUniverse(
  client: PublicClient,
  marketAddress: Address,
): Promise<Address> {
  const universeAddress = await client.readContract({
    abi: AUGUR_MARKET_ABI,
    address: marketAddress,
    functionName: "getUniverse",
  });

  return getAddress(universeAddress);
}

async function readAugurMarketOutcomeCount(
  client: PublicClient,
  marketAddress: Address,
): Promise<number> {
  const outcomeCount = Number(
    await client.readContract({
      abi: AUGUR_MARKET_ABI,
      address: marketAddress,
      functionName: "getNumberOfOutcomes",
    }),
  );

  if (!Number.isInteger(outcomeCount) || outcomeCount <= 0) {
    throw new Error("Augur market has an invalid outcome count.");
  }

  return outcomeCount;
}

async function readAugurMarketNumTicks(
  client: PublicClient,
  marketAddress: Address,
): Promise<bigint> {
  const numTicks = await client.readContract({
    abi: AUGUR_MARKET_ABI,
    address: marketAddress,
    functionName: "getNumTicks",
  });

  if (numTicks <= 0n) {
    throw new Error("Augur market has an invalid tick count.");
  }

  return numTicks;
}

export async function readAugurUniverseForkEndTime(
  client: PublicClient,
  universeAddress: Address,
): Promise<bigint> {
  return client.readContract({
    abi: AUGUR_UNIVERSE_ABI,
    address: universeAddress,
    functionName: "getForkEndTime",
  });
}

async function readAugurUniverseChild(
  client: PublicClient,
  universeAddress: Address,
  payoutDistributionHash: Hex,
): Promise<Address> {
  const childUniverseAddress = await client.readContract({
    abi: AUGUR_UNIVERSE_ABI,
    address: universeAddress,
    args: [payoutDistributionHash],
    functionName: "getChildUniverse",
  });

  return getAddress(childUniverseAddress);
}

async function readAugurUniverseReputationToken(
  client: PublicClient,
  universeAddress: Address,
): Promise<Address> {
  const reputationTokenAddress = await client.readContract({
    abi: AUGUR_UNIVERSE_ABI,
    address: universeAddress,
    functionName: "getReputationToken",
  });

  return getAddress(reputationTokenAddress);
}

async function readAugurUniverseWinningChild(
  client: PublicClient,
  universeAddress: Address,
): Promise<Address> {
  return client.readContract({
    abi: AUGUR_UNIVERSE_ABI,
    address: universeAddress,
    functionName: "getWinningChildUniverse",
  });
}

async function readAugurMigrationMarketState(
  client: PublicClient,
  marketAddress: Address,
  outcomeIndex: number,
): Promise<AugurMigrationMarketState> {
  const universeAddress = await readAugurMarketUniverse(client, marketAddress);

  if (isZeroAddress(universeAddress)) {
    throw new Error("Augur market has no universe.");
  }

  const [forkEndTime, outcomeCount, numTicks] = await Promise.all([
    readAugurUniverseForkEndTime(client, universeAddress),
    readAugurMarketOutcomeCount(client, marketAddress),
    readAugurMarketNumTicks(client, marketAddress),
  ]);

  if (forkEndTime <= 0n) {
    throw new Error("Augur market universe has no fork end time.");
  }

  const payoutDistributionHash = buildSingleOutcomePayoutHash({
    numTicks,
    outcomeCount,
    outcomeIndex,
  });
  const childUniverseAddress = await readAugurUniverseChild(
    client,
    universeAddress,
    payoutDistributionHash,
  );

  if (isZeroAddress(childUniverseAddress)) {
    throw new Error("Augur migration child universe has not been created.");
  }

  const migrationTokenAddress = await readAugurUniverseReputationToken(
    client,
    childUniverseAddress,
  );

  if (isZeroAddress(migrationTokenAddress)) {
    throw new Error("Augur migration child universe has no REP token.");
  }

  return {
    forkEndTime,
    migrationTokenAddress,
    universeAddress,
  };
}

export async function readAugurMigrationMarketStateFromMarkets(
  client: PublicClient,
  marketAddresses: readonly Address[],
  outcomeIndex: number,
): Promise<AugurMigrationMarketState> {
  if (marketAddresses.length === 0) {
    throw new Error("No Augur fork markets were configured.");
  }

  const errors: string[] = [];

  for (const marketAddress of marketAddresses) {
    try {
      return await readAugurMigrationMarketState(
        client,
        marketAddress,
        outcomeIndex,
      );
    } catch (error) {
      errors.push(`${getAddress(marketAddress)}: ${getErrorMessage(error)}`);
    }
  }

  throw new Error(
    `Could not read Augur migration state from configured markets. ${errors.join(
      " | ",
    )}`,
  );
}

export async function readAugurForkEndTimeFromMarkets(
  client: PublicClient,
  marketAddresses: readonly Address[],
  outcomeIndex: number,
): Promise<bigint> {
  const state = await readAugurMigrationMarketStateFromMarkets(
    client,
    marketAddresses,
    outcomeIndex,
  );

  return state.forkEndTime;
}

export async function readAugurActiveUniverseForkEndTime(
  client: PublicClient,
  genesisUniverseAddress: Address,
): Promise<bigint> {
  let universeAddress = genesisUniverseAddress;
  const visited = new Set<string>();

  for (let depth = 0; depth < MAX_UNIVERSE_DEPTH; depth++) {
    const normalizedAddress = getAddress(universeAddress);

    if (visited.has(normalizedAddress)) {
      throw new Error("Augur universe chain contains a cycle.");
    }

    visited.add(normalizedAddress);

    const winningChild = await readAugurUniverseWinningChild(
      client,
      normalizedAddress,
    );

    if (winningChild === ZERO_ADDRESS) {
      const forkEndTime = await readAugurUniverseForkEndTime(
        client,
        normalizedAddress,
      );

      if (forkEndTime <= 0n) {
        throw new Error("Active Augur universe has no fork end time.");
      }

      return forkEndTime;
    }

    universeAddress = winningChild;
  }

  throw new Error("Augur universe chain exceeded maximum traversal depth.");
}
