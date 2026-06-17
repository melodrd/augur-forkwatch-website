import { useEffect, useState } from "react";
import { ExternalLinkWithWarning } from "@/components/ui/ExternalLinkWithWarning";
import {
  OFFICIAL_MIGRATION_GUIDE_URL,
  OFFICIAL_MIGRATION_PAGE_URL,
} from "@/domain/migration/migration.constants";
import { useMigrationProgress } from "@/features/migration/useMigrationProgress";

type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const TIMELINE_WINDOW_SECONDS = 60 * 86_400;

function clampPercent(value: number): number {
  return Math.min(100, Math.max(0, value));
}

function getCountdownParts(nowMs: number, targetMs: number): CountdownParts {
  const totalSeconds = Math.max(0, Math.floor((targetMs - nowMs) / 1_000));
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}

function getTimelineTimestamps(
  nowMs: number,
  targetMs: number,
): {
  endUnix: number;
  progressPercent: number;
  startUnix: number;
} {
  const endUnix = Math.floor(targetMs / 1_000);
  const startUnix = endUnix - TIMELINE_WINDOW_SECONDS;
  const nowUnix = Math.floor(nowMs / 1_000);
  const progressPercent = clampPercent(
    ((nowUnix - startUnix) / TIMELINE_WINDOW_SECONDS) * 100,
  );

  return { endUnix, progressPercent, startUnix };
}

function formatLocalDeadline(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    hour: "2-digit",
    hourCycle: "h23",
    minute: "2-digit",
    month: "short",
    timeZoneName: "short",
    year: "numeric",
  }).format(date);
}

function formatUtcDeadline(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    hour: "2-digit",
    hourCycle: "h23",
    minute: "2-digit",
    month: "short",
    timeZone: "UTC",
    timeZoneName: "short",
    year: "numeric",
  }).format(date);
}

function formatTimelineDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  }).format(date);
}

function formatTimelineTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    hourCycle: "h23",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  }).format(date);
}

function formatTimelineDateTime(date: Date) {
  return `${formatTimelineDate(date)}, ${formatTimelineTime(date)}`;
}

function CountdownCell({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-primary/10 bg-background/70 px-2 py-3 text-center shadow-[inset_0_0_0_1px_rgba(22,163,74,0.04)]">
      <p
        className="font-display text-4xl uppercase leading-none text-loud-foreground sm:text-5xl"
        suppressHydrationWarning
      >
        {String(value).padStart(2, "0")}
      </p>
      <p className="mt-1 font-display text-base uppercase leading-none text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

function MigrationTimelineFigure({
  nowMs,
  targetMs,
}: {
  nowMs: number;
  targetMs: number;
}) {
  const { endUnix, progressPercent, startUnix } = getTimelineTimestamps(
    nowMs,
    targetMs,
  );
  const visualPercent = Number(progressPercent.toFixed(3));
  const markerPosition = `${visualPercent}%`;
  const markerLabelPosition = `clamp(1.25rem, ${markerPosition}, calc(100% - 1.25rem))`;
  const endDate = new Date(endUnix * 1_000);
  const nowDate = new Date(nowMs);
  const startDate = new Date(startUnix * 1_000);

  return (
    <figure
      aria-label={`Timeline from ${formatTimelineDateTime(startDate)} to ${formatTimelineDateTime(endDate)}. Current time is ${formatTimelineDateTime(nowDate)}.`}
      className="mt-4 overflow-hidden border border-primary/10 bg-background/70 p-3"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-lg uppercase leading-none text-muted-foreground">
            60-day timeline
          </p>
        </div>
      </div>

      <div className="mt-6 px-2 pb-2 pt-1">
        <div
          aria-hidden="true"
          className="relative h-12"
          suppressHydrationWarning
        >
          <div
            className="absolute top-0 -translate-x-1/2 font-display text-sm uppercase leading-none text-loud-foreground transition-[left] duration-700 ease-out"
            style={{ left: markerLabelPosition }}
          >
            Now
          </div>
          <div className="absolute left-0 right-0 top-8 h-px -translate-y-1/2 bg-primary/20" />
          <div
            className="absolute left-0 top-8 h-[3px] -translate-y-1/2 bg-primary shadow-[0_0_10px_color-mix(in_srgb,var(--primary)_42%,transparent)] transition-[width] duration-700 ease-out"
            style={{ width: markerPosition }}
          />
          <span className="absolute left-0 top-8 h-5 w-px -translate-y-1/2 bg-primary/80 shadow-[0_0_8px_color-mix(in_srgb,var(--primary)_34%,transparent)]" />
          <span className="absolute right-0 top-8 h-5 w-px -translate-y-1/2 bg-red/80 shadow-[0_0_8px_color-mix(in_srgb,var(--red)_34%,transparent)]" />
          <span
            className="absolute top-8 h-7 w-px -translate-x-1/2 -translate-y-1/2 bg-loud-foreground shadow-[0_0_10px_color-mix(in_srgb,var(--primary)_48%,transparent)] transition-[left] duration-700 ease-out motion-safe:animate-[pulse-glow-soft_2.4s_ease-in-out_infinite]"
            style={{ left: markerPosition }}
          />
        </div>

        <div className="mt-2 grid grid-cols-2 gap-3">
          <div>
            <p className="font-display text-lg uppercase leading-none text-primary">
              Start
            </p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              {formatTimelineDate(startDate)}
            </p>
            <p className="mt-0.5 font-mono text-xs text-muted-foreground">
              {formatTimelineTime(startDate)}
            </p>
          </div>
          <div className="text-right">
            <p className="font-display text-lg uppercase leading-none text-red">
              Deadline
            </p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              {formatTimelineDate(endDate)}
            </p>
            <p className="mt-0.5 font-mono text-xs text-muted-foreground">
              {formatTimelineTime(endDate)}
            </p>
          </div>
        </div>
      </div>
    </figure>
  );
}

function DeadlineTimeValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-h-24 px-3 py-4 sm:col-span-2 sm:px-4 sm:py-5">
      <dt className="font-display text-lg uppercase leading-none text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-2 font-mono text-base leading-6 text-loud-foreground">
        {value}
      </dd>
    </div>
  );
}

function DeadlinePanel({
  localValue,
  utcValue,
}: {
  localValue: string;
  utcValue: string;
}) {
  return (
    <div className="mt-4 flex flex-1 flex-col overflow-hidden border border-primary/10 bg-background/70">
      <div className="border-primary/10 border-b px-3 py-2">
        <p className="font-display text-lg uppercase leading-none text-muted-foreground">
          Cutoff time
        </p>
      </div>
      <dl className="grid flex-1 divide-y divide-primary/10 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
        <DeadlineTimeValue label="UTC" value={utcValue} />
        <DeadlineTimeValue label="Local" value={localValue} />
      </dl>
    </div>
  );
}

export function MigrationReadinessCard() {
  const state = useMigrationProgress();
  const [nowMs, setNowMs] = useState(() => Date.now());
  const forkEndTime =
    state.status === "ready" && state.progress.forkEndTime !== null
      ? state.progress.forkEndTime
      : null;
  const targetMs = forkEndTime === null ? null : forkEndTime * 1_000;
  const targetDate = targetMs === null ? null : new Date(targetMs);
  const countdown =
    targetMs === null
      ? { days: 0, hours: 0, minutes: 0, seconds: 0 }
      : getCountdownParts(nowMs, targetMs);
  const deadlineStatus =
    state.status === "loading"
      ? "Loading deadline from Ethereum mainnet"
      : targetDate === null
        ? "Deadline temporarily unavailable"
        : null;

  useEffect(() => {
    setNowMs(Date.now());

    const intervalId = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <aside aria-label="Migration countdown" className="visual-card p-4 sm:p-5">
      <p className="font-display text-xl uppercase leading-none text-muted-foreground">
        &gt;_ Migration deadline
      </p>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.52fr)] lg:items-stretch">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-3">
            <p className="font-display text-lg uppercase leading-none text-muted-foreground">
              Time remaining
            </p>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-foreground/60">
              Live countdown
            </p>
          </div>

          <div className="mt-3" aria-live="off">
            <div
              aria-hidden="true"
              className="grid grid-cols-2 gap-2 sm:grid-cols-4"
            >
              <CountdownCell label="Days" value={countdown.days} />
              <CountdownCell label="Hours" value={countdown.hours} />
              <CountdownCell label="Min" value={countdown.minutes} />
              <CountdownCell label="Sec" value={countdown.seconds} />
            </div>

            {targetDate ? (
              <p className="sr-only" suppressHydrationWarning>
                Time left to migrate REP: {countdown.days} days,{" "}
                {countdown.hours} hours, {countdown.minutes} minutes, and{" "}
                {countdown.seconds} seconds.
              </p>
            ) : (
              <p className="sr-only">{deadlineStatus}</p>
            )}
          </div>

          {targetMs === null ? (
            <div className="mt-4 border border-primary/10 bg-background/70 p-3">
              <p className="font-display text-lg uppercase leading-none text-muted-foreground">
                60-day timeline
              </p>
              <p className="mt-2 font-mono text-xs text-muted-foreground">
                {deadlineStatus}
              </p>
            </div>
          ) : (
            <MigrationTimelineFigure nowMs={nowMs} targetMs={targetMs} />
          )}

          <DeadlinePanel
            localValue={
              targetDate === null
                ? (deadlineStatus ?? "Deadline unavailable")
                : formatLocalDeadline(targetDate)
            }
            utcValue={
              targetDate === null
                ? (deadlineStatus ?? "Deadline unavailable")
                : formatUtcDeadline(targetDate)
            }
          />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 border border-red/45 bg-red/10 p-4 text-red">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="inline-flex size-8 shrink-0 items-center justify-center border border-red/45 bg-background/80 font-display text-2xl uppercase leading-none"
              >
                !
              </span>
              <p className="font-display text-2xl uppercase leading-none">
                Priority warning
              </p>
            </div>
            <p className="text-sm leading-6">
              If you fail to migrate your REP before the deadline, your REP will
              be deemed worthless.
            </p>
          </div>

          <div className="border border-primary/10 bg-background/70 p-3">
            <p className="font-display text-lg uppercase leading-none text-muted-foreground">
              Next action
            </p>
            <p className="mt-2 text-sm leading-6 text-foreground/80">
              Check whether your wallet holds REPv1 or REPv2 first, then read
              the migration instructions and migrate before the timer reaches
              zero. After migration, confirm that your address holds the
              intended destination REP token.
            </p>
          </div>

          <div className="grid gap-2">
            <a
              className="btn-terminal-primary min-h-10 px-4 py-2"
              href="#check"
            >
              CHECK REP
            </a>
            <ExternalLinkWithWarning
              className="btn-terminal-secondary min-h-10 px-4 py-2"
              href={OFFICIAL_MIGRATION_GUIDE_URL}
            >
              Read migration instructions
            </ExternalLinkWithWarning>
            <ExternalLinkWithWarning
              className="btn-terminal-secondary min-h-10 px-4 py-2"
              href={OFFICIAL_MIGRATION_PAGE_URL}
            >
              Migration website
            </ExternalLinkWithWarning>
          </div>
        </div>
      </div>
    </aside>
  );
}
