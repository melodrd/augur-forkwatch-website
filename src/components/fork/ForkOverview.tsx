import { MigrationReadinessCard } from "@/components/migration/MigrationReadinessCard";
import { RepMigrationProgressBar } from "@/components/migration/RepMigrationProgressBar";
import { ExternalLinkWithWarning } from "@/components/ui/ExternalLinkWithWarning";
import { type ForkFaqCardModel, forkFaqCards } from "@/content/fork/fork-faq";

function ForkFaqCard({
  answer,
  ctaHref,
  ctaLabel,
  question,
}: ForkFaqCardModel) {
  return (
    <article className="polished-card flex h-full flex-col p-4">
      <p className="font-display text-2xl uppercase leading-none text-foreground">
        &gt;_ {question}
      </p>
      <p className="mt-3 text-sm leading-6 text-foreground/80">{answer}</p>
      {ctaHref && ctaLabel ? (
        <ExternalLinkWithWarning
          className="menu-link mt-auto inline-flex items-center pt-4 font-display text-xl uppercase leading-none text-primary transition hover:text-loud-foreground"
          href={ctaHref}
        >
          {ctaLabel}
        </ExternalLinkWithWarning>
      ) : null}
    </article>
  );
}

export function ForkOverview() {
  return (
    <section
      aria-labelledby="overview-title"
      className="scroll-mt-36 space-y-5"
      id="overview"
    >
      <div>
        <p className="font-display text-xl uppercase leading-none text-muted-foreground">
          &gt;_ Fork status
        </p>
        <h1
          className="mt-2 whitespace-nowrap font-display text-3xl uppercase leading-none text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
          id="overview-title"
        >
          The Augur fork is happening
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-foreground/80">
          Track the migration timeline and REP migration progress as the fork
          window draws near.
        </p>
      </div>

      <div className="visual-surface p-3 sm:p-4">
        <div className="grid gap-4">
          <MigrationReadinessCard />
          <RepMigrationProgressBar />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {forkFaqCards.map((card) => (
          <ForkFaqCard key={card.question} {...card} />
        ))}
      </div>
    </section>
  );
}
