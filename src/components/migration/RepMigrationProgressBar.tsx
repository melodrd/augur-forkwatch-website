import { useMigrationProgress } from "@/features/migration/useMigrationProgress";
import { getCopy } from "@/i18n";
import type { SiteCopy } from "@/i18n/copy/types";
import type { Locale } from "@/i18n/locales";
import { formatDurationSince, formatTimestamp } from "@/lib/date-format";
import { formatNumber, formatPercent } from "@/lib/format";

type ProgressBarCopy = SiteCopy["progressBar"];

function formatRepAmount(
  value: string | null | undefined,
  copy: ProgressBarCopy,
  locale: Locale,
): string {
  if (!value) {
    return copy.progressUnavailable;
  }

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return copy.progressUnavailable;
  }

  return `${formatNumber(
    numericValue,
    { maximumFractionDigits: numericValue >= 1_000 ? 0 : 2 },
    locale,
  )} REP`;
}

function getStatusMessage(
  state: ReturnType<typeof useMigrationProgress>,
  copy: SiteCopy,
): string | null {
  const progressCopy = copy.progressBar;

  if (state.status === "loading") {
    return progressCopy.loadingStatus;
  }

  if (state.status === "unavailable") {
    return progressCopy.fileUnavailable;
  }

  const { progress } = state;

  if (progress.status === "error") {
    if (progress.lastSuccessAt && progress.migratedPercent !== null) {
      const duration = formatDurationSince(
        progress.lastSuccessAt,
        Date.now(),
        copy.duration,
      );
      return duration
        ? progressCopy.readFailedWithDuration(duration)
        : progressCopy.readFailed;
    }

    return progressCopy.ethReadUnavailable;
  }

  return null;
}

type RepMigrationProgressBarProps = {
  locale: Locale;
};

export function RepMigrationProgressBar({
  locale,
}: RepMigrationProgressBarProps) {
  const copy = getCopy(locale);
  const progressCopy = copy.progressBar;
  const state = useMigrationProgress();
  const progress = state.status === "ready" ? state.progress : null;
  const barPercent = progress?.migratedPercent ?? 0;
  const migratedLabel = formatRepAmount(
    progress?.migratedRep,
    progressCopy,
    locale,
  );
  const totalSupplyLabel = formatRepAmount(
    progress?.totalRep,
    progressCopy,
    locale,
  );
  const percentLabel =
    state.status === "loading"
      ? progressCopy.loading
      : progress?.migratedPercent === null ||
          progress?.migratedPercent === undefined
        ? progressCopy.progressUnavailable
        : formatPercent(progress.migratedPercent, {}, locale);
  const progressDescription =
    progress?.migratedPercent === null ||
    progress?.migratedPercent === undefined
      ? progressCopy.progressUnavailable
      : progressCopy.progressDescription(
          formatPercent(progress.migratedPercent, {}, locale),
        );
  const statusMessage = getStatusMessage(state, copy);
  const lastCheckedLabel =
    progress === null
      ? progressCopy.lastCheckedPending
      : progressCopy.lastChecked(formatTimestamp(progress.checkedAt, locale));

  return (
    <aside aria-label={progressCopy.ariaLabel} className="visual-card p-4">
      <div className="grid gap-4 lg:grid-cols-[minmax(12rem,18rem)_minmax(0,1fr)] lg:items-end">
        <div className="min-w-0">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between lg:flex-col">
            <p className="font-display text-xl uppercase leading-none text-muted-foreground">
              &gt;_ {progressCopy.eyebrow}
            </p>
            <div className="font-mono text-xs text-muted-foreground">
              <p>{lastCheckedLabel}</p>
            </div>
          </div>

          <p className="mt-3 break-words font-display text-5xl uppercase leading-none text-loud-foreground sm:text-6xl">
            {percentLabel}
          </p>
        </div>

        <div className="min-w-0">
          <div
            aria-label={progressDescription}
            aria-valuetext={progressDescription}
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={
              progress?.migratedPercent === null ||
              progress?.migratedPercent === undefined
                ? undefined
                : Number(progress.migratedPercent.toFixed(2))
            }
            className="relative h-7 overflow-hidden border border-primary/20 bg-background/80"
            role="progressbar"
          >
            <div
              className="relative z-0 h-full bg-primary shadow-[0_0_16px_color-mix(in_srgb,var(--primary)_50%,transparent)]"
              style={{ width: `${barPercent}%` }}
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-10 bg-[repeating-linear-gradient(135deg,color-mix(in_srgb,var(--primary)_14%,transparent)_0,color-mix(in_srgb,var(--primary)_14%,transparent)_1px,transparent_1px,transparent_9px)] opacity-70"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-2 z-20 flex items-center font-mono text-[0.68rem] uppercase leading-none text-muted-foreground/65"
            >
              {totalSupplyLabel}
            </span>
          </div>

          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <p className="font-display text-2xl uppercase leading-none text-primary">
              {migratedLabel}
            </p>
            {statusMessage ? (
              <p className="max-w-xl text-xs leading-5 text-muted-foreground sm:text-right">
                {statusMessage}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </aside>
  );
}
