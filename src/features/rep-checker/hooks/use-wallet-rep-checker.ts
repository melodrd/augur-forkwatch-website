import { type SyntheticEvent, useEffect, useRef, useState } from "react";
import { getCopy } from "@/i18n";
import type { Locale } from "@/i18n/locales";
import { checkWalletRep } from "../rep-checker.client";
import { normalizeAddressInput } from "../rep-checker.helpers";
import type { RepBalanceCheckResponse } from "../rep-checker.types";

export type WalletRepCheckerStatus = "idle" | "checking" | "success" | "error";

function createFallbackError(
  address: string,
  rpcErrorMessage: string,
): RepBalanceCheckResponse {
  return {
    address,
    checkedAt: new Date().toISOString(),
    message: rpcErrorMessage,
    status: "error",
  };
}

export function useWalletRepChecker(locale: Locale = "en") {
  const messages = getCopy(locale).repChecker.messages;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const requestIdRef = useRef(0);
  const resultContainerRef = useRef<HTMLDivElement | null>(null);
  const [addressInput, setAddressInput] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [status, setStatus] = useState<WalletRepCheckerStatus>("idle");
  const [result, setResult] = useState<RepBalanceCheckResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isChecking = status === "checking";

  useEffect(() => {
    if (isChecking || !result) {
      return;
    }

    const container = resultContainerRef.current;

    if (!container) {
      return;
    }

    const rect = container.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const topOffset = 96;
    const bottomOffset = 24;
    const isAboveViewport = rect.top < topOffset;
    const isBelowViewport = rect.bottom > viewportHeight - bottomOffset;

    if (!isAboveViewport && !isBelowViewport) {
      return;
    }

    container.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [isChecking, result]);

  function setAddressInputValue(nextAddress: string) {
    setAddressInput(nextAddress);

    if (fieldError) {
      setFieldError(null);
    }
  }

  async function submit(event?: SyntheticEvent<HTMLFormElement>) {
    event?.preventDefault();
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    const normalizedInput = normalizeAddressInput(
      addressInput,
      messages.invalidAddress,
    );

    if (!normalizedInput.ok) {
      setFieldError(normalizedInput.message);
      setResult(null);
      setError(null);
      setStatus("idle");
      inputRef.current?.focus();
      return;
    }

    setStatus("checking");
    setFieldError(null);
    setResult(null);
    setError(null);

    try {
      const response = await checkWalletRep(normalizedInput.address, {
        messages,
      });
      if (requestIdRef.current !== requestId) {
        return;
      }

      setResult(response);
      setStatus("success");
    } catch (requestError) {
      if (requestIdRef.current !== requestId) {
        return;
      }

      const message =
        requestError instanceof Error
          ? requestError.message
          : messages.rpcError;
      setError(message);
      setResult(
        createFallbackError(normalizedInput.address, messages.rpcError),
      );
      setStatus("error");
    }
  }

  function reset() {
    requestIdRef.current += 1;
    setAddressInput("");
    setFieldError(null);
    setResult(null);
    setError(null);
    setStatus("idle");
    inputRef.current?.focus();
  }

  return {
    addressInput,
    error,
    fieldError,
    inputRef,
    isChecking,
    result,
    resultContainerRef,
    setAddressInput: setAddressInputValue,
    status,
    submit,
    reset,
  };
}
