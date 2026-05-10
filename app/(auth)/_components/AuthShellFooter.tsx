export function AuthShellFooter() {
    return (
        <footer className="mt-10 flex flex-wrap justify-between gap-3 font-mono text-[11px] tracking-[0.04em] text-[var(--muted)]">
            <span>© 2026 Loom Systems, Inc. · Portland, OR</span>
            <span className="space-x-1.5">
                <a href="#" className="text-inherit no-underline hover:text-[var(--ink)]">
                    Status
                </a>
                <span>·</span>
                <a href="#" className="text-inherit no-underline hover:text-[var(--ink)]">
                    Security
                </a>
                <span>·</span>
                <a href="#" className="text-inherit no-underline hover:text-[var(--ink)]">
                    Docs
                </a>
            </span>
        </footer>
    );
}
