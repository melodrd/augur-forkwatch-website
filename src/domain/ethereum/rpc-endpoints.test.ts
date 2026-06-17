import { describe, expect, it } from "vitest";
import {
  getEthereumRpcEndpoints,
  getEthereumRpcSourceInfo,
  sanitizeRpcErrorMessage,
} from "./rpc-endpoints";

describe("Ethereum RPC endpoint metadata", () => {
  it("uses useful labels for public endpoints", () => {
    const [publicNode] = getEthereumRpcEndpoints();

    expect(getEthereumRpcSourceInfo(publicNode)).toMatchObject({
      sourceRpcHost: "ethereum-rpc.publicnode.com",
      sourceRpcId: "publicnode",
      sourceRpcLabel: "PublicNode",
      sourceRpcPublic: true,
    });
  });

  it("sanitizes configured RPC display metadata", () => {
    const [configured] = getEthereumRpcEndpoints(
      "https://eth-mainnet.g.alchemy.com/v2/secret-api-key",
      "Private Alchemy",
    );

    expect(configured.displaySource).toBe(
      "Private Alchemy: eth-mainnet.g.alchemy.com",
    );
    expect(configured.displaySource).not.toContain("secret-api-key");
    expect(getEthereumRpcSourceInfo(configured)).toMatchObject({
      sourceRpcHost: "eth-mainnet.g.alchemy.com",
      sourceRpcId: "configured",
      sourceRpcPublic: false,
    });
  });

  it("redacts raw URLs and credentials from error messages", () => {
    const endpoints = getEthereumRpcEndpoints(
      "https://user:pass@example.com/v2/secret",
      "Private RPC",
    );
    const message = sanitizeRpcErrorMessage(
      new Error("failed at https://user:pass@example.com/v2/secret"),
      endpoints,
    );

    expect(message).toContain("Private RPC: example.com");
    expect(message).not.toContain("user:pass");
    expect(message).not.toContain("secret");
  });
});
