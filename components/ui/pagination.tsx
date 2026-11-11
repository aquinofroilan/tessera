import { type ComponentProps } from "react";
import { IconChevronLeft, IconChevronRight, IconDots } from "@/components/ui/hugeicons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function Pagination({ className, ...props }: Readonly<ComponentProps<"nav">>) {
    return (
        <nav
            role="navigation"
            aria-label="pagination"
            data-slot="pagination"
            className={cn("mx-auto flex w-full justify-center", className)}
            {...props}
        />
    );
}

function PaginationContent({ className, ...props }: Readonly<ComponentProps<"ul">>) {
    return (
        <ul
            data-slot="pagination-content"
            className={cn("flex list-none items-center gap-0.5", className)}
            {...props}
        />
    );
}

function PaginationItem({ ...props }: Readonly<ComponentProps<"li">>) {
    return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = Readonly<{
    isActive?: boolean;
} & Pick<ComponentProps<typeof Button>, "size"> &
    ComponentProps<"a">>;

function PaginationLink({ className, isActive, size = "icon-sm", ...props }: PaginationLinkProps) {
    return (
        <Button
            asChild
            variant={isActive ? "outline" : "ghost"}
            size={size}
            className={cn("font-mono tabular-nums", className)}>
            <a
                aria-current={isActive ? "page" : undefined}
                data-slot="pagination-link"
                data-active={isActive}
                {...props}
            />
        </Button>
    );
}

function PaginationPrevious({
    className,
    text = "Previous",
    ...props
}: Readonly<ComponentProps<typeof PaginationLink> & { text?: string }>) {
    return (
        <PaginationLink
            aria-label="Go to previous page"
            size="sm"
            className={cn("font-sans normal-nums", className)}
            {...props}>
            <IconChevronLeft data-icon="inline-start" strokeWidth={1.8} />
            <span className="hidden sm:block">{text}</span>
        </PaginationLink>
    );
}

function PaginationNext({
    className,
    text = "Next",
    ...props
}: Readonly<ComponentProps<typeof PaginationLink> & { text?: string }>) {
    return (
        <PaginationLink
            aria-label="Go to next page"
            size="sm"
            className={cn("font-sans normal-nums", className)}
            {...props}>
            <span className="hidden sm:block">{text}</span>
            <IconChevronRight data-icon="inline-end" strokeWidth={1.8} />
        </PaginationLink>
    );
}

function PaginationEllipsis({ className, ...props }: Readonly<ComponentProps<"span">>) {
    return (
        <span
            aria-hidden
            data-slot="pagination-ellipsis"
            className={cn("flex size-8 items-center justify-center", className)}
            {...props}>
            <IconDots className="size-4" strokeWidth={1.8} />
            <span className="sr-only">More pages</span>
        </span>
    );
}

export {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
};
