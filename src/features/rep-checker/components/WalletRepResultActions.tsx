import { useState } from "react";
import { ExternalLinkWithWarning } from "@/components/ui/ExternalLinkWithWarning";
import { SafetyDialog } from "@/components/ui/SafetyDialog";
import {
  OFFICIAL_MIGRATION_GUIDE_URL,
  OFFICIAL_MIGRATION_PAGE_URL,
} from "@/domain/migration/migration.constants";
import { getCopy } from "@/i18n";
import type { Locale } from "@/i18n/locales";
import type { WalletRepResultKind } from "../rep-checker.types";

type WalletRepResultActionsProps = {
  kind: WalletRepResultKind;
  locale: Locale;
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
  locale,
  onCheckAnother,
}: WalletRepResultActionsProps) {
  const copy = getCopy(locale).repChecker;
  const [isGuideWarningVisible, setIsGuideWarningVisible] = useState(false);
  const showMigrationLinks = shouldShowGuide(kind);
  const guideWarnings = [
    copy.guideWarning.verifyUrl,
    copy.guideWarning.neverShareSecrets,
    copy.guideWarning.startFromBookmark,
  ];

  function handleConfirmGuide() {
    setIsGuideWarningVisible(false);
    window.open(OFFICIAL_MIGRATION_GUIDE_URL, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="mt-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {showMigrationLinks ? (
          <button
            className="btn-terminal-secondary min-h-10 px-4 py-2"
            onClick={() => setIsGuideWarningVisible(true)}
            type="button"
          >
            {copy.actions.migrationInstructions}
          </button>
        ) : null}
        <button
          className="btn-terminal-secondary min-h-10 px-4 py-2"
          onClick={onCheckAnother}
          type="button"
        >
          {copy.actions.checkAnother}
        </button>
        {showMigrationLinks ? (
          <ExternalLinkWithWarning
            className="btn-terminal-primary min-h-10 px-4 py-2"
            href={OFFICIAL_MIGRATION_PAGE_URL}
            locale={locale}
          >
            {copy.actions.migrationWebsite}
          </ExternalLinkWithWarning>
        ) : null}
      </div>

      <SafetyDialog
        confirmLabel={copy.guideDialog.confirmLabel}
        description={guideWarnings.map((message) => (
          <p
            className="border border-primary/35 bg-primary/10 px-3 py-3 text-sm leading-6 text-loud-foreground"
            key={message}
          >
            {message}
          </p>
        ))}
        eyebrow={copy.guideDialog.eyebrow}
        locale={locale}
        onCancel={() => setIsGuideWarningVisible(false)}
        onConfirm={handleConfirmGuide}
        open={isGuideWarningVisible}
        title={copy.guideDialog.title}
      />
    </div>
  );
}
