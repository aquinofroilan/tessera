import type { ReactNode } from "react";

import { featureOneBullets, featureTwoBullets } from "./landing-data";

function FeatureBullets({ items }: { items: string[] }) {
    return (
        <ul className="mt-6 list-none">
            {items.map((item, index) => (
                <li
                    key={item}
                    className={`grid grid-cols-[32px_1fr] gap-3.5 py-3.5 text-[15px] ${
                        index === 0 ? "border-border border-t" : "border-border border-t"
                    } ${index === items.length - 1 ? "border-border border-b" : ""}`}>
                    <span className="text-background grid size-6 place-items-center rounded-full bg-(--moss) text-[13px]">
                        ✓
                    </span>
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    );
}

function DashboardMock() {
    return (
        <div className="mock reveal" data-reveal>
            <div className="border-border flex items-center gap-2 border-b bg-(--paper-2) px-4 py-3">
                <div className="flex gap-1.5">
                    <span className="size-2.5 rounded-full bg-(--rule)" />
                    <span className="size-2.5 rounded-full bg-(--rule)" />
                    <span className="size-2.5 rounded-full bg-(--rule)" />
                </div>
                <span className="ml-2 font-mono text-[11px] text-(--muted)">app.tessera.co / dashboard</span>
            </div>
            <div className="grid min-h-90 gap-5 p-5 md:grid-cols-[120px_1fr]">
                <div className="flex flex-row flex-wrap gap-1.5 md:flex-col">
                    {[
                        ["Overview", true],
                        ["Sales", false],
                        ["Inventory", false],
                        ["Accounting", false],
                        ["HR", false],
                        ["Reports", false],
                    ].map(([name, active]) => (
                        <div
                            key={String(name)}
                            className={`flex items-center gap-2 rounded-lg px-2.5 py-1.75 text-xs ${
                                active ? "bg-background text-foreground font-medium" : "text-(--ink-soft)"
                            }`}>
                            <span className={`size-3.5 rounded bg-(--rule) ${active ? "bg-(--accent)!" : ""}`} />
                            {name}
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-3.5">
                    <div className="font-display text-xl tracking-[-0.01em]">Good morning, Emma 👋</div>
                    <div className="grid gap-2.5 sm:grid-cols-3">
                        {[
                            ["Revenue (MTD)", "$284,120", "↗ +12.4%", false],
                            ["Cash on hand", "$91,847", "↗ +3.1%", false],
                            ["Open tickets", "14", "↘ 2 overdue", true],
                        ].map(([label, value, delta, negative]) => (
                            <div key={String(label)} className="border-border bg-background rounded-[10px] border p-3">
                                <div className="text-[10px] tracking-widest text-(--muted) uppercase">{label}</div>
                                <div className="font-display mt-1 text-[22px] tracking-[-0.02em]">{value}</div>
                                <div
                                    className={`font-mono text-[10px] ${negative ? "text-(--accent)" : "text-(--moss)"}`}>
                                    {delta}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-border bg-background h-40 rounded-[10px] border p-3.5">
                        <div className="mb-2 flex items-center justify-between">
                            <strong className="font-display text-sm font-normal">Revenue · Last 30 days</strong>
                            <span className="font-mono text-[11px] tracking-[0.08em] text-(--muted) uppercase">
                                daily
                            </span>
                        </div>
                        <svg viewBox="0 0 300 100" preserveAspectRatio="none" className="h-24 w-full">
                            <defs>
                                <linearGradient id="dashboardRevenue" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#B93A1D" stopOpacity="0.25" />
                                    <stop offset="100%" stopColor="#B93A1D" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path
                                d="M0,75 L20,68 L40,72 L60,58 L80,62 L100,48 L120,55 L140,42 L160,50 L180,38 L200,44 L220,30 L240,36 L260,22 L280,28 L300,18 L300,100 L0,100 Z"
                                fill="url(#dashboardRevenue)"
                            />
                            <path
                                d="M0,75 L20,68 L40,72 L60,58 L80,62 L100,48 L120,55 L140,42 L160,50 L180,38 L200,44 L220,30 L240,36 L260,22 L280,28 L300,18"
                                fill="none"
                                stroke="#B93A1D"
                                strokeWidth="1.8"
                            />
                        </svg>
                    </div>

                    <div className="border-border bg-background overflow-hidden rounded-[10px] border">
                        <div className="border-border grid grid-cols-[1fr_80px_80px_60px] gap-2.5 border-b bg-(--paper-2) px-3.5 py-2.5 font-mono text-[10px] tracking-[0.08em] text-(--muted) uppercase">
                            <div>Recent orders</div>
                            <div>Amount</div>
                            <div>Stage</div>
                            <div>PO#</div>
                        </div>
                        {[
                            ["Hollis & Dray Millwork", "$4,280", "Shipped", "#2841", "ok"],
                            ["Cascade Cycles", "$1,960", "Packing", "#2840", "warn"],
                            ["Meridian Coffee Roasters", "$12,400", "On hold", "#2839", "err"],
                        ].map(([order, amount, stage, po, style], index) => (
                            <div
                                key={String(order)}
                                className={`grid grid-cols-[1fr_80px_80px_60px] gap-2.5 px-3.5 py-2.5 text-xs ${
                                    index < 2 ? "border-border border-b" : ""
                                }`}>
                                <div>{order}</div>
                                <div>{amount}</div>
                                <div>
                                    <span
                                        className={`inline-block rounded-full px-2 py-0.5 font-mono text-[10px] ${
                                            style === "ok"
                                                ? "bg-[rgba(61,90,58,0.15)] text-(--moss)"
                                                : style === "warn"
                                                  ? "bg-[rgba(198,132,36,0.2)] text-[#8a5c18]"
                                                  : "bg-[rgba(185,58,29,0.15)] text-(--accent-deep)"
                                        }`}>
                                        {stage}
                                    </span>
                                </div>
                                <div>{po}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function InventoryMock() {
    return (
        <div className="mock reveal" data-reveal>
            <div className="border-border flex items-center gap-2 border-b bg-(--paper-2) px-4 py-3">
                <div className="flex gap-1.5">
                    <span className="size-2.5 rounded-full bg-(--rule)" />
                    <span className="size-2.5 rounded-full bg-(--rule)" />
                    <span className="size-2.5 rounded-full bg-(--rule)" />
                </div>
                <span className="ml-2 font-mono text-[11px] text-(--muted)">app.tessera.co / inventory / SKU-4120</span>
            </div>
            <div className="p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div className="font-display text-xl tracking-[-0.01em]">
                        SKU-4120 · Walnut shelf bracket, 8&quot;
                    </div>
                    <span className="inline-block rounded-full bg-[rgba(61,90,58,0.15)] px-2 py-0.5 font-mono text-[10px] text-(--moss)">
                        In stock · 142
                    </span>
                </div>
                <div className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        ["On hand", "142"],
                        ["Committed", "38"],
                        ["Reorder at", "60"],
                        ["Avg cost", "$3.42"],
                    ].map(([label, value]) => (
                        <div key={String(label)} className="border-border bg-background rounded-[10px] border p-3">
                            <div className="text-[10px] tracking-widest text-(--muted) uppercase">{label}</div>
                            <div className="font-display mt-1 text-[22px] tracking-[-0.02em]">{value}</div>
                        </div>
                    ))}
                </div>

                <div className="border-border bg-background mt-3 overflow-hidden rounded-[10px] border">
                    <div className="border-border grid grid-cols-[80px_1fr_100px_80px] gap-2.5 border-b bg-(--paper-2) px-3.5 py-2.5 font-mono text-[10px] tracking-[0.08em] text-(--muted) uppercase">
                        <div>Date</div>
                        <div>Movement</div>
                        <div>Source</div>
                        <div>Qty</div>
                    </div>
                    {[
                        ["Apr 17", "Shipment to Cascade Cycles", "SO #2840", "-12", true],
                        ["Apr 16", "Receipt from Thorne Supply", "PO #881", "+60", false],
                        ["Apr 15", "Cycle count adjustment", "CC-04", "-2", true],
                        ["Apr 14", "Work order consumption", "WO #412", "-8", true],
                    ].map(([date, movement, source, qty, neg], index) => (
                        <div
                            key={String(date)}
                            className={`grid grid-cols-[80px_1fr_100px_80px] gap-2.5 px-3.5 py-2.5 text-xs ${
                                index < 3 ? "border-border border-b" : ""
                            }`}>
                            <div>{date}</div>
                            <div>{movement}</div>
                            <div>{source}</div>
                            <div className={neg ? "text-(--accent)" : "text-(--moss)"}>{qty}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function FeatureTitle({
    kicker,
    title,
    text,
    bullets,
}: {
    kicker: string;
    title: ReactNode;
    text: string;
    bullets: string[];
}) {
    return (
        <div>
            <div className="flex items-center gap-2.5 font-mono text-xs tracking-[0.15em] text-(--accent) uppercase before:block before:h-px before:w-6 before:bg-(--accent)">
                {kicker}
            </div>
            <h3 className="font-display my-3.5 text-[clamp(30px,3.6vw,44px)] leading-[1.05] font-[350] tracking-tight">
                {title}
            </h3>
            <p className="max-w-[44ch] text-[17px] text-(--ink-soft)">{text}</p>
            <FeatureBullets items={bullets} />
        </div>
    );
}

export function FeaturesSection() {
    return (
        <>
            <section id="features" className="px-0 pt-10 pb-24">
                <div className="mx-auto grid w-full max-w-310 items-center gap-18 px-7 lg:grid-cols-[1fr_1.2fr]">
                    <FeatureTitle
                        kicker="The dashboard"
                        title={
                            <>
                                Every number, <em className="text-(--accent) italic">already reconciled.</em>
                            </>
                        }
                        text="No more exporting to spreadsheets at 11 p.m. on the 30th. Because every module writes to the same ledger, your P&L updates the instant an order ships, an invoice is paid, or a part is consumed on the shop floor."
                        bullets={featureOneBullets}
                    />
                    <DashboardMock />
                </div>
            </section>

            <section className="px-0 pt-5 pb-24">
                <div className="mx-auto grid w-full max-w-310 items-center gap-18 px-7 lg:grid-cols-[1.2fr_1fr]">
                    <div className="order-2 lg:order-1">
                        <InventoryMock />
                    </div>
                    <div className="order-1 lg:order-2">
                        <FeatureTitle
                            kicker="Built by operators"
                            title={
                                <>
                                    Opinionated where it <em className="text-(--accent) italic">saves you time.</em>{" "}
                                    Flexible where it counts.
                                </>
                            }
                            text="We've run factories, warehouses, and bookkeeping teams. That shows up in the defaults: a chart of accounts that matches GAAP out of the box, approval chains that assume humans get sick, and a migration path off the tools you already hate."
                            bullets={featureTwoBullets}
                        />
                    </div>
                </div>
            </section>
        </>
    );
}
