import { FeaturesSection } from "./_components/FeaturesSection";
import { FinalCtaSection } from "./_components/FinalCtaSection";
import { HeroSection } from "./_components/HeroSection";
import { LandingEffects } from "./_components/LandingEffects";
import { LandingFooter } from "./_components/LandingFooter";
import { LandingNav } from "./_components/LandingNav";
import { ModulesSection } from "./_components/ModulesSection";
import { PricingSection } from "./_components/PricingSection";
import { QuoteSection } from "./_components/QuoteSection";

export default function LandingPage() {
    return (
        <div className="landing-root min-h-screen bg-[var(--paper)] text-[var(--ink)]">
            <LandingNav />
            <main>
                <HeroSection />
                <ModulesSection />
                <FeaturesSection />
                <QuoteSection />
                <PricingSection />
                <FinalCtaSection />
            </main>
            <LandingFooter />
            <LandingEffects />
        </div>
    );
}
