import type { ExchangeGroupId } from "@/content/fork/exchange-support";
import type { ForkFaqId } from "@/content/fork/fork-faq";
import type { ForkSectionId } from "@/content/fork/fork-sections";
import type { MigrationOutcomeKey } from "@/features/migration/migration-progress.types";
import type { WalletRepResultKind } from "@/features/rep-checker/rep-checker.types";

export type CompletedTimelineRange = {
  start: string;
  end: string;
};

export type DominantOutcomeShare = {
  outcome: string;
  percent: string;
};

export type CheckedThroughArgs = {
  date: string;
  endpoint: string;
};

type FaqCardCopy = {
  question: string;
  answer: string;
  ctaLabel: string;
};

type ExchangeGroupCopy = {
  title: string;
  action: string;
  body: string;
  emptyLabel: string;
};

type UpbitNoticeCopy = {
  badge: string;
  title: string;
  body: string;
};

type ScopeCardCopy = {
  title: string;
  body: string;
};

type RepResultCopy = {
  title: string;
  action?: string;
  body?: string;
  warning?: string;
};

type RepCheckerPhaseCopy = {
  sectionEyebrow: string;
  sectionTitle: string;
  balanceCheckTitle: string;
  addressLabel: string;
  checkButton: string;
  checkingButton: string;
  scopeCards: {
    whyItMatters: ScopeCardCopy;
    scope: ScopeCardCopy;
    warning: ScopeCardCopy;
  };
  checking: {
    eyebrow: string;
    title: string;
    body: string;
  };
  resultNotice: {
    deadlineAction: string;
    details: string;
  };
  warningLabel: string;
  scopeNote: {
    eyebrow: string;
    body: string;
    liability: string;
  };
  addressField: string;
  checkedThrough: (args: CheckedThroughArgs) => string;
  results: Record<WalletRepResultKind, RepResultCopy>;
  actions: {
    migrationInstructions: string;
    checkAnother: string;
  };
  guideWarning: {
    verifyUrl: string;
    neverShareSecrets: string;
    startFromBookmark: string;
  };
  guideDialog: {
    eyebrow: string;
    title: string;
    confirmLabel: string;
  };
  messages: {
    invalidAddress: string;
    rpcError: string;
    tokenReadError: string;
    balanceUnavailable: string;
  };
};

/**
 * The complete set of user-facing strings for one locale. Every dictionary
 * (`en`, `ko`) is declared `satisfies SiteCopy`, so TypeScript guarantees key
 * parity across locales. Facts (exchange lists, tickers, URLs, ids) never live
 * here — only prose.
 */
export type SiteCopy = {
  meta: {
    title: string;
    description: string;
    keywords: readonly string[];
  };
  languageToggle: {
    ariaLabel: string;
    englishLabel: string;
    koreanLabel: string;
    usFlagLabel: string;
    koreanFlagLabel: string;
  };
  header: {
    sectionNavAriaLabel: string;
  };
  nav: {
    sectionLabels: Record<ForkSectionId, string>;
  };
  wordmark: {
    homeAriaLabel: string;
  };
  overview: {
    eyebrow: string;
    headline: (percent: string) => string;
    headlineFallback: string;
    headlineSupplyNote: string;
    subtitle: string;
    faq: Record<ForkFaqId, FaqCardCopy>;
  };
  migrationCard: {
    start: string;
    deadline: string;
    cutoffTime: string;
    utcLabel: string;
    localLabel: string;
    ended: {
      ariaLabel: string;
      eyebrow: string;
      badge: string;
      title: string;
      body: string;
      timelineTitle: string;
      timelineAriaLabel: (range: CompletedTimelineRange) => string;
      timelineMarker: string;
      warningLabel: string;
      warningBody: string;
      nextActionLabel: string;
      nextActionBody: string;
      checkRepButton: string;
      migrationInstructions: string;
    };
  };
  progressBar: {
    progressUnavailable: string;
    loading: string;
    loadingStatus: string;
    fileUnavailable: string;
    readFailed: string;
    ethReadUnavailable: string;
    lastCheckedPending: string;
    ended: {
      ariaLabel: string;
      eyebrow: string;
      amountLabel: string;
      supplyTitle: string;
      supplyDescription: (percent: string) => string;
      sourceLabel: (timestamp: string) => string;
      blockLabel: (blockNumber: string) => string;
      outcomeSectionLabel: string;
      outcomeSectionTitle: string;
      yesOutcomeLabel: string;
      noOutcomeLabel: string;
      outcomeBadge: Record<MigrationOutcomeKey, string>;
      dominantOutcomeNote: (share: DominantOutcomeShare) => string;
      tokenSupplyLabel: string;
      tokenContractLabel: string;
      childUniverseLabel: string;
      parentUniverseLabel: string;
      etherscanLabel: string;
    };
  };
  scamWarning: {
    eyebrow: string;
    title: string;
    body: string;
  };
  exchangeSupport: {
    eyebrow: string;
    title: string;
    trackedExchanges: string;
    archiveNotice: string;
    explainAriaLabel: (title: string) => string;
    groups: Record<ExchangeGroupId, ExchangeGroupCopy>;
    upbitNotice?: UpbitNoticeCopy;
  };
  repChecker: RepCheckerPhaseCopy & {
    archiveNotice: string;
  };
  footer: {
    summaryAriaLabel: string;
    summary: string;
    noticeTitle: string;
    noticeBody: string;
  };
  safetyDialog: {
    cancelLabel: string;
    eyebrow: string;
    closeAriaLabel: (title: string) => string;
  };
  externalLink: {
    confirmLabel: string;
    title: string;
    warningPrimary: string;
    warningSecondary: string;
  };
};
