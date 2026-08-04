import type { SiteCopy } from "./types";

// English is the source-of-truth dictionary. Strings are complete standalone
// sentences except for the explicitly split overview headline tokens used by
// its one-time status animation.
export const en = {
  meta: {
    title: "Augur Fork Results & REP Migration Total | ForkWatch",
    description:
      "Review the Augur fork record, the amount of REP migrated during the window, wallet-held REP balances, safety guidance, and archived exchange support.",
    keywords: [
      "Augur",
      "ForkWatch",
      "REP",
      "REP token",
      "Augur fork results",
      "fork archive",
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
      result: "Migration Result",
      "scam-warning": "Scam Warning",
      "exchange-support": "Exchange Archive",
      check: "Check REP",
    },
  },
  wordmark: {
    homeAriaLabel: "ForkWatch home",
  },
  overview: {
    eyebrow: "Fork status",
    // The percentage is the Yes universe's share of the original supply, which
    // is why the supply note names the 11M denominator directly beneath it.
    headline: (percent) => `${percent} migrated to the Yes universe`,
    headlineFallback: "The Augur fork has ended",
    headlineSupplyNote: "of the original 11M REP supply",
    subtitle:
      "The 60-day fork window has closed. See how much REP was migrated, check the REP held by an address, and review the fork record.",
    faq: {
      "what-is-happening": {
        question: "What happened?",
        answer:
          "Augur went through a fork. REP holders had 60 days to migrate, and that window has closed. This page is now an archive of the key dates and the amount that moved.",
        ctaLabel: "Official fork announcement",
      },
      "what-to-do": {
        question: "What can I do now?",
        answer:
          "The migration window is closed, so migrating is no longer possible and REP left in the parent universe is expected to be worthless. You can still use the read-only checker to review REPv1, REPv2, and migrated REP held by an Ethereum mainnet address.",
        ctaLabel: "Migration guide (archived)",
      },
      "how-urgent": {
        question: "I still hold REPv2. What now?",
        answer:
          "If you did not migrate and still hold REPv1 or REPv2, there is nothing left to do—the window cannot be reopened. You can still use the read-only checker below to see exactly what an address holds. Please be cautious with anyone offering late migration or recovery; those claims are scams.",
        ctaLabel: "Check wallet for REP",
      },
    },
  },
  migrationCard: {
    start: "Start",
    deadline: "End",
    cutoffTime: "Fork end time",
    utcLabel: "UTC",
    localLabel: "Local",
    ended: {
      ariaLabel: "Augur fork window ended",
      eyebrow: "Timeline",
      badge: "Ended",
      title: "The migration window has ended",
      body: "The 60-day window is complete, and REP can no longer be migrated.",
      timelineTitle: "Completed 60-day timeline",
      timelineAriaLabel: ({ start, end }) =>
        `The 60-day fork timeline ran from ${start} to ${end} and is complete.`,
      timelineMarker: "Ended",
      warningLabel: "A quick safety note",
      warningBody:
        "The migration window cannot be reopened. Please ignore messages, websites, or tokens offering late migration, recovery, or a replacement REP claim.",
      nextActionLabel: "What you can still do",
      nextActionBody:
        "Use the read-only checker to review REP held by an Ethereum mainnet address.",
      checkRepButton: "CHECK REP BALANCES",
      migrationInstructions: "MIGRATION GUIDE (ARCHIVE)",
    },
  },
  progressBar: {
    progressUnavailable: "Supply unavailable",
    loading: "Loading supply...",
    loadingStatus: "Reading both migrated REP token supplies from Ethereum.",
    fileUnavailable:
      "The combined migrated REP total is temporarily unavailable. ForkWatch could not read the saved Ethereum data.",
    readFailed:
      "The latest Ethereum read failed. Showing the last successfully recorded totals for both tokens.",
    ethReadUnavailable:
      "The migrated REP totals are temporarily unavailable because Ethereum could not be reached during the latest update.",
    lastCheckedPending: "Update time unavailable",
    ended: {
      ariaLabel: "REP migration totals from the Augur fork",
      eyebrow: "Migration result",
      amountLabel: "Total REP migrated",
      supplyTitle: "Share of original supply",
      supplyDescription: (percent) =>
        `${percent} of the original 11 million REP supply moved into the two child universes.`,
      sourceLabel: (timestamp) => `Ethereum data updated ${timestamp}`,
      blockLabel: (blockNumber) => `Block ${blockNumber}`,
      outcomeSectionLabel: "Migration totals by child universe",
      outcomeSectionTitle: "Where the REP moved",
      yesOutcomeLabel: "Yes universe",
      noOutcomeLabel: "No universe",
      outcomeBadge: {
        yes: "Yes",
        no: "No",
      },
      // States the split between the two child universes as a share of what
      // actually migrated, which is a different denominator from the
      // share-of-original-supply figures on each card.
      dominantOutcomeNote: ({ outcome, percent }) =>
        `The ${outcome} received ${percent} of all migrated REP.`,
      tokenSupplyLabel: "Share of original supply",
      tokenContractLabel: "Token contract",
      childUniverseLabel: "Child universe",
      parentUniverseLabel: "Parent universe",
      etherscanLabel: "View on Etherscan",
    },
  },
  scamWarning: {
    eyebrow: "Security",
    title: "Late-migration and recovery scams",
    body: "The fork window is closed. No one can reopen it for you. Ignore impersonators, fake websites, replacement tokens, and unsolicited messages claiming they can complete a late migration, recover legacy REP, or validate your wallet. Never share a seed phrase, private key, or recovery words.",
  },
  exchangeSupport: {
    eyebrow: "Exchange archive",
    title: "Historical fork support",
    trackedExchanges: "Archived exchange status",
    archiveNotice:
      "This section preserves exchange support statements from before the fork cutoff. It is a historical record, not current withdrawal, migration, or account guidance. Check each exchange’s official support channels for account-specific information.",
    explainAriaLabel: (title) => `Historical context: ${title}`,
    groups: {
      "will-support": {
        title: "Reported fork support",
        action: "Historical report",
        body: "Before the cutoff, exchanges listed here reported that they would support the fork. This archive does not confirm how any individual account or balance was handled.",
        emptyLabel: "No supporting exchanges were recorded.",
      },
      "will-not-support": {
        title: "Reported no fork support",
        action: "Historical report",
        body: "Before the cutoff, exchanges listed here reported that they would not support the fork. This archive is not a current instruction to withdraw or migrate.",
        emptyLabel: "No non-supporting exchanges were recorded.",
      },
      "not-confirmed": {
        title: "Support was unconfirmed",
        action: "Historical status",
        body: "Fork support had not been confirmed before the cutoff for exchanges listed here. Contact the exchange directly for any current account or balance questions.",
        emptyLabel: "No historically unconfirmed exchanges were recorded.",
      },
    },
  },
  repChecker: {
    sectionEyebrow: "Post-fork REP checker",
    sectionTitle: "Review wallet-held REP",
    balanceCheckTitle: "Read-only REP balance check",
    addressLabel: "Ethereum address",
    checkButton: "Check REP",
    checkingButton: "Checking...",
    archiveNotice:
      "The fork window is closed. This checker only reads balances; it cannot migrate, move, claim, or recover REP.",
    scopeCards: {
      whyItMatters: {
        title: "Why this check matters",
        body: "REP may not appear in some wallet UIs, especially older REPv1 balances. A direct address check can show whether REPv1, REPv2, or migrated REP remains at that address after the fork.",
      },
      scope: {
        title: "Scope",
        body: "Ethereum mainnet REPv1, REPv2, and migrated REP only. Exchanges, custodians, L2s, bridges, REP held by other addresses or smart contracts, and other chains are not checked.",
      },
      warning: {
        title: "Warning",
        body: "A balance result only covers the address you entered. Verify the address, token contract, and balance through trusted on-chain sources.",
      },
    },
    checking: {
      eyebrow: "Checking",
      title: "Reading Ethereum mainnet",
      body: "Checking this address for REPv1, REPv2, and migrated REP balances. This read-only check does not connect a wallet or request a transaction.",
    },
    resultNotice: {
      deadlineAction: "Post-fork finding",
      details: "Details",
    },
    warningLabel: "Warning",
    scopeNote: {
      eyebrow: "Scope note",
      body: "This checks Ethereum mainnet REPv1, REPv2, and migrated REP balances only. It does not check exchanges, custodians, bridges, L2s, other chains, wrapped REP, other wallet addresses, or LP positions unless the relevant address is entered and the token is supported.",
      liability:
        "Verify results with trusted on-chain sources. This read-only tool is for informational use and cannot migrate or recover tokens. We are not liable for losses, including lost REP.",
    },
    addressField: "Address",
    checkedThrough: ({ date, endpoint }) =>
      `Checked ${date} through ${endpoint}.`,
    results: {
      both: {
        title: "REPv1 and REPv2 found",
        action:
          "This address still holds both REPv1 and REPv2. The read-only checker can show these balances but cannot change or recover them.",
        warning:
          "The window has ended, so these balances can no longer be migrated through the fork. Please be cautious with anyone offering late migration or recovery.",
      },
      error: {
        title: "Could not check Ethereum mainnet",
        body: "The read-only balance check failed. Try again later, or check REPv1, REPv2, and migrated REP directly through a trusted Ethereum block explorer.",
      },
      invalid: {
        title: "Invalid Ethereum address",
        body: "Enter a valid Ethereum mainnet address. ForkWatch never needs a seed phrase, private key, or wallet connection.",
      },
      legacyAndMigrated: {
        title: "Migrated and older REP found",
        action:
          "This address holds migrated REP as well as REPv1 and/or REPv2. The older REP balances remain after the migration window ended.",
        warning:
          "The older REP can no longer be migrated through the fork. Please be cautious with anyone offering late migration or recovery.",
      },
      none: {
        title: "No Ethereum mainnet REP found",
        body: "No REPv1, REPv2, or migrated REP was found on Ethereum mainnet for this address. If you expected REP, review other wallet addresses, exchange or custodian accounts, bridges, other networks, and smart-contract positions.",
      },
      partial: {
        title: "REP check incomplete",
        body: "ForkWatch could not read every supported REP token for this address. Do not treat this as a complete post-fork result; retry later or check each token contract directly through a trusted block explorer.",
      },
      repv1: {
        title: "REPv1 found",
        action:
          "This address still holds REPv1. The read-only checker can show the balance but cannot change or recover it.",
        warning:
          "The window has ended, so this balance can no longer be migrated through the fork. Please be cautious with anyone offering late migration or recovery.",
      },
      repv2: {
        title: "REPv2 found",
        action:
          "This address still holds REPv2. The read-only checker can show the balance but cannot change or recover it.",
        warning:
          "The window has ended, so this balance can no longer be migrated through the fork. Please be cautious with anyone offering late migration or recovery.",
      },
      migrated: {
        title: "Migrated REP found",
        body: "This address holds REP in one or both child-universe tokens from the fork migration window. This result only covers the address you entered, so remember to check any other wallets or accounts you used.",
      },
    },
    actions: {
      migrationInstructions: "Official migration guide (archive)",
      checkAnother: "Check another address",
    },
    guideWarning: {
      verifyUrl:
        "This opens the official migration guide as a historical reference. Confirm the domain and HTTPS/TLS lock before leaving ForkWatch.",
      neverShareSecrets:
        "Never type or share a seed phrase, private key, or recovery words. A post-fork balance check or archive never requires them.",
      startFromBookmark:
        "If anything claims to offer late migration or recovery, close the tab and return through a trusted bookmark.",
    },
    guideDialog: {
      eyebrow: "Archive link check",
      title: "Pause and verify the official guide",
      confirmLabel: "I understand",
    },
    messages: {
      invalidAddress:
        "Enter a valid Ethereum mainnet address. Never enter a seed phrase or private key.",
      rpcError:
        "Could not check Ethereum mainnet right now. Try again later or use a trusted block explorer.",
      tokenReadError: "Could not read this token balance.",
      balanceUnavailable: "Unavailable",
    },
  },
  footer: {
    summaryAriaLabel: "ForkWatch summary",
    summary:
      "Post-fork REP holder safety, migrated REP supply data, wallet balance checks, and historical fork information for the Augur reboot.",
    noticeTitle: "Archive notice",
    noticeBody:
      "Historical and educational use only. Verify on-chain data and official sources independently. Not investment, trading, legal, tax, or financial advice.",
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
      "Nobody from Augur or Lituus will DM you to offer late migration or REP recovery. Never enter a seed phrase, private key, or recovery words.",
  },
} satisfies SiteCopy;
