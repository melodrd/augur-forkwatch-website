import type { ExchangeGroupId } from "@/content/fork/exchange-support";
import type { ForkFaqId } from "@/content/fork/fork-faq";
import type { ForkSectionId } from "@/content/fork/fork-sections";
import type { WalletRepResultKind } from "@/features/rep-checker/rep-checker.types";

export type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export type TimelineRange = {
  start: string;
  end: string;
  now: string;
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
    title: string;
    subtitle: string;
    faq: Record<ForkFaqId, FaqCardCopy>;
  };
  migrationCard: {
    ariaLabel: string;
    eyebrow: string;
    timeRemaining: string;
    liveCountdown: string;
    units: {
      days: string;
      hours: string;
      minutes: string;
      seconds: string;
    };
    countdownSrText: (parts: CountdownParts) => string;
    timelineTitle: string;
    timelineAriaLabel: (range: TimelineRange) => string;
    now: string;
    start: string;
    deadline: string;
    cutoffTime: string;
    utcLabel: string;
    localLabel: string;
    warningLabel: string;
    warningBody: string;
    nextActionLabel: string;
    nextActionBody: string;
    checkRepButton: string;
    migrationInstructions: string;
    migrationWebsite: string;
    loadingDeadline: string;
    deadlineUnavailableShort: string;
    deadlineUnavailable: string;
  };
  progressBar: {
    ariaLabel: string;
    eyebrow: string;
    progressUnavailable: string;
    loading: string;
    loadingStatus: string;
    fileUnavailable: string;
    readFailedWithDuration: (duration: string) => string;
    readFailed: string;
    ethReadUnavailable: string;
    progressDescription: (percent: string) => string;
    lastCheckedPending: string;
    lastChecked: (timestamp: string) => string;
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
    explainAriaLabel: (title: string) => string;
    groups: Record<ExchangeGroupId, ExchangeGroupCopy>;
    upbitNotice?: UpbitNoticeCopy;
  };
  repChecker: {
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
      migrationWebsite: string;
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
  duration: {
    lessThanMinute: string;
    minutes: (value: number) => string;
    hours: (value: number) => string;
    days: (value: number) => string;
  };
};
