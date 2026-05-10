export function PricingSection() {
    return (
        <section id="pricing" className="px-0 pt-0 pb-24">
            <div className="mx-auto w-full max-w-310 px-7">
                <div className="bg-foreground text-background relative grid gap-14 overflow-hidden rounded-3xl px-7 py-12 lg:grid-cols-[1.2fr_1fr] lg:px-14 lg:py-18">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_300px_at_110%_20%,rgba(185,58,29,0.4),transparent_60%)]" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-2.5 font-mono text-xs tracking-[0.15em] text-[#F0A090] uppercase before:block before:h-px before:w-6 before:bg-[#F0A090]">
                            Pricing
                        </div>
                        <h2 className="font-display mt-3 mb-4 text-[clamp(36px,4.6vw,56px)] leading-[1.04] font-[330] tracking-[-0.03em]">
                            One flat price. <em className="text-[#F0A090] italic">No per-seat games.</em>
                        </h2>
                        <p className="mb-2 max-w-[42ch] text-[17px] text-[rgba(246,241,230,0.7)]">
                            Most ERPs punish you for growing - every new hire is another $95/month. We think that&apos;s
                            a lousy way to run a relationship. Pay one price, invite everyone in the company, and get on
                            with your work.
                        </p>
                        <p className="mt-4.5 max-w-[42ch] text-[17px] text-[rgba(246,241,230,0.7)]">
                            Includes all modules. Unlimited users. Unlimited companies. Unlimited support from people
                            who&apos;ve shipped real product.
                        </p>
                    </div>

                    <div className="bg-background text-foreground relative z-10 rounded-[18px] p-8 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.5)]">
                        <div className="font-mono text-[11px] tracking-[0.12em] text-(--accent) uppercase">
                            Loom Business
                        </div>
                        <div className="my-4 flex items-baseline gap-2">
                            <span className="font-display text-7xl leading-none font-[350] tracking-[-0.04em]">
                                $349
                            </span>
                            <span className="text-sm text-(--muted)">/ month, flat</span>
                        </div>
                        <p className="mb-4.5 text-sm text-(--ink-soft)">
                            For the whole company. Billed annually at $3,990.
                        </p>

                        <ul className="border-border my-4 list-none border-y py-4">
                            {[
                                "All 8 modules included",
                                "Unlimited users & roles",
                                "Up to 3 legal entities",
                                "Open API + Python SDK",
                                "Migration assistance, on us",
                                "30-day full-refund trial",
                            ].map((item) => (
                                <li
                                    key={item}
                                    className="flex items-start gap-2.5 py-1.5 text-sm text-(--ink-soft) before:font-mono before:text-(--accent) before:content-['→']">
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <a
                            href="#"
                            className="bg-foreground text-background inline-flex w-full justify-center rounded-full px-5 py-3.5 text-sm font-medium transition-all hover:-translate-y-px hover:bg-(--accent)">
                            Start your trial →
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
