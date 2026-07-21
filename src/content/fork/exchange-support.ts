// Locale-agnostic exchange-support data: group ids, the tracked exchange names,
// and tone classes. All user-facing prose (titles, actions, bodies) lives in the
// i18n dictionaries keyed by `id`. Facts (which exchange is in which group) must
// never be duplicated per locale.
export const exchangeGroups = [
  {
    id: "will-support",
    exchanges: ["Kraken"],
    toneClassName: "border-primary/35 bg-primary/5 text-primary",
  },
  {
    id: "will-not-support",
    exchanges: ["Coinbase", "Gate.io", "Upbit"],
    toneClassName: "border-red/35 bg-red/5 text-red",
  },
  {
    id: "not-confirmed",
    exchanges: ["OKX", "Bitpanda"],
    toneClassName: "border-amber/35 bg-amber/5 text-amber",
  },
] as const;

export type ExchangeGroupId = (typeof exchangeGroups)[number]["id"];
