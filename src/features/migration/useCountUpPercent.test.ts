import { describe, expect, it } from "vitest";
import { COUNT_UP_DURATION_MS, countUpValueAt } from "./useCountUpPercent";

const TARGET = 59.5;

describe("countUpValueAt", () => {
  it("starts at zero and lands exactly on the target", () => {
    expect(countUpValueAt(TARGET, 0)).toBe(0);
    expect(countUpValueAt(TARGET, COUNT_UP_DURATION_MS)).toBe(TARGET);
  });

  it("rises monotonically without overshooting the target", () => {
    let previous = -1;

    for (let elapsed = 0; elapsed <= COUNT_UP_DURATION_MS; elapsed += 40) {
      const value = countUpValueAt(TARGET, elapsed);

      expect(value).toBeGreaterThanOrEqual(previous);
      expect(value).toBeLessThanOrEqual(TARGET);
      previous = value;
    }
  });

  it("eases out, so most of the count-up is done by the halfway point", () => {
    const halfway = countUpValueAt(TARGET, COUNT_UP_DURATION_MS / 2);

    expect(halfway).toBeGreaterThan(TARGET * 0.5);
    expect(halfway).toBeLessThan(TARGET);
  });

  it("clamps frames that arrive late or out of order", () => {
    expect(countUpValueAt(TARGET, COUNT_UP_DURATION_MS * 10)).toBe(TARGET);
    expect(countUpValueAt(TARGET, -500)).toBe(0);
  });

  it("handles a near-zero target without producing a negative value", () => {
    for (let elapsed = 0; elapsed <= COUNT_UP_DURATION_MS; elapsed += 200) {
      expect(countUpValueAt(0.02, elapsed)).toBeGreaterThanOrEqual(0);
    }

    expect(countUpValueAt(0.02, COUNT_UP_DURATION_MS)).toBe(0.02);
  });
});
