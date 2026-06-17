import { useEffect, useState } from "react";
import {
  getMigrationProgressDataUrl,
  parseMigrationProgressPayload,
} from "./migration-progress.helpers";
import type { MigrationProgressLoadState } from "./migration-progress.types";

function errorMessage(error: unknown): string {
  return error instanceof Error && error.message.trim()
    ? error.message
    : "Migration progress data is unavailable.";
}

export function useMigrationProgress(): MigrationProgressLoadState {
  const [state, setState] = useState<MigrationProgressLoadState>({
    error: null,
    progress: null,
    status: "loading",
  });

  useEffect(() => {
    let cancelled = false;

    async function loadMigrationProgress() {
      const baseUrl = import.meta.env.BASE_URL || "/";
      const dataUrl = getMigrationProgressDataUrl(baseUrl);

      try {
        const response = await fetch(dataUrl, { cache: "no-store" });

        if (!response.ok) {
          throw new Error("Migration progress JSON is missing.");
        }

        const payload = (await response.json().catch(() => {
          throw new Error("Migration progress JSON is invalid.");
        })) as unknown;
        const progress = parseMigrationProgressPayload(payload);

        if (!progress) {
          throw new Error("Migration progress JSON has an unexpected shape.");
        }

        if (!cancelled) {
          setState({
            error: null,
            progress,
            status: "ready",
          });
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            error: errorMessage(error),
            progress: null,
            status: "unavailable",
          });
        }
      }
    }

    void loadMigrationProgress();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
