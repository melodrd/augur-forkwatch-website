import { type ReactNode, useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";

type SafetyDialogProps = {
  cancelLabel?: string;
  confirmLabel: string;
  description: ReactNode;
  eyebrow?: string;
  open: boolean;
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function SafetyDialog({
  cancelLabel = "Cancel",
  confirmLabel,
  description,
  eyebrow = ">_ External link check",
  open,
  title,
  onCancel,
  onConfirm,
}: SafetyDialogProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const previousActiveElement = document.activeElement;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => dialogRef.current?.focus(), 0);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter(
        (element) => !element.hasAttribute("disabled") && element.tabIndex >= 0,
      );

      if (focusableElements.length === 0) {
        event.preventDefault();
        dialogRef.current?.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
        return;
      }

      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      if (previousActiveElement instanceof HTMLElement) {
        previousActiveElement.focus();
      }
    };
  }, [onCancel, open]);

  if (!open || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4 py-6">
      <button
        aria-label={`Close ${title}`}
        className="absolute inset-0 cursor-default bg-background/82"
        onMouseDown={onCancel}
        tabIndex={-1}
        type="button"
      />
      <div
        aria-labelledby={titleId}
        aria-modal="true"
        className="relative z-10 w-full max-w-lg border border-primary/40 bg-background/95 p-5 shadow-2xl shadow-black/45 outline-none"
        ref={dialogRef}
        role="dialog"
        tabIndex={-1}
      >
        <p className="font-display text-xl uppercase leading-none text-muted-foreground">
          {eyebrow}
        </p>
        <h4
          className="mt-2 font-display text-3xl uppercase leading-none text-foreground"
          id={titleId}
        >
          {title}
        </h4>
        <div className="mt-4 space-y-3">{description}</div>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <button
            className="btn-terminal-primary min-h-10 px-4 py-2"
            onClick={onConfirm}
            type="button"
          >
            {confirmLabel}
          </button>
          <button
            className="btn-terminal-secondary min-h-10 px-4 py-2"
            onClick={onCancel}
            type="button"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
