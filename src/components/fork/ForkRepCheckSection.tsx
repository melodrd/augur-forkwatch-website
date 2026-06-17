import { SectionHeader } from "@/components/ui/SectionHeader";
import { WalletRepChecker } from "@/features/rep-checker/components/WalletRepChecker";

export function ForkRepCheckSection() {
  return (
    <section
      aria-labelledby="check-title"
      className="scroll-mt-36 space-y-4"
      id="check"
    >
      <SectionHeader
        eyebrow="REP Checker"
        id="check-title"
        title="Check wallet-held REP"
      />
      <WalletRepChecker showTitle={false} />
    </section>
  );
}
