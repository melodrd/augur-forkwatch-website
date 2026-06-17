export const exchangeGroups = [
  {
    action: "No withdrawal needed",
    body: "If an exchange is listed here, it has confirmed fork support. You do not need to withdraw solely to migrate, but still follow the exchange's official instructions and deadlines.",
    emptyLabel: "No exchanges confirmed yet.",
    exchanges: [],
    title: "Will support the fork",
    toneClassName: "border-primary/35 bg-primary/5 text-primary",
  },
  {
    action: "Withdrawal required",
    body: "If an exchange is listed here, it will not support the fork. Withdraw REP to a self-custody wallet and complete migration yourself before the deadline.",
    emptyLabel: "No exchanges confirmed yet.",
    exchanges: [],
    title: "Will not support the fork",
    toneClassName: "border-red/35 bg-red/5 text-red",
  },
  {
    action: "Withdraw and migrate soon",
    body: "Support has not been confirmed. Treat this as unresolved: withdrawal to self-custody and migration as soon as possible is recommended.",
    emptyLabel: "No unconfirmed exchanges tracked.",
    exchanges: ["Kraken", "Gate.io", "Upbit", "Coinbase", "OKX", "Bitpanda"],
    title: "Not confirmed yet",
    toneClassName: "border-amber/35 bg-amber/5 text-amber",
  },
] as const;
