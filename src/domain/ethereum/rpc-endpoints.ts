export type EthereumRpcEndpoint = {
  displaySource: string;
  id: string;
  isPublic: boolean;
  isSecret: boolean;
  label: string;
  privacyNote: string;
  priority: number;
  url: string;
};

export type EthereumRpcSourceInfo = {
  sourceRpcHost: string | null;
  sourceRpcId: string;
  sourceRpcLabel: string;
  sourceRpcPublic: boolean;
};

export const PUBLIC_ETHEREUM_RPC_ENDPOINTS = [
  {
    displaySource: "PublicNode",
    id: "publicnode",
    isPublic: true,
    isSecret: false,
    label: "PublicNode",
    privacyNote: "Public Ethereum RPC endpoint.",
    priority: 10,
    url: "https://ethereum-rpc.publicnode.com",
  },
  {
    displaySource: "dRPC",
    id: "drpc",
    isPublic: true,
    isSecret: false,
    label: "dRPC",
    privacyNote: "Public Ethereum RPC endpoint.",
    priority: 20,
    url: "https://eth.drpc.org",
  },
  {
    displaySource: "1RPC",
    id: "1rpc",
    isPublic: true,
    isSecret: false,
    label: "1RPC",
    privacyNote: "Public Ethereum RPC endpoint.",
    priority: 30,
    url: "https://1rpc.io/eth",
  },
] as const satisfies readonly EthereumRpcEndpoint[];

function normalizeRpcUrl(endpoint: string | null | undefined): string | null {
  const trimmed = endpoint?.trim();
  return trimmed ? trimmed : null;
}

function getRpcHost(endpoint: string): string | null {
  try {
    return new URL(endpoint).hostname || null;
  } catch {
    return null;
  }
}

function sanitizeConfiguredRpcLabel(label: string | null | undefined): string {
  const trimmed = label?.trim();

  if (!trimmed) {
    return "Configured Ethereum RPC";
  }

  return trimmed.replace(/https?:\/\/\S+/g, "Configured Ethereum RPC");
}

function buildConfiguredRpcEndpoint(
  url: string,
  label?: string,
): EthereumRpcEndpoint {
  const host = getRpcHost(url);
  const safeLabel = sanitizeConfiguredRpcLabel(label);

  return {
    displaySource: host ? `${safeLabel}: ${host}` : safeLabel,
    id: "configured",
    isPublic: false,
    isSecret: true,
    label: safeLabel,
    privacyNote:
      "Configured RPC URL is treated as secret; only its safe label and hostname may be displayed.",
    priority: 0,
    url,
  };
}

export function getEthereumRpcEndpoints(
  primaryRpcUrl?: string,
  primaryRpcLabel?: string,
): EthereumRpcEndpoint[] {
  const configured = normalizeRpcUrl(primaryRpcUrl);
  const endpoints = [
    ...(configured
      ? [buildConfiguredRpcEndpoint(configured, primaryRpcLabel)]
      : []),
    ...PUBLIC_ETHEREUM_RPC_ENDPOINTS,
  ];
  const seenUrls = new Set<string>();

  return endpoints.filter((endpoint) => {
    if (seenUrls.has(endpoint.url)) {
      return false;
    }

    seenUrls.add(endpoint.url);
    return true;
  });
}

export function getEthereumRpcEndpointLabel(
  endpoint: string | EthereumRpcEndpoint,
): string {
  if (typeof endpoint !== "string") {
    return endpoint.label;
  }

  const normalizedEndpoint = endpoint.trim();
  return (
    PUBLIC_ETHEREUM_RPC_ENDPOINTS.find(
      (publicEndpoint) => publicEndpoint.url === normalizedEndpoint,
    )?.label ?? "Configured Ethereum RPC"
  );
}

export function getEthereumRpcSourceInfo(
  endpoint: EthereumRpcEndpoint,
): EthereumRpcSourceInfo {
  return {
    sourceRpcHost: getRpcHost(endpoint.url),
    sourceRpcId: endpoint.id,
    sourceRpcLabel: endpoint.displaySource,
    sourceRpcPublic: endpoint.isPublic,
  };
}

export function getSafeRpcFailureLabel(endpoint: EthereumRpcEndpoint): string {
  return endpoint.displaySource;
}

export function sanitizeRpcErrorMessage(
  error: unknown,
  endpoints: readonly EthereumRpcEndpoint[] = [],
): string {
  const rawMessage =
    error instanceof Error && error.message.trim()
      ? error.message
      : String(error || "Could not read Ethereum mainnet.");

  let message = rawMessage;

  for (const endpoint of endpoints) {
    message = message.replaceAll(endpoint.url, endpoint.displaySource);
  }

  return message.replace(/https?:\/\/[^\s"'<>|)]+/g, (url) => {
    const host = getRpcHost(url);
    return host ? `Custom RPC: ${host}` : "Custom RPC";
  });
}
