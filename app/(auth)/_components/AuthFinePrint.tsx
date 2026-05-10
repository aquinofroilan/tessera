import { IconCheck } from "@tabler/icons-react";

type AuthFinePrintProps = {
    items: string[];
};

export function AuthFinePrint({ items }: AuthFinePrintProps) {
    return (
        <div className="mt-3 flex flex-wrap gap-4 font-mono text-[11px] tracking-[0.04em] text-(--muted)">
            {items.map((text) => (
                <span key={text} className="inline-flex items-center gap-1.5">
                    <IconCheck className="size-3 " stroke={2.4} />
                    {text}
                </span>
            ))}
        </div>
    );
}
