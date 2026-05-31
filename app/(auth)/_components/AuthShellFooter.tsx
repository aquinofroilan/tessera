import Link from "next/link";

export function AuthShellFooter() {
    return (
        <footer className="mt-10 flex flex-wrap justify-between gap-3 font-mono text-[11px] tracking-[0.04em] text-(--muted)">
            <span>© 2026 Tessera Systems, Inc. · Portland, OR</span>
            <span className="space-x-1.5">
                <Link href="#" className="hover:text-foreground text-inherit no-underline">
                    Status
                </Link>
                <span>·</span>
                <Link href="#" className="hover:text-foreground text-inherit no-underline">
                    Security
                </Link>
                <span>·</span>
                <Link href="#" className="hover:text-foreground text-inherit no-underline">
                    Docs
                </Link>
            </span>
        </footer>
    );
}
