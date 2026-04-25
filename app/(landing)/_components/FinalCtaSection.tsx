export function FinalCtaSection() {
  return (
    <section className="relative border-t border-[var(--rule)] px-0 py-[140px] text-center">
      <div className="mx-auto w-full max-w-[1240px] px-7">
        <h2
          className="font-display reveal mx-auto mb-8 max-w-[14ch] text-[clamp(48px,8vw,120px)] leading-[0.98] font-[320] tracking-[-0.04em]"
          data-reveal
        >
          Run the <em className="italic text-[var(--accent)]">whole shop</em> on Loom.
        </h2>
        <p className="reveal mx-auto mb-9 max-w-[42ch] text-lg text-[var(--ink-soft)]" data-reveal>
          Thirty days, every module, every feature. No card, no sales call, no &quot;let&apos;s hop on a quick demo.&quot;
        </p>
        <div className="reveal" data-reveal>
          <a
            href="#"
            className="inline-flex items-center rounded-full bg-[var(--ink)] px-7 py-4 text-[15px] font-medium text-[var(--paper)] transition-all hover:-translate-y-px hover:bg-[var(--accent)]"
          >
            Start your trial →
          </a>
        </div>
      </div>
    </section>
  );
}
