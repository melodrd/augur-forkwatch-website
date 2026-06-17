import { useWalletRepChecker } from "../hooks/use-wallet-rep-checker";
import { WalletRepCheckerForm } from "./WalletRepCheckerForm";
import { WalletRepCheckerTitle } from "./WalletRepCheckerTitle";
import { WalletRepResultCard } from "./WalletRepResultCard";
import { WalletRepScopeNotice } from "./WalletRepScopeNotice";

type WalletRepCheckerProps = {
  showTitle?: boolean;
};

export function WalletRepChecker({ showTitle = true }: WalletRepCheckerProps) {
  const checker = useWalletRepChecker();

  return (
    <section
      className="scroll-mt-6 border border-primary/10 bg-background/70 p-4"
      id="wallet-check"
    >
      <div className="w-full">
        {showTitle ? <WalletRepCheckerTitle /> : null}
        <WalletRepScopeNotice />
      </div>

      <WalletRepCheckerForm
        addressInput={checker.addressInput}
        fieldError={checker.fieldError}
        inputRef={checker.inputRef}
        isChecking={checker.isChecking}
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
            onReset={checker.reset}
            result={checker.result}
            status={checker.status}
          />
        </div>
      ) : null}
    </section>
  );
}
