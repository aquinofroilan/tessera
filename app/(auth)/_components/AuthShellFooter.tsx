export function AuthShellFooter() {
    return (
        <footer className="mt-10 flex flex-wrap justify-between gap-3 font-mono text-[11px] tracking-[0.04em] text-(--muted)">
            <span>© 2026 Loom Systems, Inc. · Portland, OR</span>
            <span className="space-x-1.5">
                <a href="#" className="hover:text-foreground text-inherit no-underline">
                    Status
                </a>
                <span>·</span>
                <a href="#" className="hover:text-foreground text-inherit no-underline">
                    Security
                </a>
                <span>·</span>
                <a href="#" className="hover:text-foreground text-inherit no-underline">
                    Docs
                </a>
            </span>
        </footer>
    );
}
