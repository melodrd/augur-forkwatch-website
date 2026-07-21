import { describe, expect, it } from "vitest";
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

// A single argument object that satisfies every template-function signature in
// the dictionary (countdown parts, timeline range, checked-through args, and the
// single-string/number helpers via [object Object] / NaN fallbacks).
const SAMPLE_ARG = {
  days: 1,
  hours: 2,
  minutes: 3,
  seconds: 4,
  start: "START",
  end: "END",
  now: "NOW",
  date: "DATE",
  endpoint: "ENDPOINT",
};

function resolveLeaf(value: unknown): string {
  if (typeof value === "function") {
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
});
