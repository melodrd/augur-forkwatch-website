import { formatDate } from "@/lib/format";
import type { WalletRepCheckerStatus } from "../hooks/use-wallet-rep-checker";
import {
  REP_CHECKER_RESULT_COPY,
  REP_CHECKER_SCOPE_DISCLAIMER,
  withRepCheckerMigrationGuideHint,
} from "../rep-checker.copy";
import {
  getWalletRepResultKind,
  isRepBalanceCheckResult,
} from "../rep-checker.helpers";
import type {
  RepBalanceCheckResponse,
  WalletRepResultKind,
} from "../rep-checker.types";
import { WalletRepBalanceSummary } from "./WalletRepBalanceSummary";
import { WalletRepResultActions } from "./WalletRepResultActions";

const resultFrameClasses: Record<WalletRepResultKind, string> = {
  both: "border-primary/40 bg-background/70",
  error: "border-primary/10 bg-background/70",
  invalid: "border-primary/10 bg-background/70",
  none: "border-primary/10 bg-background/70",
  partial: "border-amber/40 bg-amber/10",
  repv1: "border-primary/40 bg-background/70",
  repv2: "border-primary/40 bg-background/70",
  repv2Yes1: "border-primary/10 bg-background/70",
};

type WalletRepResultCardProps = {
  error: string | null;
  result: RepBalanceCheckResponse | null;
  status: WalletRepCheckerStatus;
  onReset: () => void;
};

function ResultNotice({
  children,
  title,
}: {
  children: string;
  title: string;
}) {
  return (
    <div className="mt-5 border border-primary/40 bg-primary/10 p-4">
      <p className="font-display text-xl uppercase leading-none text-primary">
        &gt;_ {title}
      </p>
      <p className="mt-2 max-w-3xl text-base leading-7 text-loud-foreground">
        {children}
      </p>
    </div>
  );
}

function RepMigrationWarning({ children }: { children: string }) {
  return (
    <div className="mt-4 border border-red/35 bg-red/10 px-3 py-2 text-sm leading-6 text-red">
      <p className="font-display text-sm uppercase leading-none">
        &gt;_ Warning
      </p>
      <p className="mt-1">{children}</p>
    </div>
  );
}

function ScopeWarningNotice({ children }: { children: string }) {
  return (
    <div className="mt-5 border border-amber/40 bg-amber/10 p-4">
      <p className="font-display text-xl uppercase leading-none text-amber">
        &gt;_ Scope note
      </p>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-amber">{children}</p>
      <p className="mt-2 max-w-3xl text-xs leading-5 text-amber/80">
        Double-check with trusted sources before taking action. This tool is
        provided for informational use only, and we are not liable for losses,
        including lost REP.{" "}
        {withRepCheckerMigrationGuideHint(
          "Check migration guide for more details.",
        )}
      </p>
    </div>
  );
}

function CheckingState() {
  return (
    <article className="border border-primary/10 bg-background/70 p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-display text-xl uppercase leading-none text-muted-foreground">
            &gt;_ Checking
          </p>
          <h3 className="mt-2 font-display text-3xl uppercase leading-none text-foreground">
            Reading Ethereum mainnet
          </h3>
          <p className="mt-2 text-sm leading-6 text-foreground/80">
            Checking the address for REPv1 and REPv2 balances.{" "}
            {withRepCheckerMigrationGuideHint(
              "Check migration guide for more details.",
            )}
          </p>
        </div>
      </div>
    </article>
  );
}

export function WalletRepResultCard({
  error,
  onReset,
  result,
  status,
}: WalletRepResultCardProps) {
  if (status === "checking") {
    return <CheckingState />;
  }

  if (!result) {
    return null;
  }

  const kind = getWalletRepResultKind(result);
  const copy = REP_CHECKER_RESULT_COPY[kind];
  const body = copy.body ?? error;

  return (
    <article className={`border p-4 sm:p-5 ${resultFrameClasses[kind]}`}>
      <div>
        <h3 className="font-display text-3xl uppercase leading-none text-foreground">
          &gt;_ {copy.title}
        </h3>
        {copy.warning ? (
          <RepMigrationWarning>{copy.warning}</RepMigrationWarning>
        ) : null}
        {copy.action ? (
          <ResultNotice title="Deadline action">{copy.action}</ResultNotice>
        ) : null}
        {kind === "none" ? (
          <ScopeWarningNotice>
            {withRepCheckerMigrationGuideHint(REP_CHECKER_SCOPE_DISCLAIMER)}
          </ScopeWarningNotice>
        ) : null}
        {body ? <ResultNotice title="Details">{body}</ResultNotice> : null}
      </div>

      <dl className="mt-5 border border-primary/10 bg-background/70 p-3 sm:grid sm:grid-cols-[7rem_1fr] sm:gap-3">
        <dt className="font-display text-lg uppercase leading-none text-muted-foreground">
          Address
        </dt>
        <dd className="mt-1 min-w-0 font-mono text-sm text-loud-foreground sm:mt-0">
          <span className="break-all" title={result.address}>
            {result.address}
          </span>
        </dd>
      </dl>

      {isRepBalanceCheckResult(result) ? (
        <WalletRepBalanceSummary result={result} />
      ) : null}

      {isRepBalanceCheckResult(result) ? (
        <p className="mt-4 font-mono text-[0.68rem] text-muted-foreground">
          Checked {formatDate(result.checkedAt)} through{" "}
          {result.rpcInfo.endpoint}.
        </p>
      ) : null}

      <WalletRepResultActions kind={kind} onCheckAnother={onReset} />
    </article>
  );
}
