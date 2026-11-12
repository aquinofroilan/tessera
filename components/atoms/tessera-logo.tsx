import Link from "next/link";
import { cn } from "@/lib/utils";

type TesseraLogoProps = Readonly<{
    size?: "sm" | "md";
    className?: string;
}>;

const sizeClass = {
    sm: "text-[26px] font-medium",
    md: "text-[30px]",
} as const;

export function TesseraLogo({ size = "sm", className }: TesseraLogoProps) {
    return (
        <Link
            href="/"
            className={cn(
                "font-display text-foreground inline-flex items-baseline gap-1 tracking-[-0.02em] italic",
                sizeClass[size],
                className,
            )}>
            <span>Tessera</span>
            <span aria-hidden="true" className="mb-0.75 size-1.5 self-center rounded-full bg-(--accent)" />
        </Link>
    );
}
