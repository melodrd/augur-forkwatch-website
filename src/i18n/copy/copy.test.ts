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
]);

// A single argument object that satisfies the object-shaped template-function
// signatures in the dictionary. Scalar helpers use the fallback candidates in
// `resolveLeaf` below.
const SAMPLE_ARG = {
  start: "START",
  end: "END",
  date: "DATE",
  endpoint: "ENDPOINT",
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

  it("keeps natural previous and final headline states in both locales", () => {
    expect(
      `${en.overview.titlePrefix} ${en.overview.titlePreviousStatus}`,
    ).toBe("The Augur fork is happening");
    expect(`${en.overview.titlePrefix} ${en.overview.titleStatus}`).toBe(
      "The Augur fork happened",
    );
    expect(
      `${ko.overview.titlePrefix} ${ko.overview.titlePreviousStatus}`,
    ).toBe("오거 포크가 진행 중입니다");
    expect(`${ko.overview.titlePrefix} ${ko.overview.titleStatus}`).toBe(
      "오거 포크가 종료되었습니다",
    );
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
    expect(en.progressBar.ended.yesOutcomeLabel).toBe("Yes child universe");
    expect(en.progressBar.ended.noOutcomeLabel).toBe("No child universe");
    expect(ko.progressBar.ended.yesOutcomeLabel).toBe("Yes 자식 유니버스");
    expect(ko.progressBar.ended.noOutcomeLabel).toBe("No 자식 유니버스");
    expect(en.repChecker.migratedRepYesLabel).toBe("Migrated REP (Yes)");
    expect(en.repChecker.migratedRepNoLabel).toBe("Migrated REP (No)");
    expect(ko.repChecker.migratedRepYesLabel).toBe("마이그레이션된 REP (Yes)");
    expect(ko.repChecker.migratedRepNoLabel).toBe("마이그레이션된 REP (No)");

    const outcomeCopy = [
      en.progressBar.ended.outcomeSectionTitle,
      ko.progressBar.ended.outcomeSectionTitle,
      en.progressBar.ended.tokenSupplyLabel,
      ko.progressBar.ended.tokenSupplyLabel,
    ].join("\n");
    expect(outcomeCopy).not.toMatch(
      /winner|winning|confirmed|pending|승리|확정|대기/i,
    );
  });
});
