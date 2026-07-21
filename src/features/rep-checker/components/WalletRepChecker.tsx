import type { Locale } from "@/i18n/locales";
import { useWalletRepChecker } from "../hooks/use-wallet-rep-checker";
import { WalletRepCheckerForm } from "./WalletRepCheckerForm";
import { WalletRepCheckerTitle } from "./WalletRepCheckerTitle";
import { WalletRepResultCard } from "./WalletRepResultCard";
import { WalletRepScopeNotice } from "./WalletRepScopeNotice";

type WalletRepCheckerProps = {
  locale: Locale;
  showTitle?: boolean;
};

export function WalletRepChecker({
  locale,
  showTitle = true,
}: WalletRepCheckerProps) {
  const checker = useWalletRepChecker(locale);

  return (
    <section
      className="scroll-mt-6 border border-primary/10 bg-background/70 p-4"
      id="wallet-check"
    >
      <div className="w-full">
        {showTitle ? <WalletRepCheckerTitle locale={locale} /> : null}
        <WalletRepScopeNotice locale={locale} />
      </div>

      <WalletRepCheckerForm
        addressInput={checker.addressInput}
        fieldError={checker.fieldError}
        inputRef={checker.inputRef}
        isChecking={checker.isChecking}
        locale={locale}
        onAddressInputChange={checker.setAddressInput}
        onSubmit={checker.submit}
      />

      {checker.isChecking || checker.result ? (
        <div
          aria-busy={checker.isChecking}
          aria-live="polite"
          className="mt-5 space-y-4"
          ref={checker.resultContainerRef}
        >
          <WalletRepResultCard
            error={checker.error}
            locale={locale}
            onReset={checker.reset}
            result={checker.result}
            status={checker.status}
          />
        </div>
      ) : null}
    </section>
  );
}
