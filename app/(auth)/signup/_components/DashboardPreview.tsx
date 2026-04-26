import { dashKpis } from "./signup-data";

export function DashboardPreview() {
  return (
    <div className="dash-preview relative mb-10 p-4">
      <div className="mb-3 flex items-center gap-2 border-b border-[var(--rule-soft)] pb-3">
        <div className="flex gap-[5px]">
          <span className="size-2 rounded-full bg-[var(--rule)]" />
          <span className="size-2 rounded-full bg-[var(--rule)]" />
          <span className="size-2 rounded-full bg-[var(--rule)]" />
        </div>
        <span className="ml-1.5 font-mono text-[10px] tracking-[0.03em] text-[var(--muted)]">
          app.loom.co / overview
        </span>
      </div>
      <div className="font-display mb-2.5 text-base font-normal tracking-[-0.01em]">
        Good morning, <em className="italic text-[var(--accent)]">Emma.</em>
      </div>
      <div className="mb-2.5 grid grid-cols-3 gap-1.5">
        {dashKpis.map((kpi) => (
          <div key={kpi.label} className="rounded-lg bg-[var(--paper-2)] px-2.5 py-2">
            <div className="font-mono text-[8px] uppercase tracking-[0.1em] text-[var(--muted)]">
              {kpi.label}
            </div>
            <div className="font-display mt-0.5 text-[14px] font-normal tracking-[-0.02em] tabular-nums">
              {kpi.value}
            </div>
            <div
              className={`mt-0.5 font-mono text-[9px] ${
                kpi.negative ? "text-[var(--accent)]" : "text-[var(--moss)]"
              }`}
            >
              {kpi.delta}
            </div>
          </div>
        ))}
      </div>
      <div className="h-20 rounded-lg bg-[var(--paper-2)] px-3 pb-1.5 pt-2.5">
        <div className="mb-1 flex items-center justify-between">
          <strong className="font-display text-[11px] font-normal tracking-[-0.01em]">
            Revenue · 30d
          </strong>
          <span className="font-mono text-[8px] uppercase tracking-[0.08em] text-[var(--muted)]">
            daily
          </span>
        </div>
        <svg width="100%" height="52" viewBox="0 0 260 52" preserveAspectRatio="none">
          <defs>
            <linearGradient id="signup-spark" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#B93A1D" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#B93A1D" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,40 L20,36 L40,38 L60,30 L80,33 L100,26 L120,28 L140,22 L160,24 L180,18 L200,20 L220,14 L240,16 L260,10 L260,52 L0,52 Z"
            fill="url(#signup-spark)"
          />
          <path
            d="M0,40 L20,36 L40,38 L60,30 L80,33 L100,26 L120,28 L140,22 L160,24 L180,18 L200,20 L220,14 L240,16 L260,10"
            fill="none"
            stroke="#B93A1D"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
