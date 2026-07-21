import { SectionHeader } from "@/components/ui/SectionHeader";
import { exchangeGroups } from "@/content/fork/exchange-support";
import { getCopy } from "@/i18n";
import type { SiteCopy } from "@/i18n/copy/types";
import type { Locale } from "@/i18n/locales";
import { ExchangeSupportDisclosure } from "./ExchangeSupportDisclosure";

function WarningIcon({ tone }: { tone: "amber" | "red" }) {
  const toneClassName =
    tone === "amber" ? "border-amber/45 text-amber" : "border-red/45 text-red";

  return (
    <span
      aria-hidden="true"
      className={`inline-flex size-8 shrink-0 items-center justify-center border bg-background/80 font-display text-2xl uppercase leading-none ${toneClassName}`}
    >
      !
    </span>
  );
}

type SectionProps = {
  locale: Locale;
};

export function ScamWarningSection({ locale }: SectionProps) {
  const copy = getCopy(locale).scamWarning;

  return (
    <section
      aria-labelledby="scam-warning-title"
      className="scroll-mt-36 space-y-4"
      id="scam-warning"
    >
      <SectionHeader
        eyebrow={copy.eyebrow}
        id="scam-warning-title"
        title={copy.title}
      />

      <div className="border border-amber/35 bg-amber/10 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <WarningIcon tone="amber" />
          <div>
            <p className="text-sm leading-6 text-loud-foreground">
              {copy.body}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function UpbitNotice({
  notice,
}: {
  notice: NonNullable<SiteCopy["exchangeSupport"]["upbitNotice"]>;
}) {
  return (
    <div className="flex flex-col gap-3 border border-red/45 bg-red/10 p-4 text-red sm:flex-row sm:items-start">
      <WarningIcon tone="red" />
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="font-display text-2xl uppercase leading-none">
            &gt;_ {notice.title}
          </h3>
          <span className="inline-flex min-h-7 items-center border border-current bg-background/60 px-2 py-1 font-display text-base uppercase leading-none">
            {notice.badge}
          </span>
        </div>
        <p className="text-sm leading-6 text-loud-foreground">{notice.body}</p>
      </div>
    </div>
  );
}

export function ExchangeSupportSection({ locale }: SectionProps) {
  const copy = getCopy(locale).exchangeSupport;

  return (
    <section
      aria-labelledby="exchange-support-title"
      className="scroll-mt-36 space-y-4"
      id="exchange-support"
    >
      <SectionHeader
        eyebrow={copy.eyebrow}
        id="exchange-support-title"
        title={copy.title}
      />

      {copy.upbitNotice ? <UpbitNotice notice={copy.upbitNotice} /> : null}

      <div className="grid gap-4 lg:grid-cols-3">
        {exchangeGroups.map((group) => {
          const groupCopy = copy.groups[group.id];

          return (
            <article
              className={`polished-card relative flex h-full flex-col border p-4 ${group.toneClassName}`}
              key={group.id}
            >
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-start justify-between gap-3 pr-10">
                  <h3 className="font-display text-3xl uppercase leading-none text-foreground">
                    &gt;_ {groupCopy.title}
                  </h3>
                  <p className="inline-flex min-h-8 items-center border border-current bg-background/60 px-2.5 py-1.5 font-display text-lg uppercase leading-none">
                    {groupCopy.action}
                  </p>
                </div>
                <ExchangeSupportDisclosure
                  body={groupCopy.body}
                  locale={locale}
                  title={groupCopy.title}
                />
              </div>

              <div className="mt-auto pt-5">
                <p className="font-display text-lg uppercase leading-none text-foreground/70">
                  {copy.trackedExchanges}
                </p>
                <div
                  className={
                    group.exchanges.length
                      ? "mt-2 grid grid-cols-2 gap-2 xl:grid-cols-3"
                      : "mt-2 grid gap-2"
                  }
                >
                  {group.exchanges.length ? (
                    group.exchanges.map((exchange) => (
                      <p
                        className="flex min-h-10 items-center justify-center border border-primary/10 bg-background/70 px-2 py-2 text-center font-display text-xl uppercase leading-none text-loud-foreground"
                        key={exchange}
                      >
                        {exchange}
                      </p>
                    ))
                  ) : (
                    <p className="border border-current/20 bg-background/50 px-3 py-3 text-sm leading-6 text-foreground/70">
                      {groupCopy.emptyLabel}
                    </p>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
