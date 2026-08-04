import { getCopy } from "@/i18n";
import type { Locale } from "@/i18n/locales";
import { formatAddress } from "@/lib/format";
import type { RepBalanceCheckResult } from "../rep-checker.types";

export function WalletRepBalanceSummary({
  locale,
  result,
}: {
  locale: Locale;
  result: RepBalanceCheckResult;
}) {
  const repCheckerCopy = getCopy(locale).repChecker;
  const tokenReadError = repCheckerCopy.messages.tokenReadError;

  return (
    <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {result.balances.map((balance) => (
        <div
          className="border border-primary/10 bg-background/70 p-3"
          key={balance.tokenAddress}
        >
          <dt className="flex items-center justify-between gap-3">
            {/* normal-case: these are literal on-chain token symbols. */}
            <span className="font-display text-xl normal-case leading-none text-foreground">
              {balance.token}
            </span>
          </dt>
          <dd className="mt-3 font-mono text-sm text-loud-foreground">
            {balance.balance}
          </dd>
          {balance.readStatus === "error" ? (
            <dd className="mt-2 text-xs leading-5 text-amber">
              {balance.error ?? tokenReadError}
            </dd>
          ) : null}
          <dd
            className="mt-2 font-mono text-[0.68rem] text-muted-foreground"
            title={balance.tokenAddress}
          >
            {formatAddress(balance.tokenAddress)}
          </dd>
        </div>
      ))}
    </dl>
  );
}
