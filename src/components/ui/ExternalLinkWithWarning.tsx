import {
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
  useState,
} from "react";
import { SafetyDialog } from "./SafetyDialog";

type ExternalLinkWithWarningProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "rel" | "target"
> & {
  children: ReactNode;
  href: string;
};

export function ExternalLinkWithWarning({
  children,
  href,
  onClick,
  ...anchorProps
}: ExternalLinkWithWarningProps) {
  const [isWarningVisible, setIsWarningVisible] = useState(false);

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
        confirmLabel="Continue to external site"
        description={
          <>
            <p className="border border-primary/35 bg-primary/10 px-3 py-3 text-sm leading-6 text-loud-foreground">
              You are opening an external site. Confirm the domain, HTTPS/TLS
              lock, and official source before connecting a wallet or taking
              action.
            </p>
            <p className="border border-primary/35 bg-primary/10 px-3 py-3 text-sm leading-6 text-loud-foreground">
              Nobody from Augur or Lituus will DM you to help migrate. Never
              enter a seed phrase, private key, or recovery words.
            </p>
            <p className="break-all border border-primary/10 bg-foreground/5 px-3 py-3 font-mono text-xs leading-5 text-muted-foreground">
              {href}
            </p>
          </>
        }
        onCancel={() => setIsWarningVisible(false)}
        onConfirm={handleConfirm}
        open={isWarningVisible}
        title="Pause and verify before leaving ForkWatch"
      />
    </>
  );
}
