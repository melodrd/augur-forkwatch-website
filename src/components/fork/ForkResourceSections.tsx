import { SectionHeader } from "@/components/ui/SectionHeader";
import { exchangeGroups } from "@/content/fork/exchange-support";
import { scamWarningCopy } from "@/content/fork/scam-warning";
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

export function ScamWarningSection() {
  return (
    <section
      aria-labelledby="scam-warning-title"
      className="scroll-mt-36 space-y-4"
      id="scam-warning"
    >
      <SectionHeader
        eyebrow="Security"
        id="scam-warning-title"
        title="Scam warning"
      />

      <div className="border border-amber/35 bg-amber/10 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <WarningIcon tone="amber" />
          <div>
            <p className="text-sm leading-6 text-loud-foreground">
              {scamWarningCopy}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ExchangeSupportSection() {
  return (
    <section
      aria-labelledby="exchange-support-title"
      className="scroll-mt-36 space-y-4"
      id="exchange-support"
    >
      <SectionHeader
        eyebrow="Exchange support"
        id="exchange-support-title"
        title="Fork support tracker"
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {exchangeGroups.map((group) => (
          <article
            className={`polished-card relative flex h-full flex-col border p-4 ${group.toneClassName}`}
            key={group.title}
          >
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-start justify-between gap-3 pr-10">
                <h3 className="font-display text-3xl uppercase leading-none text-foreground">
                  &gt;_ {group.title}
                </h3>
                <p className="inline-flex min-h-8 items-center border border-current bg-background/60 px-2.5 py-1.5 font-display text-lg uppercase leading-none">
                  {group.action}
                </p>
              </div>
              <ExchangeSupportDisclosure
                body={group.body}
                title={group.title}
              />
            </div>

            <div className="mt-5">
              <p className="font-display text-lg uppercase leading-none text-foreground/70">
                Tracked exchanges
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
                    {group.emptyLabel}
                  </p>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
