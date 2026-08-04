import { ExternalLinkWithWarning } from "@/components/ui/ExternalLinkWithWarning";
import {
  AUGUR_PARENT_UNIVERSE_ADDRESS,
  REP_MIGRATION_NO_TOKEN_ADDRESS,
  REP_MIGRATION_NO_UNIVERSE_ADDRESS,
  REP_MIGRATION_YES_TOKEN_ADDRESS,
  REP_MIGRATION_YES_UNIVERSE_ADDRESS,
} from "@/features/migration/migration-progress.constants";
import { getDominantOutcomeShare } from "@/features/migration/migration-progress.helpers";
import type {
  MigrationOutcomeSnapshot,
  MigrationProgressLoadState,
} from "@/features/migration/migration-progress.types";
import { getCopy } from "@/i18n";
import type { SiteCopy } from "@/i18n/copy/types";
import type { Locale } from "@/i18n/locales";
import { formatTimestamp } from "@/lib/date-format";
import { formatAddress, formatNumber, formatPercent } from "@/lib/format";

type ProgressBarCopy = SiteCopy["progressBar"];
type EndedProgressCopy = ProgressBarCopy["ended"];
type OutcomeTone = "no" | "yes";

const TOKEN_SYMBOLS = {
  no: "REPv2_No_1",
  yes: "REPv2_Yes_1",
} as const;

function addressExplorerUrl(address: string): string {
  return `https://etherscan.io/address/${address}`;
}

function tokenExplorerUrl(address: string): string {
  return `https://etherscan.io/token/${address}`;
}

function formatTokenAmount(
  value: string | null | undefined,
  unit: string,
  unavailableLabel: string,
  locale: Locale,
): string {
  if (!value) {
    return unavailableLabel;
  }

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return unavailableLabel;
  }

  return `${formatNumber(
    numericValue,
    { maximumFractionDigits: 2 },
    locale,
  )} ${unit}`;
}

function getStatusMessage(
  state: MigrationProgressLoadState,
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
      return progressCopy.readFailed;
    }

    return progressCopy.ethReadUnavailable;
  }

  return null;
}

type ExplorerAddressLinkProps = {
  address: string;
  externalLabel: string;
  href: string;
  label: string;
  locale: Locale;
  tone: "accent" | "muted";
};

function ExplorerAddressLink({
  address,
  externalLabel,
  href,
  label,
  locale,
  tone,
}: ExplorerAddressLinkProps) {
  const toneClass =
    tone === "accent"
      ? "text-primary hover:text-loud-foreground"
      : "text-muted-foreground hover:text-loud-foreground";

  return (
    <ExternalLinkWithWarning
      aria-label={`${label}: ${address}. ${externalLabel}`}
      className={`group/link inline-flex min-w-0 items-center gap-2 transition ${toneClass}`}
      href={href}
      locale={locale}
      title={address}
    >
      <span className="font-mono text-xs sm:text-sm">
        {formatAddress(address)}
      </span>
      <span
        aria-hidden="true"
        className="shrink-0 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
      >
        ↗
      </span>
    </ExternalLinkWithWarning>
  );
}

type OutcomeCardProps = {
  childUniverseAddress: string;
  copy: EndedProgressCopy;
  locale: Locale;
  outcome: MigrationOutcomeSnapshot | null;
  tokenAddress: string;
  tone: OutcomeTone;
  unavailableLabel: string;
};

function OutcomeCard({
  childUniverseAddress,
  copy,
  locale,
  outcome,
  tokenAddress,
  tone,
  unavailableLabel,
}: OutcomeCardProps) {
  const isYes = tone === "yes";
  const outcomeLabel = isYes ? copy.yesOutcomeLabel : copy.noOutcomeLabel;
  const tokenSymbol = outcome?.token.symbol || TOKEN_SYMBOLS[tone];
  const resolvedTokenAddress = outcome?.token.address || tokenAddress;
  const resolvedUniverseAddress =
    outcome?.universeAddress || childUniverseAddress;
  const hasPercent =
    outcome?.supplyPercent !== null &&
    outcome?.supplyPercent !== undefined &&
    Number.isFinite(outcome.supplyPercent);
  const percentLabel = hasPercent
    ? formatPercent(outcome.supplyPercent, {}, locale)
    : null;
  const supplyLabel = formatTokenAmount(
    outcome?.supplyRep,
    "REP",
    unavailableLabel,
    locale,
  );

  return (
    <article className="relative overflow-hidden border border-primary/35 bg-primary/[0.045] p-4 sm:p-5">
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-1 bg-primary"
      />

      <div className="flex flex-wrap items-start justify-between gap-3 pl-1">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
            {outcomeLabel}
          </p>
          {/* normal-case: this is the literal on-chain token symbol. */}
          <h3 className="mt-2 break-all font-display text-2xl normal-case leading-none text-loud-foreground sm:text-3xl">
            {tokenSymbol}
          </h3>
        </div>
        <span className="border border-primary/45 bg-primary/10 px-2.5 py-1 font-mono text-xs uppercase tracking-[0.18em] text-loud-foreground">
          {copy.outcomeBadge[tone]}
        </span>
      </div>

      <div className="mt-5 border-t border-primary/20 pt-5">
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
          {copy.tokenSupplyLabel}
        </p>
        <p className="mt-2 break-words font-display text-4xl uppercase leading-[0.92] text-primary sm:text-5xl">
          {percentLabel ?? unavailableLabel}
        </p>
        <p
          className="mt-3 text-sm text-foreground/80"
          title={outcome?.supplyRep ? `${outcome.supplyRep} REP` : undefined}
        >
          {supplyLabel}
        </p>
      </div>

      <dl className="mt-5 space-y-3 border-t border-primary/20 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <dt className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
            {copy.tokenContractLabel}
          </dt>
          <dd>
            <ExplorerAddressLink
              address={resolvedTokenAddress}
              externalLabel={copy.etherscanLabel}
              href={tokenExplorerUrl(resolvedTokenAddress)}
              label={`${tokenSymbol} ${copy.tokenContractLabel}`}
              locale={locale}
              tone="accent"
            />
          </dd>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <dt className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
            {copy.childUniverseLabel}
          </dt>
          <dd>
            <ExplorerAddressLink
              address={resolvedUniverseAddress}
              externalLabel={copy.etherscanLabel}
              href={addressExplorerUrl(resolvedUniverseAddress)}
              label={`${outcomeLabel} ${copy.childUniverseLabel}`}
              locale={locale}
              tone="accent"
            />
          </dd>
        </div>
      </dl>
    </article>
  );
}

type RepMigrationProgressBarProps = {
  locale: Locale;
  state: MigrationProgressLoadState;
};

export function RepMigrationProgressBar({
  locale,
  state,
}: RepMigrationProgressBarProps) {
  const copy = getCopy(locale);
  const progressCopy = copy.progressBar;
  const endedCopy = progressCopy.ended;
  const progress = state.status === "ready" ? state.progress : null;
  const hasPercent =
    progress?.migratedPercent !== null &&
    progress?.migratedPercent !== undefined;
  const barPercent = hasPercent
    ? Math.min(100, Math.max(0, progress.migratedPercent ?? 0))
    : 0;
  const migratedLabel = formatTokenAmount(
    progress?.migratedRep,
    "REP",
    progressCopy.progressUnavailable,
    locale,
  );
  const hasMigratedAmount = migratedLabel !== progressCopy.progressUnavailable;
  const amountSizeClass = hasMigratedAmount
    ? "text-4xl sm:text-5xl"
    : "text-2xl sm:text-3xl";
  const percentSizeClass = hasPercent
    ? "text-4xl sm:text-5xl"
    : "text-2xl sm:text-3xl";
  const percentLabel =
    state.status === "loading"
      ? progressCopy.loading
      : !hasPercent
        ? progressCopy.progressUnavailable
        : formatPercent(progress.migratedPercent ?? 0, {}, locale);
  const progressDescription = hasPercent
    ? endedCopy.supplyDescription(percentLabel)
    : progressCopy.progressUnavailable;
  const statusMessage = getStatusMessage(state, copy);
  const dominantShare = progress
    ? getDominantOutcomeShare(progress.outcomes)
    : null;
  const dominantNote = dominantShare
    ? endedCopy.dominantOutcomeNote({
        outcome:
          dominantShare.key === "yes"
            ? endedCopy.yesOutcomeLabel
            : endedCopy.noOutcomeLabel,
        percent: formatPercent(dominantShare.percent, {}, locale),
      })
    : null;
  const sourceTimestamp = progress?.lastSuccessAt;
  const sourceLabel = sourceTimestamp
    ? endedCopy.sourceLabel(formatTimestamp(sourceTimestamp, locale))
    : progressCopy.lastCheckedPending;

  return (
    <aside
      aria-label={endedCopy.ariaLabel}
      className="visual-card scroll-mt-36 p-4 sm:p-5"
      id="result"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <p className="font-display text-xl uppercase leading-none text-muted-foreground">
          &gt;_ {endedCopy.eyebrow}
        </p>
        <div className="space-y-1 sm:text-right">
          <p className="font-mono text-[0.68rem] text-muted-foreground">
            {sourceLabel}
          </p>
          {progress?.blockNumber ? (
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted-foreground/75">
              {endedCopy.blockLabel(progress.blockNumber)}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-5 border border-primary/20 bg-primary/[0.035] p-4 lg:p-5">
        <div className="grid gap-5 sm:grid-cols-2 sm:items-end">
          <div className="min-w-0">
            <p className="font-display text-lg uppercase leading-none text-muted-foreground">
              {endedCopy.amountLabel}
            </p>
            <p
              className={`mt-3 break-words font-display uppercase leading-[0.9] text-primary ${amountSizeClass}`}
            >
              {migratedLabel}
            </p>
          </div>

          <div className="min-w-0 sm:text-right">
            <p className="font-display text-lg uppercase leading-none text-muted-foreground">
              {endedCopy.supplyTitle}
            </p>
            <p
              className={`mt-3 break-words font-display uppercase leading-[0.9] text-loud-foreground ${percentSizeClass}`}
            >
              {percentLabel}
            </p>
          </div>
        </div>

        <div
          aria-label={progressDescription}
          aria-valuetext={progressDescription}
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={hasPercent ? Number(barPercent.toFixed(2)) : undefined}
          className="relative mt-5 flex h-7 overflow-hidden border border-primary/20 bg-background/80"
          role="progressbar"
        >
          <span
            aria-hidden="true"
            className="h-full bg-primary shadow-[0_0_16px_color-mix(in_srgb,var(--primary)_50%,transparent)]"
            style={{ width: `${barPercent}%` }}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.08)_0,rgba(255,255,255,0.08)_1px,transparent_1px,transparent_9px)] opacity-70"
          />
        </div>

        <p className="mt-3 text-sm leading-6 text-foreground/80">
          {progressDescription}
        </p>
      </div>

      <section aria-label={endedCopy.outcomeSectionLabel} className="mt-7">
        <h2 className="font-display text-3xl uppercase leading-none text-loud-foreground sm:text-4xl">
          {endedCopy.outcomeSectionTitle}
        </h2>

        {dominantNote ? (
          <p className="mt-3 max-w-3xl text-sm leading-6 text-foreground/80">
            {dominantNote}
          </p>
        ) : null}

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <OutcomeCard
            childUniverseAddress={REP_MIGRATION_YES_UNIVERSE_ADDRESS}
            copy={endedCopy}
            locale={locale}
            outcome={progress?.outcomes.yes ?? null}
            tokenAddress={REP_MIGRATION_YES_TOKEN_ADDRESS}
            tone="yes"
            unavailableLabel={progressCopy.progressUnavailable}
          />
          <OutcomeCard
            childUniverseAddress={REP_MIGRATION_NO_UNIVERSE_ADDRESS}
            copy={endedCopy}
            locale={locale}
            outcome={progress?.outcomes.no ?? null}
            tokenAddress={REP_MIGRATION_NO_TOKEN_ADDRESS}
            tone="no"
            unavailableLabel={progressCopy.progressUnavailable}
          />
        </div>
      </section>

      <div className="mt-4 flex flex-col gap-2 border border-primary/10 bg-background/45 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
          {endedCopy.parentUniverseLabel}
        </p>
        <ExplorerAddressLink
          address={AUGUR_PARENT_UNIVERSE_ADDRESS}
          externalLabel={endedCopy.etherscanLabel}
          href={addressExplorerUrl(AUGUR_PARENT_UNIVERSE_ADDRESS)}
          label={endedCopy.parentUniverseLabel}
          locale={locale}
          tone="muted"
        />
      </div>

      {statusMessage ? (
        <p className="mt-3 text-xs leading-5 text-muted-foreground">
          {statusMessage}
        </p>
      ) : null}
    </aside>
  );
}
