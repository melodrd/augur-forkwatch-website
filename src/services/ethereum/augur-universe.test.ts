import { describe, expect, it } from "vitest";
import { buildSingleOutcomePayoutHash } from "./augur-universe";

describe("buildSingleOutcomePayoutHash", () => {
  it("builds the expected hash for a binary market with outcome index 1", () => {
    expect(
      buildSingleOutcomePayoutHash({
        numTicks: 10_000n,
        outcomeCount: 2,
        outcomeIndex: 1,
      }),
    ).toBe(
      "0xc33259526adfbc0c04df6219e05970c7f955bc0fb67e2c629f754ee1ad634c35",
    );
  });

  it("rejects out-of-range outcome indexes", () => {
    expect(() =>
      buildSingleOutcomePayoutHash({
        numTicks: 10_000n,
        outcomeCount: 2,
        outcomeIndex: 2,
      }),
    ).toThrow("out of range");
  });
});
