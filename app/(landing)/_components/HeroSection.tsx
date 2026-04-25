import { trustedCompanies } from "./landing-data";
import { CheckIcon } from "./icons";

export function HeroSection() {
  return (
    <section className="relative px-0 pb-16 pt-[72px]" data-hero>
      <div className="mx-auto w-full max-w-[1240px] px-7">
        <div
          className="reveal mb-7 inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.12em] text-[var(--ink-soft)]"
          data-reveal
        >
          <span className="block size-[7px] rounded-full bg-[var(--moss)] shadow-[0_0_0_4px_rgba(61,90,58,0.18)] animate-[pulse_2.4s_ease-in-out_infinite]" />
          Loom v4.2 · Shipped this week
        </div>

        <h1
          className="font-display reveal max-w-[14ch] text-[clamp(48px,8.2vw,112px)] leading-[0.98] font-[330] tracking-[-0.035em]"
          data-reveal
        >
          Software for running the <em className="font-[320] italic text-[var(--accent)]">whole shop.</em>
        </h1>

        <p className="reveal mt-8 max-w-[560px] text-[19px] leading-[1.55] text-[var(--ink-soft)]" data-reveal>
          Loom is a modern ERP for small and mid-sized businesses. <b className="font-medium text-[var(--ink)]">Sales,
          inventory, accounting, HR, manufacturing, and projects</b> - all in one place, all in one database, all priced
          like a grown-up.
        </p>

        <div className="reveal mt-9 flex flex-wrap items-center gap-3.5" data-reveal>
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-[18px] py-2.5 text-sm font-medium text-[var(--paper)] transition-all hover:-translate-y-px hover:bg-[var(--accent)]"
          >
            Start a 30-day trial →
          </a>
          <a
            href="#"
            className="inline-flex items-center rounded-full border border-[var(--ink)] bg-transparent px-[18px] py-2.5 text-sm font-medium transition-all hover:-translate-y-px hover:bg-[var(--ink)] hover:text-[var(--paper)]"
          >
            Watch the 4-min tour
          </a>
        </div>

        <div className="reveal mt-[22px] flex flex-wrap gap-5 text-[13px] text-[var(--muted)]" data-reveal>
          {[
            "No credit card",
            "Free migration from QuickBooks, NetSuite & SAP B1",
            "Self-host or managed cloud",
          ].map((text) => (
            <span key={text} className="inline-flex items-center gap-2">
              <CheckIcon />
              {text}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-20 w-full max-w-[1240px] px-7">
        <div className="overflow-hidden border-y border-[var(--rule)] py-[18px]">
          <p className="mb-3.5 text-center font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--muted)]">
            Running the books of 4,200+ companies - from 3-person shops to 500-person plants
          </p>
          <div className="marquee-track flex w-[max-content] gap-[72px] whitespace-nowrap font-display text-[22px] italic text-[var(--ink-soft)] opacity-70">
            {[...trustedCompanies, ...trustedCompanies].map((company, index) => (
              <span key={`${company}-${index}`} className="inline-flex items-center gap-2 before:text-sm before:text-[var(--accent)] before:content-['✦']">
                {company}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
