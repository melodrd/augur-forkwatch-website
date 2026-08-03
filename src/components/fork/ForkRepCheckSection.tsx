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
      <p className="border border-primary/20 bg-primary/5 px-4 py-3 text-sm leading-6 text-foreground/80">
        {copy.archiveNotice}
      </p>
      <WalletRepChecker locale={locale} showTitle={false} />
    </section>
  );
}
