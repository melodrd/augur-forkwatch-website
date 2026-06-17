import {
  OFFICIAL_MIGRATION_GUIDE_URL,
  OFFICIAL_MIGRATION_PAGE_URL,
} from "@/domain/migration/migration.constants";

export type ForkFaqCardModel = {
  answer: string;
  ctaHref?: string;
  ctaLabel?: string;
  question: string;
};

export const forkFaqCards: ForkFaqCardModel[] = [
  {
    answer:
      "Augur’s oracle is entering a fork. REP holders decide the winning universe by moving REP into the outcome they believe is valid.",
    ctaHref: "https://www.augur.net/blog/the-augur-fork-is-here/",
    ctaLabel: "Read official fork announcement",
    question: "What is happening?",
  },
  {
    answer:
      "If you hold REPv1 or REPv2, move it to a self-custody wallet and complete migration before the deadline, or your REP can become unrecoverable.",
    ctaHref: OFFICIAL_MIGRATION_GUIDE_URL,
    ctaLabel: "Read migration instructions",
    question: "What should I do?",
  },
  {
    answer:
      "Critical. The migration window is open now. Check your wallet for REPv1 or REPv2, read the instructions, and migrate before the cutoff so your REP does not become worthless.",
    ctaHref: OFFICIAL_MIGRATION_PAGE_URL,
    ctaLabel: "Open migration website",
    question: "How urgent is this?",
  },
];
