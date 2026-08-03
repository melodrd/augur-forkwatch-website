import { ExternalLinkWithWarning } from "@/components/ui/ExternalLinkWithWarning";
import { OFFICIAL_MIGRATION_GUIDE_URL } from "@/domain/migration/migration.constants";
import { AUGUR_FORK_END_TIME_FALLBACK_UNIX_SECONDS } from "@/features/migration/migration-progress.constants";
import { getCopy, getIntlLocale } from "@/i18n";
import type { SiteCopy } from "@/i18n/copy/types";
import type { Locale } from "@/i18n/locales";

type MigrationCardCopy = SiteCopy["migrationCard"];

const TIMELINE_WINDOW_SECONDS = 60 * 86_400;

function formatLocalDeadline(date: Date, intlLocale: string) {
  return new Intl.DateTimeFormat(intlLocale, {
    day: "numeric",
    hour: "2-digit",
    hourCycle: "h23",
    minute: "2-digit",
    month: "short",
    second: "2-digit",
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
    second: "2-digit",
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
    second: "2-digit",
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

function MigrationTimelineFigure({
  copy,
  intlLocale,
  targetMs,
}: {
  copy: MigrationCardCopy;
  intlLocale: string;
  targetMs: number;
}) {
  const endDate = new Date(targetMs);
  const startDate = new Date(targetMs - TIMELINE_WINDOW_SECONDS * 1_000);
  const endedCopy = copy.ended;
  const timelineAriaLabel = endedCopy.timelineAriaLabel({
    end: formatTimelineDateTime(endDate, intlLocale),
    start: formatTimelineDateTime(startDate, intlLocale),
  });

  return (
    <figure className="mt-4 overflow-hidden border border-primary/10 bg-background/70 p-3">
      <figcaption className="font-display text-lg uppercase leading-none text-muted-foreground">
        <span aria-hidden="true">{endedCopy.timelineTitle}</span>
        <span className="sr-only">{timelineAriaLabel}</span>
      </figcaption>

      <div className="mt-6 px-2 pb-2 pt-1">
        <div aria-hidden="true" className="relative h-12">
          <div className="absolute right-0 top-0 font-display text-sm uppercase leading-none text-loud-foreground">
            {endedCopy.timelineMarker}
          </div>
          <div className="absolute left-0 right-0 top-8 h-[3px] -translate-y-1/2 bg-primary shadow-[0_0_10px_color-mix(in_srgb,var(--primary)_42%,transparent)]" />
          <span className="absolute left-0 top-8 h-5 w-px -translate-y-1/2 bg-primary/80 shadow-[0_0_8px_color-mix(in_srgb,var(--primary)_34%,transparent)]" />
          <span className="absolute right-0 top-8 h-7 w-px -translate-y-1/2 bg-red shadow-[0_0_10px_color-mix(in_srgb,var(--red)_48%,transparent)]" />
        </div>

        <div className="mt-2 grid grid-cols-2 gap-3">
          <div>
            <p className="font-display text-lg uppercase leading-none text-primary">
              {copy.start}
            </p>
            <time
              className="mt-1 block font-mono text-xs text-muted-foreground"
              dateTime={startDate.toISOString()}
            >
              {formatTimelineDate(startDate, intlLocale)}
            </time>
            <time
              className="mt-0.5 block font-mono text-xs text-muted-foreground"
              dateTime={startDate.toISOString()}
            >
              {formatTimelineTime(startDate, intlLocale)}
            </time>
          </div>
          <div className="text-right">
            <p className="font-display text-lg uppercase leading-none text-red">
              {copy.deadline}
            </p>
            <time
              className="mt-1 block font-mono text-xs text-muted-foreground"
              dateTime={endDate.toISOString()}
            >
              {formatTimelineDate(endDate, intlLocale)}
            </time>
            <time
              className="mt-0.5 block font-mono text-xs text-muted-foreground"
              dateTime={endDate.toISOString()}
            >
              {formatTimelineTime(endDate, intlLocale)}
            </time>
          </div>
        </div>
      </div>
    </figure>
  );
}

function DeadlineTimeValue({
  dateTime,
  label,
  value,
}: {
  dateTime: string | null;
  label: string;
  value: string;
}) {
  return (
    <div className="min-h-24 px-3 py-4 sm:col-span-2 sm:px-4 sm:py-5">
      <dt className="font-display text-lg uppercase leading-none text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-2 font-mono text-base leading-6 text-loud-foreground">
        {dateTime ? <time dateTime={dateTime}>{value}</time> : value}
      </dd>
    </div>
  );
}

function DeadlinePanel({
  copy,
  dateTime,
  localValue,
  utcValue,
}: {
  copy: MigrationCardCopy;
  dateTime: string | null;
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
        <DeadlineTimeValue
          dateTime={dateTime}
          label={copy.utcLabel}
          value={utcValue}
        />
        <DeadlineTimeValue
          dateTime={dateTime}
          label={copy.localLabel}
          value={localValue}
        />
      </dl>
    </div>
  );
}

function ClosedStatusPanel({
  copy,
  targetDate,
  utcDeadline,
}: {
  copy: MigrationCardCopy;
  targetDate: Date;
  utcDeadline: string;
}) {
  const endedCopy = copy.ended;

  return (
    <div className="border border-primary/20 bg-primary/[0.04] p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="inline-flex min-h-7 items-center border border-primary/45 bg-primary/10 px-2 py-1 font-display text-base uppercase leading-none text-primary">
          {endedCopy.badge}
        </p>
        <time
          className="font-mono text-xs text-muted-foreground"
          dateTime={targetDate.toISOString()}
        >
          {utcDeadline}
        </time>
      </div>
      <p className="mt-4 font-display text-4xl uppercase leading-none text-loud-foreground sm:text-5xl">
        {endedCopy.title}
      </p>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-foreground/80">
        {endedCopy.body}
      </p>
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
  const endedCopy = copy.ended;
  const intlLocale = getIntlLocale(locale);
  const forkEndTime = AUGUR_FORK_END_TIME_FALLBACK_UNIX_SECONDS;
  const targetMs = forkEndTime * 1_000;
  const targetDate = new Date(targetMs);
  const dateTime = targetDate.toISOString();
  const utcDeadline = formatUtcDeadline(targetDate, intlLocale);
  const localDeadline = formatLocalDeadline(targetDate, intlLocale);

  return (
    <aside aria-label={endedCopy.ariaLabel} className="visual-card p-4 sm:p-5">
      <p className="font-display text-xl uppercase leading-none text-muted-foreground">
        &gt;_ {endedCopy.eyebrow}
      </p>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.52fr)] lg:items-stretch">
        <div className="flex h-full flex-col">
          <ClosedStatusPanel
            copy={copy}
            targetDate={targetDate}
            utcDeadline={utcDeadline}
          />

          <MigrationTimelineFigure
            copy={copy}
            intlLocale={intlLocale}
            targetMs={targetMs}
          />

          <DeadlinePanel
            copy={copy}
            dateTime={dateTime}
            localValue={localDeadline}
            utcValue={utcDeadline}
          />
        </div>

        <div className="flex flex-col gap-3">
          <div className="border border-primary/20 bg-primary/[0.04] p-4">
            <p className="font-display text-xl uppercase leading-none text-primary">
              {endedCopy.nextActionLabel}
            </p>
            <p className="mt-3 text-sm leading-6 text-foreground/80">
              {endedCopy.nextActionBody}
            </p>
          </div>

          <div className="flex flex-col gap-3 border border-amber/25 bg-amber/[0.04] p-4">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="inline-flex size-7 shrink-0 items-center justify-center border border-amber/35 bg-background/80 font-display text-xl uppercase leading-none text-amber"
              >
                !
              </span>
              <p className="font-display text-xl uppercase leading-none text-loud-foreground">
                {endedCopy.warningLabel}
              </p>
            </div>
            <p className="text-sm leading-6 text-foreground/80">
              {endedCopy.warningBody}
            </p>
          </div>

          <div className="grid gap-2">
            <a
              className="btn-terminal-primary min-h-10 px-4 py-2"
              href="#check"
            >
              {endedCopy.checkRepButton}
            </a>
            <ExternalLinkWithWarning
              className="btn-terminal-secondary min-h-10 px-4 py-2"
              href={OFFICIAL_MIGRATION_GUIDE_URL}
              locale={locale}
            >
              {endedCopy.migrationInstructions}
            </ExternalLinkWithWarning>
          </div>
        </div>
      </div>
    </aside>
  );
}
