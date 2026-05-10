import type { ReactNode } from "react";

type PageHeaderProps = {
    eyebrow: string;
    title: ReactNode;
    description?: ReactNode;
    actions?: ReactNode;
};

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
    return (
        <header className="mb-8 flex flex-wrap items-end justify-between gap-6 border-b border-(--rule) pb-7">
            <div className="min-w-0 flex-1">
                <div className="mb-3 font-mono text-[11px] tracking-[0.12em] text-(--muted) uppercase">
                    {eyebrow}
                </div>
                <h1 className="font-display text-foreground text-[40px] leading-none font-[340] tracking-[-0.03em]">
                    {title}
                </h1>
                {description && (
                    <p className="mt-3 max-w-[60ch] text-[15px] leading-[1.55] text-(--ink-soft)">
                        {description}
                    </p>
                )}
            </div>
            {actions && <div className="flex flex-wrap items-center gap-2.5">{actions}</div>}
        </header>
    );
}
