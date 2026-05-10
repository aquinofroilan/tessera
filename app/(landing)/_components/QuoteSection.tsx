export function QuoteSection() {
    return (
        <section className="px-0 pt-10 pb-30">
            <div className="mx-auto w-full max-w-310 px-7">
                <blockquote
                    className="font-display reveal mx-auto max-w-[22ch] text-center text-[clamp(32px,4.8vw,58px)] leading-[1.12] font-[320] tracking-[-0.025em] italic"
                    data-reveal>
                    <span className="text-(--accent)">“</span>We replaced QuickBooks, Monday, ShipStation, and two
                    spreadsheets in a weekend. Our month-end went from <em>nine days to two.</em>
                    <span className="text-(--accent)">”</span>
                </blockquote>
                <p
                    className="reveal mt-9 text-center font-mono text-xs tracking-[0.1em] text-(--ink-soft) uppercase"
                    data-reveal>
                    Emma Voss · COO, Hollis & Dray Millwork
                </p>
            </div>
        </section>
    );
}
