import { getCopy } from "@/i18n";
import type { Locale } from "@/i18n/locales";
import { withBase } from "@/lib/utils";
import { KoreanFlag } from "./KoreanFlag";
import { USFlag } from "./USFlag";

type LanguageToggleProps = {
  locale: Locale;
};

const linkBaseClassName =
  "inline-flex items-center p-1 leading-none transition";
const activeClassName = "fx-glow";
const inactiveClassName = "opacity-60 hover:opacity-100";

export function LanguageToggle({ locale }: LanguageToggleProps) {
  const { languageToggle } = getCopy(locale);

  return (
    <nav
      aria-label={languageToggle.ariaLabel}
      className="flex items-center gap-2"
    >
      <a
        aria-current={locale === "en" ? "true" : undefined}
        aria-label={languageToggle.englishLabel}
        className={`${linkBaseClassName} ${
          locale === "en" ? activeClassName : inactiveClassName
        }`}
        href={withBase("/")}
      >
        <USFlag
          className="h-4 w-auto shrink-0"
          title={languageToggle.usFlagLabel}
        />
      </a>
      <span aria-hidden="true" className="text-primary/40">
        |
      </span>
      <a
        aria-current={locale === "ko" ? "true" : undefined}
        aria-label={languageToggle.koreanLabel}
        className={`${linkBaseClassName} ${
          locale === "ko" ? activeClassName : inactiveClassName
        }`}
        href={withBase("/ko/")}
      >
        <KoreanFlag
          className="h-4 w-auto shrink-0"
          title={languageToggle.koreanFlagLabel}
        />
      </a>
    </nav>
  );
}
