import { REP_CHECKER_SCOPE_CARDS } from "../rep-checker.copy";

export function WalletRepScopeNotice() {
  return (
    <div className="mt-3 grid gap-3 md:grid-cols-3">
      {REP_CHECKER_SCOPE_CARDS.map((card) => (
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
