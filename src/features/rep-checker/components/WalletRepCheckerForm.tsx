import { type RefObject, type SyntheticEvent, useId } from "react";

type WalletRepCheckerFormProps = {
  addressInput: string;
  fieldError: string | null;
  inputRef: RefObject<HTMLInputElement | null>;
  isChecking: boolean;
  onAddressInputChange: (address: string) => void;
  onSubmit: (event: SyntheticEvent<HTMLFormElement>) => void;
};

export function WalletRepCheckerForm({
  addressInput,
  fieldError,
  inputRef,
  isChecking,
  onAddressInputChange,
  onSubmit,
}: WalletRepCheckerFormProps) {
  const inputId = useId();
  const errorId = useId();
  const describedBy = fieldError ? errorId : undefined;

  return (
    <form
      className="mt-4 border border-primary/10 bg-background/70 p-3 sm:p-4"
      onSubmit={onSubmit}
    >
      <div className="grid gap-x-3 gap-y-2 lg:grid-cols-[minmax(0,1fr)_8.5rem]">
        <label
          className="font-display text-lg uppercase leading-none text-muted-foreground"
          htmlFor={inputId}
        >
          Ethereum address
        </label>
        <input
          aria-describedby={describedBy}
          aria-invalid={Boolean(fieldError)}
          autoComplete="off"
          className="terminal-input block h-10 w-full px-3 font-mono text-sm outline-none transition lg:col-start-1 lg:row-start-2"
          disabled={isChecking}
          id={inputId}
          onChange={(event) => onAddressInputChange(event.target.value)}
          placeholder="0x..."
          ref={inputRef}
          spellCheck={false}
          type="text"
          value={addressInput}
        />
        {fieldError ? (
          <p className="text-sm leading-6 text-red lg:col-start-1" id={errorId}>
            {fieldError}
          </p>
        ) : null}
        <button
          aria-busy={isChecking}
          className="btn-terminal-primary h-10 px-3 disabled:cursor-not-allowed disabled:border-primary/10 disabled:bg-foreground/5 disabled:text-muted-foreground lg:col-start-2 lg:row-start-2"
          disabled={isChecking}
          type="submit"
        >
          {isChecking ? "Checking..." : "Check REP"}
        </button>
      </div>
    </form>
  );
}
