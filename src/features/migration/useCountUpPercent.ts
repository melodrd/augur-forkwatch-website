import { useEffect, useState } from "react";

export const COUNT_UP_DURATION_MS = 1_600;
const COUNT_UP_BACKSTOP_MS = COUNT_UP_DURATION_MS + 400;
const SEEN_STORAGE_KEY = "forkwatch:headline-seen";

function easeOutCubic(progress: number): number {
  return 1 - (1 - progress) ** 3;
}

/**
 * Eased value of the count-up at `elapsedMs`. Clamped at both ends so a late or
 * out-of-order frame can never render a negative percentage or overshoot the
 * real figure.
 */
export function countUpValueAt(target: number, elapsedMs: number): number {
  const progress = Math.min(1, Math.max(0, elapsedMs / COUNT_UP_DURATION_MS));

  return target * easeOutCubic(progress);
}

// Once per session, and never against the user's motion preference. Reading
// and setting the flag together means a re-run with corrected live data snaps
// to the final value instead of replaying the count-up.
function shouldCountUp(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return false;
  }

  try {
    if (sessionStorage.getItem(SEEN_STORAGE_KEY)) {
      return false;
    }

    sessionStorage.setItem(SEEN_STORAGE_KEY, "true");
  } catch {
    // Private mode or blocked storage: play the reveal rather than suppress it.
  }

  return true;
}

/**
 * Counts up from zero to `target` once per session.
 *
 * The initial state is `target`, so the server-rendered headline already
 * carries the real figure for crawlers and for visitors whose JS never runs.
 * Every failure mode settles on `target` rather than on a partial value: the
 * headline states a real number, so a frozen count-up would be a wrong one.
 */
export function useCountUpPercent(target: number | null): number | null {
  const [value, setValue] = useState(target);

  useEffect(() => {
    if (target === null || !shouldCountUp()) {
      setValue(target);
      return;
    }

    let frame: number | null = null;
    let startedAt: number | null = null;

    // Taking the start time from the first frame, rather than setting zero up
    // front, keeps a throttled or never-firing rAF showing the real figure
    // instead of freezing at 0.00%.
    const step = (now: number) => {
      if (startedAt === null) {
        startedAt = now;
      }

      const elapsed = now - startedAt;

      setValue(countUpValueAt(target, elapsed));

      if (elapsed < COUNT_UP_DURATION_MS) {
        frame = requestAnimationFrame(step);
      }
    };

    frame = requestAnimationFrame(step);

    // If frames stop arriving partway through — backgrounded tab, throttling —
    // settle on the real figure instead of the last partial value painted.
    const backstop = window.setTimeout(() => {
      if (frame !== null) {
        cancelAnimationFrame(frame);
        frame = null;
      }

      setValue(target);
    }, COUNT_UP_BACKSTOP_MS);

    return () => {
      if (frame !== null) {
        cancelAnimationFrame(frame);
      }

      window.clearTimeout(backstop);
    };
  }, [target]);

  return value;
}
