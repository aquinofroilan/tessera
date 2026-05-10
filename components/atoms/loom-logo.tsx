import Link from "next/link";
import { cn } from "@/lib/utils";

type LoomLogoProps = {
    size?: "sm" | "md";
    className?: string;
};

const sizeClass = {
    sm: "text-[26px] font-medium",
    md: "text-[30px]",
} as const;

export function LoomLogo({ size = "sm", className }: LoomLogoProps) {
    return (
        <Link
            href="/"
            className={cn(
                "font-display text-foreground inline-flex items-baseline gap-0.5 tracking-[-0.02em] italic",
                sizeClass[size],
                className,
            )}>
            Loom
            <span className="mb-0.75 ml-0.5 size-1.5 self-center rounded-full bg-(--accent)" />
        </Link>
    );
}
