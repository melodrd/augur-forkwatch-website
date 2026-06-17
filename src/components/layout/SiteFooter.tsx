import { Wordmark } from "@/components/brand/Wordmark";

export function SiteFooter() {
  return (
    <footer className="relative mx-auto mt-6 max-w-7xl px-4 pb-6 pt-1 sm:px-6 lg:px-8">
      <div className="visual-surface bg-background/80">
        <div className="grid gap-6 p-5 sm:p-6 md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.8fr)] md:items-start md:gap-8">
          <section
            aria-label="ForkWatch summary"
            className="flex flex-col items-start gap-4 text-left"
          >
            <Wordmark
              accentClassName="text-foreground/60"
              className="text-3xl sm:text-4xl opacity-70 transition hover:opacity-90"
            />
            <p className="max-w-xl text-sm leading-6 text-foreground/85">
              Public REP holder safety, migration progress, and fork-status
              monitoring for the Augur reboot.
            </p>
          </section>

          <section
            aria-label="Footer notice"
            className="space-y-3 border-primary/10 border-t pt-5 md:border-t-0 md:border-l md:pt-0 md:pl-6"
          >
            <h2 className="font-display text-xl uppercase leading-none text-loud-foreground">
              Notice
            </h2>
            <div className="space-y-3 text-sm leading-6 text-foreground/80">
              <p>
                Educational use only. Not investment, trading, legal, tax, or
                financial advice.
              </p>
            </div>
          </section>
        </div>
      </div>
    </footer>
  );
}
