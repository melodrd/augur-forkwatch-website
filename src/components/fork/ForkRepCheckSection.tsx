import { SectionHeader } from "@/components/ui/SectionHeader";
import { WalletRepChecker } from "@/features/rep-checker/components/WalletRepChecker";
import { getCopy } from "@/i18n";
import type { Locale } from "@/i18n/locales";

type ForkRepCheckSectionProps = {
  locale: Locale;
};

export function ForkRepCheckSection({ locale }: ForkRepCheckSectionProps) {
  const copy = getCopy(locale).repChecker;

  return (
    <section
      aria-labelledby="check-title"
      className="scroll-mt-36 space-y-4"
      id="check"
    >
      <SectionHeader
        eyebrow={copy.sectionEyebrow}
        id="check-title"
        title={copy.sectionTitle}
      />
      <WalletRepChecker locale={locale} showTitle={false} />
    </section>
  );
}
