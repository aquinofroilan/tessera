import type { ReactNode } from "react";

export type EditorialQuote = {
  body: string;
  emphasis: string;
};

export type EditorialAttribution = {
  initials: string;
  name: string;
  role: string;
  /** Raw CSS gradient string, e.g. `"linear-gradient(135deg, var(--plum), var(--accent))"`. */
  gradient: string;
};

export type EditorialFloatingStat = {
  label: string;
  value: string;
};

export type EditorialListItem = {
  title: string;
  detail: string;
};

export type EditorialPanelProps = {
  statusChip: ReactNode;
  kicker: string;
  quote: EditorialQuote;
  attribution: EditorialAttribution;
  /** First entry drifts upward (top-right), second drifts downward (mid-right). */
  floatingStats?: EditorialFloatingStat[];
  /** Radial wash backgrounds. Pass full `background` CSS values. */
  washes?: {
    topRight: string;
    bottomLeft: string;
  };
  /** Slotted dashboard / mock preview rendered between the attribution and the list. */
  dashboard?: ReactNode;
  list: {
    label: string;
    items: EditorialListItem[];
  };
  securityFooter?: ReactNode;
};

const defaultWashes = {
  topRight: "radial-gradient(circle, rgb(185 58 29 / 28%) 0%, transparent 60%)",
  bottomLeft: "radial-gradient(circle, rgb(62 106 140 / 18%) 0%, transparent 60%)",
};

const driftPositionClass = [
  "right-[8%] top-[28%] animate-[drift1_8s_ease-in-out_infinite]",
  "right-[18%] top-[62%] animate-[drift2_10s_ease-in-out_infinite]",
];

function CheckMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M20 6L9 17l-5-5" fill="none" stroke="currentColor" strokeWidth="2.4" />
    </svg>
  );
}

export function EditorialPanel({
  statusChip,
  kicker,
  quote,
  attribution,
  floatingStats = [],
  washes = defaultWashes,
  dashboard,
  list,
  securityFooter = (
    <>
      <span>SOC 2 Type II · GDPR · CCPA</span>
      <a href="#" className="text-inherit no-underline hover:text-[var(--paper)]">
        Read our security note →
      </a>
    </>
  ),
}: EditorialPanelProps) {
  return (
    <aside className="relative flex flex-col overflow-hidden bg-[var(--ink)] px-7 pb-10 pt-7 text-[var(--paper)] md:px-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[200px] -top-[200px] z-0 size-[600px] rounded-full"
        style={{ background: washes.topRight }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[150px] -left-[150px] z-0 size-[500px] rounded-full"
        style={{ background: washes.bottomLeft }}
      />
      <div className="signup-right-grain" aria-hidden="true" />

      {floatingStats.slice(0, 2).map((stat, i) => (
        <div
          key={stat.label}
          aria-hidden="true"
          className={`pointer-events-none absolute z-[3] hidden rounded-[10px] border border-[var(--rule-dark)] bg-[rgb(246_241_230_/_8%)] px-3.5 py-2.5 backdrop-blur-md xl:block ${driftPositionClass[i]}`}
        >
          <div className="font-mono text-[9px] uppercase tracking-[0.1em] text-[rgb(246_241_230_/_55%)]">
            {stat.label}
          </div>
          <div className="font-display mt-0.5 text-lg font-normal tracking-[-0.02em] tabular-nums text-[var(--paper)]">
            {stat.value}
          </div>
        </div>
      ))}

      <header className="relative z-[2] mb-10 flex justify-end">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--rule-dark)] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-[rgb(246_241_230_/_70%)]">
          <span className="size-1.5 rounded-full bg-[var(--moss)] shadow-[0_0_0_3px_rgb(61_90_58_/_30%)] animate-[pulse_2.4s_ease-in-out_infinite]" />
          {statusChip}
        </div>
      </header>

      <div className="relative z-[2] mx-auto flex w-full max-w-[500px] flex-1 flex-col justify-center">
        <div className="mb-7 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent-light)] before:h-px before:w-6 before:bg-[var(--accent-light)] before:content-['']">
          {kicker}
        </div>

        <blockquote className="font-display mb-5 text-[38px] leading-[1.08] font-[320] italic tracking-[-0.025em] text-[var(--paper)] max-[1100px]:text-[32px] max-sm:text-[28px]">
          <span className="not-italic text-[var(--accent-light)]">“</span>
          {quote.body}{" "}
          <em className="italic text-[var(--accent-light)]">{quote.emphasis}</em>
          <span className="not-italic text-[var(--accent-light)]">”</span>
        </blockquote>

        <div className="mb-12 flex items-center gap-3">
          <div
            className="font-display grid size-[38px] place-items-center rounded-full text-[15px] font-medium text-[var(--paper)] shadow-[inset_0_0_0_2px_rgb(255_255_255_/_20%)]"
            style={{ background: attribution.gradient }}
          >
            {attribution.initials}
          </div>
          <div>
            <div className="text-sm font-medium tracking-[-0.005em] text-[var(--paper)]">
              {attribution.name}
            </div>
            <div className="mt-0.5 font-mono text-[11px] tracking-[0.05em] text-[rgb(246_241_230_/_60%)]">
              {attribution.role}
            </div>
          </div>
        </div>

        {dashboard}

        <div className="grid gap-3">
          <div className="mb-1.5 border-b border-[var(--rule-dark)] pb-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[rgb(246_241_230_/_50%)]">
            {list.label}
          </div>
          {list.items.map((item) => (
            <div key={item.title} className="flex items-center gap-3 text-sm text-[rgb(246_241_230_/_90%)]">
              <span className="grid size-[22px] flex-none place-items-center rounded-full bg-[rgb(61_90_58_/_20%)] text-[#8FB58B]">
                <CheckMark className="h-3 w-3" />
              </span>
              <span>
                <strong className="font-medium text-[var(--paper)]">{item.title}</strong>{" "}
                <span className="text-[13px] text-[rgb(246_241_230_/_55%)]">{item.detail}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <footer className="relative z-[2] mt-10 flex flex-wrap justify-between gap-3 border-t border-[var(--rule-dark)] pt-5 font-mono text-[11px] tracking-[0.05em] text-[rgb(246_241_230_/_50%)]">
        {securityFooter}
      </footer>
    </aside>
  );
}
