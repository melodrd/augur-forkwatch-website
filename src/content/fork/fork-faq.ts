import { OFFICIAL_MIGRATION_GUIDE_URL } from "@/domain/migration/migration.constants";

// Locale-agnostic FAQ data: stable ids and CTA URLs. The question, answer, and
// CTA label text live in the i18n dictionaries keyed by `id`.
export const forkFaqCards = [
  {
    id: "what-is-happening",
    ctaHref: "https://www.augur.net/blog/phase-2-the-fork-migration/",
  },
  {
    id: "what-to-do",
    ctaHref: OFFICIAL_MIGRATION_GUIDE_URL,
  },
  {
    id: "how-urgent",
    ctaHref: "#check",
  },
] as const;

export type ForkFaqId = (typeof forkFaqCards)[number]["id"];
