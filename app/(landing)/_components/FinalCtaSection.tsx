import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FinalCtaSection() {
    return (
        <section className="relative border-t border-[var(--rule)] px-0 py-35 text-center">
            <div className="mx-auto w-full max-w-310 px-7">
                <h2
                    className="font-display reveal mx-auto mb-8 max-w-[14ch] text-[clamp(48px,8vw,120px)] leading-[0.98] font-[320] tracking-[-0.04em]"
                    data-reveal>
                    Run the <em className="text-[var(--accent)] italic">whole shop</em> on Loom.
                </h2>
                <p className="reveal mx-auto mb-9 max-w-[42ch] text-lg text-[var(--ink-soft)]" data-reveal>
                    Thirty days, every module, every feature. No card, no sales call, no &quot;let&apos;s hop on a quick
                    demo.&quot;
                </p>
                <div className="reveal" data-reveal>
                    <Button asChild variant="pill" size="pill-lg" className="px-7 py-4">
                        <Link href="/signup">Start your trial →</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
