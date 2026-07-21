import { MigrationReadinessCard } from "@/components/migration/MigrationReadinessCard";
import { RepMigrationProgressBar } from "@/components/migration/RepMigrationProgressBar";
import { ExternalLinkWithWarning } from "@/components/ui/ExternalLinkWithWarning";
import { forkFaqCards } from "@/content/fork/fork-faq";
import { getCopy } from "@/i18n";
import type { Locale } from "@/i18n/locales";

type ForkFaqCardProps = {
  answer: string;
  ctaHref: string;
  ctaLabel: string;
  locale: Locale;
  question: string;
};

function ForkFaqCard({
  answer,
  ctaHref,
  ctaLabel,
  locale,
  question,
}: ForkFaqCardProps) {
  return (
    <article className="polished-card flex h-full flex-col p-4">
      <p className="font-display text-2xl uppercase leading-none text-foreground">
        &gt;_ {question}
      </p>
      <p className="mt-3 text-sm leading-6 text-foreground/80">{answer}</p>
      <ExternalLinkWithWarning
        className="menu-link mt-auto inline-flex items-center pt-4 font-display text-xl uppercase leading-none text-primary transition hover:text-loud-foreground"
        href={ctaHref}
        locale={locale}
      >
        {ctaLabel}
      </ExternalLinkWithWarning>
    </article>
  );
}

type ForkOverviewProps = {
  locale: Locale;
};

export function ForkOverview({ locale }: ForkOverviewProps) {
  const copy = getCopy(locale).overview;

  return (
    <section
      aria-labelledby="overview-title"
      className="scroll-mt-36 space-y-5"
      id="overview"
    >
      <div>
        <p className="font-display text-xl uppercase leading-none text-muted-foreground">
          &gt;_ {copy.eyebrow}
        </p>
        <h1
          className="mt-2 font-display text-3xl uppercase leading-none text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
          id="overview-title"
        >
          {copy.title}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-foreground/80">
          {copy.subtitle}
        </p>
      </div>

      <div className="visual-surface p-3 sm:p-4">
        <div className="grid gap-4">
          <MigrationReadinessCard locale={locale} />
          <RepMigrationProgressBar locale={locale} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {forkFaqCards.map((card) => {
          const faq = copy.faq[card.id];

          return (
            <ForkFaqCard
              answer={faq.answer}
              ctaHref={card.ctaHref}
              ctaLabel={faq.ctaLabel}
              key={card.id}
              locale={locale}
              question={faq.question}
            />
          );
        })}
      </div>
    </section>
  );
}
