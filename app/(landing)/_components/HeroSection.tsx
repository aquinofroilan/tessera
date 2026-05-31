import Link from "next/link";
import { IconCheck } from "@tabler/icons-react";
import { Button } from "@/components/ui";
import { trustedCompanies } from "./landing-data";

export function HeroSection() {
    return (
        <section className="relative px-0 pt-18 pb-16" data-hero>
            <div className="mx-auto w-full max-w-310 px-7">
                <div
                    className="reveal mb-7 inline-flex items-center gap-2.5 font-mono text-xs tracking-[0.12em] text-(--ink-soft) uppercase"
                    data-reveal>
                    <span className="block size-1.75 animate-[pulse_2.4s_ease-in-out_infinite] rounded-full bg-(--moss) shadow-[0_0_0_4px_rgba(61,90,58,0.18)]" />
                    Tessera v4.2 · Shipped this week
                </div>

                <h1
                    className="font-display reveal max-w-[14ch] text-[clamp(48px,8.2vw,112px)] leading-[0.98] font-[330] tracking-[-0.035em]"
                    data-reveal>
                    Software for running the <em className="font-[320] text-(--accent) italic">whole shop.</em>
                </h1>

                <p className="reveal mt-8 max-w-140 text-[19px] leading-[1.55] text-(--ink-soft)" data-reveal>
                    Tessera is a modern ERP for small and mid-sized businesses.{" "}
                    <b className="text-foreground font-medium">
                        Sales, inventory, accounting, HR, manufacturing, and projects
                    </b>{" "}
                    - all in one place, all in one database, all priced like a grown-up.
                </p>

                <div className="reveal mt-9 flex flex-wrap items-center gap-3.5" data-reveal>
                    <Button asChild variant="pill" size="pill">
                        <Link href="/signup">Start a 30-day trial →</Link>
                    </Button>
                    <Button asChild variant="pill-outline" size="pill">
                        <Link href="#">Watch the 4-min tour</Link>
                    </Button>
                </div>

                <div className="reveal mt-5.5 flex flex-wrap gap-5 text-[13px] text-(--muted)" data-reveal>
                    {[
                        "No credit card",
                        "Free migration from QuickBooks, NetSuite & SAP B1",
                        "Self-host or managed cloud",
                    ].map((text) => (
                        <span key={text} className="inline-flex items-center gap-2">
                            <IconCheck className="size-3.5" />
                            {text}
                        </span>
                    ))}
                </div>
            </div>

            <div className="mx-auto mt-20 w-full max-w-310 px-7">
                <div className="border-border overflow-hidden border-y py-4.5">
                    <p className="mb-3.5 text-center font-mono text-[11px] tracking-[0.15em] text-(--muted) uppercase">
                        Running the books of 4,200+ companies - from 3-person shops to 500-person plants
                    </p>
                    <div className="marquee-track font-display flex w-max gap-18 text-[22px] whitespace-nowrap text-(--ink-soft) italic opacity-70">
                        {[...trustedCompanies, ...trustedCompanies].map((company, index) => (
                            <span
                                key={`${company}-${index}`}
                                className="inline-flex items-center gap-2 before:text-sm before:text-(--accent) before:content-['✦']">
                                {company}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
