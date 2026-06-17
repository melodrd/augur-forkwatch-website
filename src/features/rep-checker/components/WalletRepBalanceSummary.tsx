import { formatAddress } from "@/lib/format";
import type { RepBalanceCheckResult } from "../rep-checker.types";

export function WalletRepBalanceSummary({
  result,
}: {
  result: RepBalanceCheckResult;
}) {
  return (
    <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {result.balances.map((balance) => (
        <div
          className="border border-primary/10 bg-background/70 p-3"
          key={balance.tokenAddress}
        >
          <dt className="flex items-center justify-between gap-3">
            <span className="font-display text-xl uppercase leading-none text-foreground">
              {balance.token}
            </span>
          </dt>
          <dd className="mt-3 font-mono text-sm text-loud-foreground">
            {balance.balance}
          </dd>
          {balance.readStatus === "error" ? (
            <dd className="mt-2 text-xs leading-5 text-amber">
              {balance.error ?? "Token balance unavailable."}
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
