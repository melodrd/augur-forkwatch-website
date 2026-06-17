import { useEffect, useRef, useState } from "react";

type ExchangeSupportDisclosureProps = {
  body: string;
  title: string;
};

export function ExchangeSupportDisclosure({
  body,
  title,
}: ExchangeSupportDisclosureProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="absolute right-3 top-3" ref={rootRef}>
      <button
        aria-expanded={isOpen}
        aria-label={`Explain: ${title}`}
        className="flex size-8 cursor-pointer items-center justify-center border border-current/35 bg-background/80 font-display text-xl uppercase leading-none outline-none transition hover:border-current hover:bg-background hover:text-current focus-visible:border-current"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        ?
      </button>
      {isOpen ? (
        <div className="absolute right-0 top-10 z-40 w-[min(19rem,calc(100vw-2rem))] border border-primary/25 bg-background/95 p-3 text-foreground shadow-xl shadow-black/35 backdrop-blur">
          <p className="text-sm leading-6 text-foreground/85">{body}</p>
        </div>
      ) : null}
    </div>
  );
}
