import {
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
  useState,
} from "react";
import { getCopy } from "@/i18n";
import type { Locale } from "@/i18n/locales";
import { SafetyDialog } from "./SafetyDialog";

type ExternalLinkWithWarningProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "rel" | "target"
> & {
  children: ReactNode;
  href: string;
  locale: Locale;
};

export function ExternalLinkWithWarning({
  children,
  href,
  locale,
  onClick,
  ...anchorProps
}: ExternalLinkWithWarningProps) {
  const [isWarningVisible, setIsWarningVisible] = useState(false);
  const copy = getCopy(locale).externalLink;

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);

    if (event.defaultPrevented) {
      return;
    }

    event.preventDefault();
    setIsWarningVisible(true);
  }

  function handleConfirm() {
    setIsWarningVisible(false);
    window.open(href, "_blank", "noopener,noreferrer");
  }

  return (
    <>
      <a {...anchorProps} href={href} onClick={handleClick}>
        {children}
      </a>

      <SafetyDialog
        confirmLabel={copy.confirmLabel}
        description={
          <>
            <p className="border border-primary/35 bg-primary/10 px-3 py-3 text-sm leading-6 text-loud-foreground">
              {copy.warningPrimary}
            </p>
            <p className="border border-primary/35 bg-primary/10 px-3 py-3 text-sm leading-6 text-loud-foreground">
              {copy.warningSecondary}
            </p>
            <p className="break-all border border-primary/10 bg-foreground/5 px-3 py-3 font-mono text-xs leading-5 text-muted-foreground">
              {href}
            </p>
          </>
        }
        locale={locale}
        onCancel={() => setIsWarningVisible(false)}
        onConfirm={handleConfirm}
        open={isWarningVisible}
        title={copy.title}
      />
    </>
  );
}
