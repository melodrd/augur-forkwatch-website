import { useState } from "react";
import { SafetyDialog } from "@/components/ui/SafetyDialog";
import { OFFICIAL_MIGRATION_GUIDE_URL } from "@/domain/migration/migration.constants";
import { REP_CHECKER_GUIDE_WARNING } from "../rep-checker.copy";
import type { WalletRepResultKind } from "../rep-checker.types";

type WalletRepResultActionsProps = {
  kind: WalletRepResultKind;
  onCheckAnother: () => void;
};

function shouldShowGuide(kind: WalletRepResultKind): boolean {
  return (
    kind === "both" ||
    kind === "none" ||
    kind === "partial" ||
    kind === "repv1" ||
    kind === "repv2" ||
    kind === "repv2Yes1"
  );
}

export function WalletRepResultActions({
  kind,
  onCheckAnother,
}: WalletRepResultActionsProps) {
  const [isGuideWarningVisible, setIsGuideWarningVisible] = useState(false);

  function handleConfirmGuide() {
    setIsGuideWarningVisible(false);
    window.open(OFFICIAL_MIGRATION_GUIDE_URL, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="mt-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {shouldShowGuide(kind) ? (
          <button
            className="btn-terminal-primary min-h-10 px-4 py-2"
            onClick={() => setIsGuideWarningVisible(true)}
            type="button"
          >
            Open official migration guide
          </button>
        ) : null}
        <button
          className="btn-terminal-secondary min-h-10 px-4 py-2"
          onClick={onCheckAnother}
          type="button"
        >
          Check another address
        </button>
      </div>

      <SafetyDialog
        confirmLabel="I understand"
        description={REP_CHECKER_GUIDE_WARNING.map((message) => (
          <p
            className="border border-primary/35 bg-primary/10 px-3 py-3 text-sm leading-6 text-loud-foreground"
            key={message}
          >
            {message}
          </p>
        ))}
        eyebrow=">_ Scam check"
        onCancel={() => setIsGuideWarningVisible(false)}
        onConfirm={handleConfirmGuide}
        open={isGuideWarningVisible}
        title="Pause and verify before connecting"
      />
    </div>
  );
}
