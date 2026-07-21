import type { SiteCopy } from "./types";

// English is the source-of-truth dictionary. Every string is a complete,
// standalone sentence (no runtime concatenation) so other locales can translate
// freely. The migration-guide hint is baked in once where it belongs.
export const en = {
  meta: {
    title: "ForkWatch",
    description:
      "ForkWatch is a public REP holder safety and fork-status dashboard for the Augur reboot.",
    keywords: [
      "Augur",
      "ForkWatch",
      "REP",
      "REP token",
      "fork dashboard",
      "prediction markets",
      "Ethereum",
    ],
  },
  languageToggle: {
    ariaLabel: "Language",
    englishLabel: "English",
    koreanLabel: "Korean",
    usFlagLabel: "United States flag",
    koreanFlagLabel: "South Korean flag",
  },
  header: {
    sectionNavAriaLabel: "Page sections",
  },
  nav: {
    sectionLabels: {
      overview: "Overview",
      "scam-warning": "Scam Warning",
      "exchange-support": "Exchanges",
      check: "Check REP",
    },
  },
  wordmark: {
    homeAriaLabel: "ForkWatch home",
  },
  overview: {
    eyebrow: "Fork status",
    title: "The Augur fork is happening",
    subtitle:
      "Track the migration timeline and REP migration progress as the fork window draws near.",
    faq: {
      "what-is-happening": {
        question: "What is happening?",
        answer:
          "Augur’s oracle is entering a fork. REP holders decide the winning universe by moving REP into the outcome they believe is valid.",
        ctaLabel: "Official fork announcement",
      },
      "what-to-do": {
        question: "What should I do?",
        answer:
          "If you hold REPv1 or REPv2, move it to a self-custody wallet and complete migration before the deadline, or your REP can become unrecoverable.",
        ctaLabel: "Migration instructions",
      },
      "how-urgent": {
        question: "How urgent is this?",
        answer:
          "Critical. The migration window is open now. Check your wallet for REPv1 or REPv2, read the instructions, and migrate before the cutoff so your REP does not become worthless.",
        ctaLabel: "Migration website",
      },
    },
  },
  migrationCard: {
    ariaLabel: "Migration countdown",
    eyebrow: "Migration deadline",
    timeRemaining: "Time remaining",
    liveCountdown: "Live countdown",
    units: {
      days: "Days",
      hours: "Hours",
      minutes: "Min",
      seconds: "Sec",
    },
    countdownSrText: ({ days, hours, minutes, seconds }) =>
      `Time left to migrate REP: ${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds.`,
    timelineTitle: "60-day timeline",
    timelineAriaLabel: ({ start, end, now }) =>
      `Timeline from ${start} to ${end}. Current time is ${now}.`,
    now: "Now",
    start: "Start",
    deadline: "Deadline",
    cutoffTime: "Cutoff time",
    utcLabel: "UTC",
    localLabel: "Local",
    warningLabel: "Warning",
    warningBody:
      "If you fail to migrate your REP before the deadline, your REP will be deemed worthless.",
    nextActionLabel: "Next action",
    nextActionBody:
      "Check whether your wallet holds REPv1 or REPv2 first, then read the migration instructions and migrate before the timer reaches zero. After migration, confirm that your address holds the intended destination REP token.",
    checkRepButton: "CHECK REP",
    migrationInstructions: "Migration instructions",
    migrationWebsite: "Migration website",
    loadingDeadline: "Loading deadline from Ethereum mainnet",
    deadlineUnavailableShort: "Deadline temporarily unavailable",
    deadlineUnavailable: "Deadline unavailable",
  },
  progressBar: {
    ariaLabel: "REP migrated",
    eyebrow: "REP migrated",
    progressUnavailable: "Progress unavailable",
    loading: "Loading...",
    loadingStatus:
      "Loading migration progress from the latest scheduled update.",
    fileUnavailable:
      "Migration progress is temporarily unavailable. ForkWatch could not read the static migration progress file.",
    readFailedWithDuration: (duration) =>
      `The latest scheduled Ethereum read failed. Showing the last successful read from ${duration} ago.`,
    readFailed:
      "The latest scheduled Ethereum read failed. Showing the last successful read.",
    ethReadUnavailable:
      "Migration progress is temporarily unavailable. ForkWatch could not read Ethereum mainnet during the latest scheduled update.",
    progressDescription: (percent) => `${percent} of total REP supply migrated`,
    lastCheckedPending: "Last checked: Pending",
    lastChecked: (timestamp) => `Last checked: ${timestamp}`,
  },
  scamWarning: {
    eyebrow: "Security",
    title: "Scam warning",
    body: "No one will migrate REP for you. Watch for impersonators, fake websites, and unsolicited messages claiming to handle the migration, recover funds, or validate your wallet. Always check the URL before connecting a wallet, and never share wallet secrets with anyone.",
  },
  exchangeSupport: {
    eyebrow: "Exchange support",
    title: "Fork support tracker",
    trackedExchanges: "Tracked exchanges",
    explainAriaLabel: (title) => `Explain: ${title}`,
    groups: {
      "will-support": {
        title: "Will support the fork",
        action: "No withdrawal needed",
        body: "If an exchange is listed here, it has confirmed fork support. You do not need to withdraw solely to migrate, but still follow the exchange's official instructions and deadlines.",
        emptyLabel: "No exchanges confirmed yet.",
      },
      "will-not-support": {
        title: "Will not support the fork",
        action: "Withdrawal required",
        body: "If an exchange is listed here, it will not support the fork. Withdraw REP to a self-custody wallet and complete migration yourself before the deadline.",
        emptyLabel: "No exchanges confirmed yet.",
      },
      "not-confirmed": {
        title: "Not confirmed yet",
        action: "Withdraw and migrate soon",
        body: "Support has not been confirmed. Treat this as unresolved: withdrawal to self-custody and migration as soon as possible is recommended.",
        emptyLabel: "No unconfirmed exchanges tracked.",
      },
    },
  },
  repChecker: {
    sectionEyebrow: "REP Checker",
    sectionTitle: "Check wallet-held REP",
    balanceCheckTitle: "REP balance check",
    addressLabel: "Ethereum address",
    checkButton: "Check REP",
    checkingButton: "Checking...",
    scopeCards: {
      whyItMatters: {
        title: "Why this check matters",
        body: "REP may not appear in some wallet UIs, especially older REPv1 balances, so checking the address directly helps confirm what you hold before the fork deadline. Check migration guide for more details.",
      },
      scope: {
        title: "Scope",
        body: "Ethereum mainnet only. Exchanges, custodians, L2s, bridges, REP held in smart contracts, and other chains are NOT checked. Check migration guide for more details.",
      },
      warning: {
        title: "Warning",
        body: "Double-check the address and confirm details with trusted sources before taking any migration action. Check migration guide for more details.",
      },
    },
    checking: {
      eyebrow: "Checking",
      title: "Reading Ethereum mainnet",
      body: "Checking the address for REPv1 and REPv2 balances. Check migration guide for more details.",
    },
    resultNotice: {
      deadlineAction: "Deadline action",
      details: "Details",
    },
    warningLabel: "Warning",
    scopeNote: {
      eyebrow: "Scope note",
      body: "This checks Ethereum mainnet REPv1 and REPv2 balances only. It does not check exchanges, custodians, bridges, L2s, other chains, wrapped REP, wallets you forgot to paste, or LP positions unless the relevant address is pasted and supported. Check migration guide for more details.",
      liability:
        "Double-check with trusted sources before taking action. This tool is provided for informational use only, and we are not liable for losses, including lost REP. Check migration guide for more details.",
    },
    addressField: "Address",
    checkedThrough: ({ date, endpoint }) =>
      `Checked ${date} through ${endpoint}.`,
    results: {
      both: {
        title: "Migration required for this wallet",
        action:
          "This address has both REPv1 and REPv2. Convert the REPv1 balance into REPv2 first, then migrate the full REPv2 balance to the intended fork outcome before the deadline. Check migration guide for more details.",
        warning:
          "Failure to migrate before the deadline will leave these REP tokens worthless.",
      },
      error: {
        title: "Could not check Ethereum mainnet",
        body: "The balance check failed. Try again later, or check directly through an Ethereum block explorer. Check migration guide for more details.",
      },
      invalid: {
        title: "Invalid Ethereum address",
        body: "Enter a valid Ethereum address. Check migration guide for more details.",
      },
      none: {
        title: "No Ethereum mainnet REP found",
        body: "No REPv1 or REPv2 was found on Ethereum mainnet for the addresses checked. If you expected REP, check old wallets, exchange/custodian accounts, bridges, other networks, and any addresses you may have forgotten to paste. Check migration guide for more details.",
      },
      partial: {
        title: "REP check incomplete",
        body: "ForkWatch could not read every supported REP token for this address. Do not treat this as a clear result; retry later or check each token directly on a trusted block explorer. Check migration guide for more details.",
      },
      repv1: {
        title: "REPv1 migration required",
        action:
          "This address has REPv1. Convert REPv1 into REPv2 first, then migrate REPv2 to the intended fork outcome before the deadline. Check migration guide for more details.",
        warning:
          "Failure to migrate before the deadline will leave these REP tokens worthless.",
      },
      repv2: {
        title: "REPv2 migration required",
        action:
          "This address has REPv2. Migrate REPv2 to the intended fork outcome before the deadline. Check migration guide for more details.",
        warning:
          "Failure to migrate before the deadline will leave these REP tokens worthless.",
      },
      repv2Yes1: {
        title: "Configured destination REP found",
        body: "This address holds REPv2_Yes_1. Migration appears successful, but check trusted block explorers and other sources before relying on this result. Check migration guide for more details.",
      },
    },
    actions: {
      migrationInstructions: "Migration instructions",
      checkAnother: "Check another address",
      migrationWebsite: "Migration website",
    },
    guideWarning: {
      verifyUrl:
        "Check official sources to confirm the URL is correct, then verify the domain and TLS lock icon before every wallet connection. Check migration guide for more details.",
      neverShareSecrets:
        "Never type or share a seed phrase, private key, or recovery words. Check migration guide for more details.",
      startFromBookmark:
        "If anything feels off, close the tab and start from a trusted bookmark. Check migration guide for more details.",
    },
    guideDialog: {
      eyebrow: "Scam check",
      title: "Pause and verify before connecting",
      confirmLabel: "I understand",
    },
    messages: {
      invalidAddress:
        "Enter a valid Ethereum address. Check migration guide for more details.",
      rpcError:
        "Could not check Ethereum mainnet right now. Try again later. Check migration guide for more details.",
      tokenReadError: "Could not read this token balance.",
      balanceUnavailable: "Unavailable",
    },
  },
  footer: {
    summaryAriaLabel: "ForkWatch summary",
    summary:
      "Public REP holder safety, migration progress, and fork-status monitoring for the Augur reboot.",
    noticeTitle: "Notice",
    noticeBody:
      "Educational use only. Not investment, trading, legal, tax, or financial advice.",
  },
  safetyDialog: {
    cancelLabel: "Cancel",
    eyebrow: "External link check",
    closeAriaLabel: (title) => `Close ${title}`,
  },
  externalLink: {
    confirmLabel: "Continue to external site",
    title: "Pause and verify before leaving ForkWatch",
    warningPrimary:
      "You are opening an external site. Confirm the domain, HTTPS/TLS lock, and official source before connecting a wallet or taking action.",
    warningSecondary:
      "Nobody from Augur or Lituus will DM you to help migrate. Never enter a seed phrase, private key, or recovery words.",
  },
  duration: {
    lessThanMinute: "less than 1 minute",
    minutes: (value) => `${value} ${value === 1 ? "minute" : "minutes"}`,
    hours: (value) => `${value} ${value === 1 ? "hour" : "hours"}`,
    days: (value) => `${value} ${value === 1 ? "day" : "days"}`,
  },
} satisfies SiteCopy;
