import { LanguageToggle } from "@/components/brand/LanguageToggle";
import { Wordmark } from "@/components/brand/Wordmark";
import { PageSectionNav } from "@/components/layout/PageSectionNav";
import { forkSections } from "@/content/fork/fork-sections";
import { getCopy } from "@/i18n";
import type { Locale } from "@/i18n/locales";

const mainSiteUrl = import.meta.env.PUBLIC_MAIN_SITE_URL || "https://augur.net";

const socialLinks = [
  { href: "https://x.com/AugurProject", label: "X" },
  { href: "https://discord.gg/Y3tCZsSmz3", label: "Discord" },
  { href: "https://github.com/AugurProject/", label: "GitHub" },
] as const;

type SiteHeaderProps = {
  locale: Locale;
};

export function SiteHeader({ locale }: SiteHeaderProps) {
  const copy = getCopy(locale);
  const sections = forkSections.map((section) => ({
    href: section.href,
    id: section.id,
    label: copy.nav.sectionLabels[section.id],
  }));

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
              locale={locale}
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 md:justify-end">
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
            <div className="border-l border-primary/15 pl-5">
              <LanguageToggle locale={locale} />
            </div>
          </div>
        </div>

        <PageSectionNav locale={locale} sections={sections} />
      </div>
    </header>
  );
}
