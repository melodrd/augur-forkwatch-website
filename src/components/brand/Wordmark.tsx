import { getCopy } from "@/i18n";
import type { Locale } from "@/i18n/locales";
import { withBase } from "@/lib/utils";

type WordmarkProps = {
  className?: string;
  accentClassName?: string;
  locale?: Locale;
};

export function Wordmark({
  className = "",
  accentClassName = "text-primary",
  locale = "en",
}: WordmarkProps) {
  const homeHref = locale === "ko" ? withBase("/ko/") : withBase("/");

  return (
    <a
      aria-label={getCopy(locale).wordmark.homeAriaLabel}
      className={`group inline-flex items-baseline font-display text-3xl uppercase leading-none text-foreground transition hover:text-loud-foreground focus-visible:text-loud-foreground ${className}`}
      href={homeHref}
    >
      <span className={`mr-2 transition ${accentClassName}`}>&gt;_</span>
      <span>Fork</span>
      <span className={`ml-1 transition ${accentClassName}`}>Watch</span>
    </a>
  );
}
