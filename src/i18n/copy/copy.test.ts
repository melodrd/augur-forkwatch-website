import { describe, expect, it } from "vitest";
import { forkFaqCards } from "@/content/fork/fork-faq";
import { en } from "./en";
import { ko } from "./ko";

// Values that may legitimately be identical across locales: brand names,
// tickers, and units that are never translated.
const IDENTICAL_WHITELIST = new Set([
  "EN",
  "한국어",
  "UTC",
  "ForkWatch",
  "REP",
  // Child-universe names are proper nouns carried untranslated in both locales.
  "Yes",
  "No",
]);

// A single argument object that satisfies the object-shaped template-function
// signatures in the dictionary. Scalar helpers use the fallback candidates in
// `resolveLeaf` below.
const SAMPLE_ARG = {
  start: "START",
  end: "END",
  date: "DATE",
  endpoint: "ENDPOINT",
  outcome: "OUTCOME",
  percent: "PERCENT",
};

function resolveLeaf(value: unknown): string {
  if (typeof value === "function") {
    if (value.length >= 2) {
      const result = (value as (first: string, second: string) => unknown)(
        "26.78%",
        "REPv2_Yes_1",
      );

      if (typeof result === "string") {
        return result;
      }
    }

    for (const candidate of [SAMPLE_ARG, "sample", 1]) {
      try {
        const result = (value as (arg: unknown) => unknown)(candidate);
        if (typeof result === "string") {
          return result;
        }
      } catch {
        // Try the next candidate argument shape.
      }
    }

    throw new Error("Template function never returned a string.");
  }

  return String(value);
}

function collectLeaves(
  value: unknown,
  path: string,
  out: Map<string, string>,
): void {
  if (value === null || value === undefined) {
    return;
  }

  if (typeof value === "string" || typeof value === "function") {
    out.set(path, resolveLeaf(value));
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      collectLeaves(item, `${path}[${index}]`, out);
    });
    return;
  }

  if (typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      collectLeaves(child, path ? `${path}.${key}` : key, out);
    }
  }
}

describe("Korean copy dictionary", () => {
  const enLeaves = new Map<string, string>();
  const koLeaves = new Map<string, string>();
  collectLeaves(en, "", enLeaves);
  collectLeaves(ko, "", koLeaves);

  it("provides a Korean value for every English leaf", () => {
    const missing = [...enLeaves.keys()].filter((path) => !koLeaves.has(path));
    expect(missing).toEqual([]);
  });

  it("translates every non-whitelisted leaf away from English", () => {
    const untranslated: string[] = [];

    for (const [path, enValue] of enLeaves) {
      const koValue = koLeaves.get(path);

      if (koValue === undefined) {
        continue;
      }

      if (koValue === enValue && !IDENTICAL_WHITELIST.has(enValue)) {
        untranslated.push(`${path} = ${JSON.stringify(enValue)}`);
      }
    }

    expect(untranslated).toEqual([]);
  });

  it("leads the headline with the migrated share in both locales", () => {
    expect(en.overview.headline("59.50%")).toBe(
      "59.50% migrated to the Yes universe",
    );
    expect(ko.overview.headline("59.50%")).toBe(
      "59.50%가 Yes 유니버스로 이동했습니다",
    );
  });

  it("names the supply denominator next to the headline percentage", () => {
    for (const supplyNote of [
      en.overview.headlineSupplyNote,
      ko.overview.headlineSupplyNote,
    ]) {
      expect(supplyNote).toMatch(/11M|1,100만/);
    }
  });

  it("falls back to a static headline when the share is unknown", () => {
    for (const fallback of [
      en.overview.headlineFallback,
      ko.overview.headlineFallback,
    ]) {
      expect(fallback).not.toMatch(/%|NaN|null|undefined/);
    }
  });

  it("explains remaining REP gently without internal result jargon", () => {
    expect(en.overview.faq["how-urgent"].question).toBe(
      "I still hold REPv2. What now?",
    );
    expect(ko.overview.faq["how-urgent"].question).toBe(
      "아직 REPv2가 있다면 어떻게 하나요?",
    );

    const visibleCopy = [...enLeaves.values(), ...koLeaves.values()].join("\n");
    expect(visibleCopy).not.toMatch(
      /post-cutoff|winning universe|configured destination|snapshot confirmed|read pending|승리 유니버스|설정된 목적지|스냅샷 확인/i,
    );

    expect(forkFaqCards.find(({ id }) => id === "how-urgent")?.ctaHref).toBe(
      "#check",
    );
  });

  it("describes the two migrated supplies without implying an outcome", () => {
    expect(en.progressBar.ended.yesOutcomeLabel).toBe("Yes universe");
    expect(en.progressBar.ended.noOutcomeLabel).toBe("No universe");
    expect(ko.progressBar.ended.yesOutcomeLabel).toBe("Yes 유니버스");
    expect(ko.progressBar.ended.noOutcomeLabel).toBe("No 유니버스");

    const outcomeCopy = [
      en.progressBar.ended.outcomeSectionTitle,
      ko.progressBar.ended.outcomeSectionTitle,
      en.progressBar.ended.tokenSupplyLabel,
      ko.progressBar.ended.tokenSupplyLabel,
      en.progressBar.ended.dominantOutcomeNote({
        outcome: en.progressBar.ended.yesOutcomeLabel,
        percent: "99.97%",
      }),
      ko.progressBar.ended.dominantOutcomeNote({
        outcome: ko.progressBar.ended.yesOutcomeLabel,
        percent: "99.97%",
      }),
    ].join("\n");
    expect(outcomeCopy).not.toMatch(
      /winner|winning|confirmed|pending|승리|확정|대기/i,
    );
  });
});
