import { Wordmark } from "@/components/brand/Wordmark";
import { getCopy } from "@/i18n";
import type { Locale } from "@/i18n/locales";

type SiteFooterProps = {
  locale: Locale;
};

export function SiteFooter({ locale }: SiteFooterProps) {
  const copy = getCopy(locale).footer;

  return (
    <footer className="relative mx-auto mt-6 max-w-7xl px-4 pb-6 pt-1 sm:px-6 lg:px-8">
      <div className="visual-surface bg-background/80">
        <div className="grid gap-6 p-5 sm:p-6 md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.8fr)] md:items-start md:gap-8">
          <section
            aria-label={copy.summaryAriaLabel}
            className="flex flex-col items-start gap-4 text-left"
          >
            <Wordmark
              accentClassName="text-foreground/60"
              className="text-3xl sm:text-4xl opacity-70 transition hover:opacity-90"
              locale={locale}
            />
            <p className="max-w-xl text-sm leading-6 text-foreground/85">
              {copy.summary}
            </p>
          </section>

          <section
            aria-label={copy.noticeTitle}
            className="space-y-3 border-primary/10 border-t pt-5 md:border-t-0 md:border-l md:pt-0 md:pl-6"
          >
            <h2 className="font-display text-xl uppercase leading-none text-loud-foreground">
              {copy.noticeTitle}
            </h2>
            <div className="space-y-3 text-sm leading-6 text-foreground/80">
              <p>{copy.noticeBody}</p>
            </div>
          </section>
        </div>
      </div>
    </footer>
  );
}
