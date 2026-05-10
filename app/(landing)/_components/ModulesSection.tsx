import type { CSSProperties } from "react";
import {
    IconArrowUpRight,
    IconLayoutDashboard,
    IconLayoutGrid,
    IconMessage,
    IconSettings,
    IconShoppingCart,
    IconStack2,
    IconTrendingUp,
    IconUser,
    type Icon,
} from "@tabler/icons-react";

import { modules } from "./landing-data";
import type { ModuleItem } from "./landing-data";

const moduleIconByKind: Record<ModuleItem["icon"], Icon> = {
    grid: IconLayoutGrid,
    trend: IconTrendingUp,
    stack: IconStack2,
    user: IconUser,
    blocks: IconLayoutDashboard,
    gear: IconSettings,
    cart: IconShoppingCart,
    chat: IconMessage,
};

export function ModulesSection() {
    return (
        <section id="modules" className="px-0 py-24">
            <div className="mx-auto w-full max-w-310 px-7">
                <div className="mb-14 grid items-end gap-12 md:grid-cols-[1fr_1.4fr]">
                    <div>
                        <div className="flex items-center gap-2.5 font-mono text-xs tracking-[0.15em] text-[var(--accent)] uppercase before:block before:h-px before:w-6 before:bg-[var(--accent)]">
                            One platform
                        </div>
                        <h2 className="font-display mt-4 max-w-[16ch] text-[clamp(36px,5vw,64px)] leading-[1.02] font-[340] tracking-[-0.03em]">
                            Eight modules. <em className="text-[var(--ink-soft)] italic">One database.</em> Zero duct
                            tape.
                        </h2>
                    </div>
                    <p className="max-w-[52ch] text-lg text-[var(--ink-soft)]">
                        Most companies run on six disconnected SaaS tools and a heroic spreadsheet. Loom replaces all of
                        it with integrated modules that share the same customers, products, and ledger - so a sale in
                        one module posts everywhere it should.
                    </p>
                </div>

                <div
                    className="reveal stagger grid [grid-template-columns:repeat(1,minmax(0,1fr))] overflow-hidden rounded-[18px] border border-[var(--rule)] bg-[var(--rule)] md:[grid-template-columns:repeat(2,minmax(0,1fr))] xl:[grid-template-columns:repeat(4,minmax(0,1fr))]"
                    data-reveal>
                    {modules.map((module, index) => {
                        const Icon = moduleIconByKind[module.icon];
                        return (
                            <a
                                href="#"
                                key={module.id}
                                style={{ "--i": String(index) } as CSSProperties}
                                className="group relative flex min-h-55 flex-col justify-between bg-[var(--paper)] px-6 pt-7 pb-7 transition-colors hover:bg-[var(--paper-2)]">
                                <div>
                                    <div
                                        className={`mb-5 grid size-10.5 place-items-center rounded-[11px] text-[var(--paper)] ${module.iconColor}`}>
                                        <Icon className="size-5.5" stroke={1.6} />
                                    </div>
                                    <h3 className="font-display mb-1.5 text-[22px] font-normal tracking-[-0.01em]">
                                        {module.title}
                                    </h3>
                                    <p className="text-sm leading-[1.5] text-[var(--ink-soft)]">{module.description}</p>
                                </div>
                                <span className="absolute top-4.5 right-5.5 font-mono text-[11px] tracking-[0.1em] text-[var(--muted)]">
                                    {module.id}
                                </span>
                                <span className="absolute right-5.5 bottom-5.5 text-[var(--accent)] opacity-30 transition-all group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100">
                                    <IconArrowUpRight className="size-4.5" stroke={1.6} />
                                </span>
                            </a>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
