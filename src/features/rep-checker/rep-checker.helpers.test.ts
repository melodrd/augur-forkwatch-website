import { describe, expect, it } from "vitest";
import {
  deriveStatusFromBalances,
  formatRepBalance,
  normalizeAddressInput,
} from "./rep-checker.helpers";

describe("REP checker helpers", () => {
  it("normalizes valid Ethereum addresses to checksum form", () => {
    expect(
      normalizeAddressInput("0xcf6a0a7826fa124b7705d6f3c675ead76f1e540d"),
    ).toMatchObject({
      address: "0xCf6A0A7826fa124B7705d6f3c675eAD76f1e540D",
      ok: true,
    });
  });

  it("rejects invalid addresses", () => {
    expect(normalizeAddressInput("not-an-address")).toMatchObject({
      ok: false,
    });
  });

  it("formats REP balances without hiding small non-zero values", () => {
    expect(formatRepBalance("0.000000000000000001")).toBe(
      "0.000000000000000001 REP",
    );
    expect(formatRepBalance("1234.500000")).toBe("1,234.5 REP");
  });

  it("derives partial status when no REP is found but a token read failed", () => {
    expect(
      deriveStatusFromBalances([
        { hasBalance: false, readStatus: "loaded" },
        { hasBalance: false, readStatus: "error" },
      ]),
    ).toBe("partial");
  });
});
