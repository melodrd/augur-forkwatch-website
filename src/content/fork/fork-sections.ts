export const forkSections = [
  { href: "#overview", id: "overview" },
  { href: "#result", id: "result" },
  { href: "#scam-warning", id: "scam-warning" },
  { href: "#exchange-support", id: "exchange-support" },
  { href: "#check", id: "check" },
] as const;

export type ForkSectionId = (typeof forkSections)[number]["id"];
