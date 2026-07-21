import { getCopy } from "@/i18n";
import type { Locale } from "@/i18n/locales";

type WalletRepScopeNoticeProps = {
  locale: Locale;
};

export function WalletRepScopeNotice({ locale }: WalletRepScopeNoticeProps) {
  const { scopeCards } = getCopy(locale).repChecker;
  const cards = [scopeCards.whyItMatters, scopeCards.scope, scopeCards.warning];

  return (
    <div className="mt-3 grid gap-3 md:grid-cols-3">
      {cards.map((card) => (
        <div
          className="border border-primary/10 bg-background/70 px-3 py-2"
          key={card.title}
        >
          <p className="font-display text-lg uppercase leading-none text-muted-foreground">
            &gt;_ {card.title}
          </p>
          <p className="mt-2 text-sm leading-6 text-foreground/80">
            {card.body}
          </p>
        </div>
      ))}
    </div>
  );
}
