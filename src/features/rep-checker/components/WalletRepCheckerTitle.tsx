import { getCopy } from "@/i18n";
import type { Locale } from "@/i18n/locales";

type WalletRepCheckerTitleProps = {
  locale: Locale;
};

export function WalletRepCheckerTitle({ locale }: WalletRepCheckerTitleProps) {
  return (
    <h2 className="font-display text-3xl uppercase leading-none text-foreground">
      {getCopy(locale).repChecker.balanceCheckTitle}
    </h2>
  );
}
