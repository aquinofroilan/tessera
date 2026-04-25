export function QuoteSection() {
  return (
    <section className="px-0 pb-[120px] pt-10">
      <div className="mx-auto w-full max-w-[1240px] px-7">
        <blockquote
          className="font-display reveal mx-auto max-w-[22ch] text-center text-[clamp(32px,4.8vw,58px)] leading-[1.12] font-[320] italic tracking-[-0.025em]"
          data-reveal
        >
          <span className="text-[var(--accent)]">“</span>We replaced QuickBooks, Monday, ShipStation, and two
          spreadsheets in a weekend. Our month-end went from <em>nine days to two.</em>
          <span className="text-[var(--accent)]">”</span>
        </blockquote>
        <p
          className="reveal mt-9 text-center font-mono text-xs uppercase tracking-[0.1em] text-[var(--ink-soft)]"
          data-reveal
        >
          Emma Voss · COO, Hollis & Dray Millwork
        </p>
      </div>
    </section>
  );
}
