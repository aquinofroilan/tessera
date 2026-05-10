import Link from "next/link";
import { LoomLogo } from "@/components/atoms/loom-logo";
import { footerColumns } from "./landing-data";

export function LandingFooter() {
    return (
        <footer className="border-border border-t px-0 pt-12 pb-9 text-(--ink-soft)">
            <div className="mx-auto w-full max-w-310 px-7">
                <div className="mb-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(4,minmax(0,1fr))]">
                    <div>
                        <LoomLogo size="md" className="mb-3" />
                        <p className="max-w-[28ch] text-sm">
                            Software for running the whole shop. Made in Portland, Oregon. Serving operators everywhere
                            since 2019.
                        </p>
                    </div>

                    {footerColumns.map((column) => (
                        <div key={column.heading}>
                            <h4 className="mb-3.5 font-mono text-[11px] tracking-[0.12em] text-(--muted) uppercase">
                                {column.heading}
                            </h4>
                            <ul className="flex list-none flex-col gap-2">
                                {column.links.map((link) => (
                                    <li key={link}>
                                        <Link href="#" className="text-sm transition-colors hover:text-(--accent)">
                                            {link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-border flex flex-col gap-3 border-t pt-6 text-center font-mono text-[13px] tracking-wider text-(--muted) sm:flex-row sm:justify-between sm:text-left">
                    <span>© 2026 Loom Systems, Inc.</span>
                    <span>Built with care in PDX · v4.2.1</span>
                </div>
            </div>
        </footer>
    );
}
