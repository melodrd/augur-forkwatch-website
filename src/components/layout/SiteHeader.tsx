import { Wordmark } from "@/components/brand/Wordmark";
import {
  PageSectionNav,
  type SectionNavItem,
} from "@/components/layout/PageSectionNav";

const mainSiteUrl = import.meta.env.PUBLIC_MAIN_SITE_URL || "https://augur.net";

const socialLinks = [
  { href: "https://x.com/AugurProject", label: "X" },
  { href: "https://discord.gg/Y3tCZsSmz3", label: "Discord" },
  { href: "https://github.com/AugurProject/", label: "GitHub" },
] as const;

type SiteHeaderProps = {
  sectionNavLabel?: string;
  sections?: readonly SectionNavItem[];
};

export function SiteHeader({ sectionNavLabel, sections }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-primary/10 bg-background/90 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid min-h-16 gap-3 py-4 md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-4 md:py-3">
          <div className="flex justify-center md:justify-start">
            <a
              className="font-display text-lg uppercase leading-none text-foreground transition hover:text-loud-foreground hover:fx-glow focus-visible:text-loud-foreground focus-visible:fx-glow"
              href={mainSiteUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              augur.net
            </a>
          </div>

          <div className="flex justify-center">
            <Wordmark
              accentClassName="text-[#2AE7A8]"
              className="shrink-0 text-4xl text-[#2AE7A8] hover:text-[#2AE7A8] focus-visible:text-[#2AE7A8]"
            />
          </div>

          <div className="flex justify-center md:justify-end">
            <div className="flex gap-x-5">
              {socialLinks.map((link) => (
                <a
                  className="header-social font-display text-lg uppercase leading-none text-foreground transition hover:text-loud-foreground hover:fx-glow focus-visible:text-loud-foreground focus-visible:fx-glow"
                  href={link.href}
                  key={link.href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {sections?.length ? (
          <PageSectionNav ariaLabel={sectionNavLabel} sections={sections} />
        ) : null}
      </div>
    </header>
  );
}
