import { withBase } from "@/lib/utils";

type WordmarkProps = {
  className?: string;
  accentClassName?: string;
};

export function Wordmark({
  className = "",
  accentClassName = "text-primary",
}: WordmarkProps) {
  return (
    <a
      aria-label="ForkWatch home"
      className={`group inline-flex items-baseline font-display text-3xl uppercase leading-none text-foreground transition hover:text-loud-foreground focus-visible:text-loud-foreground ${className}`}
      href={withBase("/")}
    >
      <span className={`mr-2 transition ${accentClassName}`}>&gt;_</span>
      <span>Fork</span>
      <span className={`ml-1 transition ${accentClassName}`}>Watch</span>
    </a>
  );
}
