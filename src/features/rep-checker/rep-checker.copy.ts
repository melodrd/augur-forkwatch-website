import type { WalletRepResultKind } from "./rep-checker.types";

export const REP_CHECKER_MIGRATION_GUIDE_HINT =
  "Check migration guide for more details.";

export const REP_CHECKER_SCOPE_DISCLAIMER =
  "This checks Ethereum mainnet REPv1 and REPv2 balances only. It does not check exchanges, custodians, bridges, L2s, other chains, wrapped REP, wallets you forgot to paste, or LP positions unless the relevant address is pasted and supported.";

export const REP_CHECKER_PRIVACY_NOTICE =
  "Privacy note: this sends the public Ethereum address you enter to public Ethereum RPC providers from your browser. Do not paste seed phrases, private keys, recovery words, or any secret.";

export function withRepCheckerMigrationGuideHint(message: string): string {
  return `${message} ${REP_CHECKER_MIGRATION_GUIDE_HINT}`;
}

export type MigrationResultCopy = {
  action?: string;
  body?: string;
  warning?: string;
  title: string;
};

export const REP_CHECKER_RESULT_COPY: Record<
  WalletRepResultKind,
  MigrationResultCopy
> = {
  both: {
    action: withRepCheckerMigrationGuideHint(
      "This address has both REPv1 and REPv2. Convert the REPv1 balance into REPv2 first, then migrate the full REPv2 balance to the intended fork outcome before the deadline.",
    ),
    warning:
      "Failure to migrate before the deadline will leave these REP tokens worthless.",
    title: "Migration required for this wallet",
  },
  error: {
    body: withRepCheckerMigrationGuideHint(
      "The balance check failed. Try again later, or check directly through an Ethereum block explorer.",
    ),
    title: "Could not check Ethereum mainnet",
  },
  invalid: {
    body: withRepCheckerMigrationGuideHint("Enter a valid Ethereum address."),
    title: "Invalid Ethereum address",
  },
  none: {
    body: withRepCheckerMigrationGuideHint(
      "No REPv1 or REPv2 was found on Ethereum mainnet for the addresses checked. If you expected REP, check old wallets, exchange/custodian accounts, bridges, other networks, and any addresses you may have forgotten to paste.",
    ),
    title: "No Ethereum mainnet REP found",
  },
  partial: {
    body: withRepCheckerMigrationGuideHint(
      "ForkWatch could not read every supported REP token for this address. Do not treat this as a clear result; retry later or check each token directly on a trusted block explorer.",
    ),
    title: "REP check incomplete",
  },
  repv1: {
    action: withRepCheckerMigrationGuideHint(
      "This address has REPv1. Convert REPv1 into REPv2 first, then migrate REPv2 to the intended fork outcome before the deadline.",
    ),
    warning:
      "Failure to migrate before the deadline will leave these REP tokens worthless.",
    title: "REPv1 migration required",
  },
  repv2: {
    action: withRepCheckerMigrationGuideHint(
      "This address has REPv2. Migrate REPv2 to the intended fork outcome before the deadline.",
    ),
    warning:
      "Failure to migrate before the deadline will leave these REP tokens worthless.",
    title: "REPv2 migration required",
  },
  repv2Yes1: {
    body: withRepCheckerMigrationGuideHint(
      "This address holds ForkWatch's configured destination REP token, displayed here as REPv2_Yes_1 and reported by the token contract as REPv2_Yes_1. Confirm with official tools and trusted block explorers before relying on this result.",
    ),
    title: "Configured destination REP found",
  },
};

export const REP_CHECKER_SCOPE_CARDS = [
  {
    body: withRepCheckerMigrationGuideHint(
      "REP may not appear in some wallet UIs, especially older REPv1 balances, so checking the address directly helps confirm what you hold before the fork deadline.",
    ),
    title: "Why this check matters",
  },
  {
    body: withRepCheckerMigrationGuideHint(
      "Ethereum mainnet only. Exchanges, custodians, L2s, bridges, REP held in smart contracts, and other chains are NOT checked.",
    ),
    title: "Scope",
  },
  {
    body: withRepCheckerMigrationGuideHint(
      "Double-check the address and confirm details with trusted sources before taking any migration action.",
    ),
    title: "Warning",
  },
] as const;

export const REP_CHECKER_GUIDE_WARNING = [
  withRepCheckerMigrationGuideHint(
    "Check official sources to confirm the URL is correct, then verify the domain and TLS lock icon before every wallet connection.",
  ),
  withRepCheckerMigrationGuideHint(
    "Never type or share a seed phrase, private key, or recovery words.",
  ),
  withRepCheckerMigrationGuideHint(
    "If anything feels off, close the tab and start from a trusted bookmark.",
  ),
] as const;

export const REP_CHECKER_RPC_ERROR_MESSAGE = withRepCheckerMigrationGuideHint(
  "Could not check Ethereum mainnet right now. Try again later.",
);
