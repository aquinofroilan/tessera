import { footerColumns } from "./landing-data";

export function LandingFooter() {
    return (
        <footer className="border-t border-[var(--rule)] px-0 pt-12 pb-9 text-[var(--ink-soft)]">
            <div className="mx-auto w-full max-w-310 px-7">
                <div className="mb-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(4,minmax(0,1fr))]">
                    <div>
                        <a
                            href="#"
                            className="font-display mb-3 inline-flex items-baseline gap-0.5 text-[30px] tracking-[-0.02em] text-[var(--ink)] italic">
                            Loom
                            <span className="mb-[3px] ml-0.5 size-1.5 self-center rounded-full bg-[var(--accent)]" />
                        </a>
                        <p className="max-w-[28ch] text-sm">
                            Software for running the whole shop. Made in Portland, Oregon. Serving operators everywhere
                            since 2019.
                        </p>
                    </div>

                    {footerColumns.map((column) => (
                        <div key={column.heading}>
                            <h4 className="mb-3.5 font-mono text-[11px] tracking-[0.12em] text-[var(--muted)] uppercase">
                                {column.heading}
                            </h4>
                            <ul className="flex list-none flex-col gap-2">
                                {column.links.map((link) => (
                                    <li key={link}>
                                        <a href="#" className="text-sm transition-colors hover:text-[var(--accent)]">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-3 border-t border-[var(--rule)] pt-6 text-center font-mono text-[13px] tracking-[0.05em] text-[var(--muted)] sm:flex-row sm:justify-between sm:text-left">
                    <span>© 2026 Loom Systems, Inc.</span>
                    <span>Built with care in PDX · v4.2.1</span>
                </div>
            </div>
        </footer>
    );
}
