import { useEffect, useState } from "react";
import { ExternalLinkWithWarning } from "@/components/ui/ExternalLinkWithWarning";
import {
  OFFICIAL_MIGRATION_GUIDE_URL,
  OFFICIAL_MIGRATION_PAGE_URL,
} from "@/domain/migration/migration.constants";
import { useMigrationProgress } from "@/features/migration/useMigrationProgress";
import { getCopy, getIntlLocale } from "@/i18n";
import type { SiteCopy } from "@/i18n/copy/types";
import type { Locale } from "@/i18n/locales";

type MigrationCardCopy = SiteCopy["migrationCard"];

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

function formatLocalDeadline(date: Date, intlLocale: string) {
  return new Intl.DateTimeFormat(intlLocale, {
    day: "numeric",
    hour: "2-digit",
    hourCycle: "h23",
    minute: "2-digit",
    month: "short",
    timeZoneName: "short",
    year: "numeric",
  }).format(date);
}

function formatUtcDeadline(date: Date, intlLocale: string) {
  return new Intl.DateTimeFormat(intlLocale, {
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

function formatTimelineDate(date: Date, intlLocale: string) {
  return new Intl.DateTimeFormat(intlLocale, {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  }).format(date);
}

function formatTimelineTime(date: Date, intlLocale: string) {
  return new Intl.DateTimeFormat(intlLocale, {
    hour: "2-digit",
    hourCycle: "h23",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  }).format(date);
}

function formatTimelineDateTime(date: Date, intlLocale: string) {
  return `${formatTimelineDate(date, intlLocale)}, ${formatTimelineTime(
    date,
    intlLocale,
  )}`;
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
  copy,
  intlLocale,
  nowMs,
  targetMs,
}: {
  copy: MigrationCardCopy;
  intlLocale: string;
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
      aria-label={copy.timelineAriaLabel({
        start: formatTimelineDateTime(startDate, intlLocale),
        end: formatTimelineDateTime(endDate, intlLocale),
        now: formatTimelineDateTime(nowDate, intlLocale),
      })}
      className="mt-4 overflow-hidden border border-primary/10 bg-background/70 p-3"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-lg uppercase leading-none text-muted-foreground">
            {copy.timelineTitle}
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
            {copy.now}
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
              {copy.start}
            </p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              {formatTimelineDate(startDate, intlLocale)}
            </p>
            <p className="mt-0.5 font-mono text-xs text-muted-foreground">
              {formatTimelineTime(startDate, intlLocale)}
            </p>
          </div>
          <div className="text-right">
            <p className="font-display text-lg uppercase leading-none text-red">
              {copy.deadline}
            </p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              {formatTimelineDate(endDate, intlLocale)}
            </p>
            <p className="mt-0.5 font-mono text-xs text-muted-foreground">
              {formatTimelineTime(endDate, intlLocale)}
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
  copy,
  localValue,
  utcValue,
}: {
  copy: MigrationCardCopy;
  localValue: string;
  utcValue: string;
}) {
  return (
    <div className="mt-4 flex flex-1 flex-col overflow-hidden border border-primary/10 bg-background/70">
      <div className="border-primary/10 border-b px-3 py-2">
        <p className="font-display text-lg uppercase leading-none text-muted-foreground">
          {copy.cutoffTime}
        </p>
      </div>
      <dl className="grid flex-1 divide-y divide-primary/10 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
        <DeadlineTimeValue label={copy.utcLabel} value={utcValue} />
        <DeadlineTimeValue label={copy.localLabel} value={localValue} />
      </dl>
    </div>
  );
}

type MigrationReadinessCardProps = {
  locale: Locale;
};

export function MigrationReadinessCard({
  locale,
}: MigrationReadinessCardProps) {
  const copy = getCopy(locale).migrationCard;
  const intlLocale = getIntlLocale(locale);
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
      ? copy.loadingDeadline
      : targetDate === null
        ? copy.deadlineUnavailableShort
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
    <aside aria-label={copy.ariaLabel} className="visual-card p-4 sm:p-5">
      <p className="font-display text-xl uppercase leading-none text-muted-foreground">
        &gt;_ {copy.eyebrow}
      </p>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.52fr)] lg:items-stretch">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-3">
            <p className="font-display text-lg uppercase leading-none text-muted-foreground">
              {copy.timeRemaining}
            </p>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-foreground/60">
              {copy.liveCountdown}
            </p>
          </div>

          <div className="mt-3" aria-live="off">
            <div
              aria-hidden="true"
              className="grid grid-cols-2 gap-2 sm:grid-cols-4"
            >
              <CountdownCell label={copy.units.days} value={countdown.days} />
              <CountdownCell label={copy.units.hours} value={countdown.hours} />
              <CountdownCell
                label={copy.units.minutes}
                value={countdown.minutes}
              />
              <CountdownCell
                label={copy.units.seconds}
                value={countdown.seconds}
              />
            </div>

            {targetDate ? (
              <p className="sr-only" suppressHydrationWarning>
                {copy.countdownSrText(countdown)}
              </p>
            ) : (
              <p className="sr-only">{deadlineStatus}</p>
            )}
          </div>

          {targetMs === null ? (
            <div className="mt-4 border border-primary/10 bg-background/70 p-3">
              <p className="font-display text-lg uppercase leading-none text-muted-foreground">
                {copy.timelineTitle}
              </p>
              <p className="mt-2 font-mono text-xs text-muted-foreground">
                {deadlineStatus}
              </p>
            </div>
          ) : (
            <MigrationTimelineFigure
              copy={copy}
              intlLocale={intlLocale}
              nowMs={nowMs}
              targetMs={targetMs}
            />
          )}

          <DeadlinePanel
            copy={copy}
            localValue={
              targetDate === null
                ? (deadlineStatus ?? copy.deadlineUnavailable)
                : formatLocalDeadline(targetDate, intlLocale)
            }
            utcValue={
              targetDate === null
                ? (deadlineStatus ?? copy.deadlineUnavailable)
                : formatUtcDeadline(targetDate, intlLocale)
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
                {copy.warningLabel}
              </p>
            </div>
            <p className="text-sm leading-6">{copy.warningBody}</p>
          </div>

          <div className="border border-primary/10 bg-background/70 p-3">
            <p className="font-display text-lg uppercase leading-none text-muted-foreground">
              {copy.nextActionLabel}
            </p>
            <p className="mt-2 text-sm leading-6 text-foreground/80">
              {copy.nextActionBody}
            </p>
          </div>

          <div className="grid gap-2">
            <a
              className="btn-terminal-secondary min-h-10 px-4 py-2"
              href="#check"
            >
              {copy.checkRepButton}
            </a>
            <ExternalLinkWithWarning
              className="btn-terminal-secondary min-h-10 px-4 py-2"
              href={OFFICIAL_MIGRATION_GUIDE_URL}
              locale={locale}
            >
              {copy.migrationInstructions}
            </ExternalLinkWithWarning>
            <ExternalLinkWithWarning
              className="btn-terminal-primary min-h-10 px-4 py-2"
              href={OFFICIAL_MIGRATION_PAGE_URL}
              locale={locale}
            >
              {copy.migrationWebsite}
            </ExternalLinkWithWarning>
          </div>
        </div>
      </div>
    </aside>
  );
}
