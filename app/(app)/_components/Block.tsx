import type { ReactNode } from "react";

type BlockProps = {
    title: ReactNode;
    description?: ReactNode;
    aside?: ReactNode;
    children: ReactNode;
};

export function Block({ title, description, aside, children }: BlockProps) {
    return (
        <section className="mb-9">
            <header className="mb-4.5 grid items-start gap-10 lg:grid-cols-[240px_1fr]">
                <div>
                    <h2 className="font-display text-[21px] leading-tight font-[420] tracking-[-0.015em] text-(--ink)">
                        {title}
                    </h2>
                    {description && <p className="mt-1 text-[13px] leading-[1.5] text-(--muted)">{description}</p>}
                </div>
                {aside && <div className="flex items-center justify-end gap-2.5">{aside}</div>}
            </header>
            {children}
        </section>
    );
}
