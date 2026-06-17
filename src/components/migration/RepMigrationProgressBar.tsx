import { calculateMigrationProgressFreshness } from "@/features/migration/migration-progress.helpers";
import { useMigrationProgress } from "@/features/migration/useMigrationProgress";
import { formatDurationSince, formatTimestamp } from "@/lib/date-format";
import { formatNumber, formatPercent } from "@/lib/format";

function formatRepAmount(value: string | null | undefined): string {
  if (!value) {
    return "Progress unavailable";
  }

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "Progress unavailable";
  }

  return `${formatNumber(numericValue, {
    maximumFractionDigits: numericValue >= 1_000 ? 0 : 2,
  })} REP`;
}

function getStatusMessage(
  state: ReturnType<typeof useMigrationProgress>,
): string | null {
  if (state.status === "loading") {
    return "Loading migration progress from the latest scheduled update.";
  }

  if (state.status === "unavailable") {
    return "Migration progress is temporarily unavailable. ForkWatch could not read the static migration progress file.";
  }

  const { progress } = state;

  if (progress.status === "error") {
    if (progress.lastSuccessAt && progress.migratedPercent !== null) {
      const duration = formatDurationSince(progress.lastSuccessAt);
      return duration
        ? `The latest scheduled Ethereum read failed. Showing the last successful read from ${duration} ago.`
        : "The latest scheduled Ethereum read failed. Showing the last successful read.";
    }

    return "Migration progress is temporarily unavailable. ForkWatch could not read Ethereum mainnet during the latest scheduled update.";
  }

  const freshness = calculateMigrationProgressFreshness(progress);

  if (freshness === "fresh") {
    return null;
  }

  const staleReference = progress.lastSuccessAt ?? progress.checkedAt;
  const duration = formatDurationSince(staleReference);

  if (!duration) {
    return "Migration progress may be stale.";
  }

  return `Migration progress may be stale. The last successful Ethereum read was ${duration} ago.`;
}

export function RepMigrationProgressBar() {
  const state = useMigrationProgress();
  const progress = state.status === "ready" ? state.progress : null;
  const barPercent = progress?.migratedPercent ?? 0;
  const migratedLabel = formatRepAmount(progress?.migratedRep);
  const totalSupplyLabel = formatRepAmount(progress?.totalRep);
  const percentLabel =
    state.status === "loading"
      ? "Loading..."
      : progress?.migratedPercent === null ||
          progress?.migratedPercent === undefined
        ? "Progress unavailable"
        : formatPercent(progress.migratedPercent);
  const progressDescription =
    progress?.migratedPercent === null ||
    progress?.migratedPercent === undefined
      ? "Progress unavailable"
      : `${formatPercent(progress.migratedPercent)} of total REP supply migrated`;
  const statusMessage = getStatusMessage(state);
  const lastCheckedLabel =
    progress === null
      ? "Last checked: Pending"
      : `Last checked: ${formatTimestamp(progress.checkedAt)}`;

  return (
    <aside aria-label="REP migrated" className="visual-card p-4">
      <div className="grid gap-4 lg:grid-cols-[minmax(12rem,18rem)_minmax(0,1fr)] lg:items-end">
        <div className="min-w-0">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between lg:flex-col">
            <p className="font-display text-xl uppercase leading-none text-muted-foreground">
              &gt;_ REP migrated
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
