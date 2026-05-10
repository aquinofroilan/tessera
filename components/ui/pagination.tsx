import { type ComponentProps } from "react";
import { IconChevronLeft, IconChevronRight, IconDots } from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function Pagination({ className, ...props }: ComponentProps<"nav">) {
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

function PaginationContent({ className, ...props }: ComponentProps<"ul">) {
    return (
        <ul
            data-slot="pagination-content"
            className={cn("flex list-none items-center gap-0.5", className)}
            {...props}
        />
    );
}

function PaginationItem({ ...props }: ComponentProps<"li">) {
    return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
    isActive?: boolean;
} & Pick<ComponentProps<typeof Button>, "size"> &
    ComponentProps<"a">;

function PaginationLink({ className, isActive, size = "icon", ...props }: PaginationLinkProps) {
    return (
        <Button asChild variant={isActive ? "outline" : "ghost"} size={size} className={cn(className)}>
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
}: ComponentProps<typeof PaginationLink> & { text?: string }) {
    return (
        <PaginationLink aria-label="Go to previous page" size="default" className={cn("pl-1.5!", className)} {...props}>
            <IconChevronLeft data-icon="inline-start" stroke={1.8} />
            <span className="hidden sm:block">{text}</span>
        </PaginationLink>
    );
}

function PaginationNext({
    className,
    text = "Next",
    ...props
}: ComponentProps<typeof PaginationLink> & { text?: string }) {
    return (
        <PaginationLink aria-label="Go to next page" size="default" className={cn("pr-1.5!", className)} {...props}>
            <span className="hidden sm:block">{text}</span>
            <IconChevronRight data-icon="inline-end" stroke={1.8} />
        </PaginationLink>
    );
}

function PaginationEllipsis({ className, ...props }: ComponentProps<"span">) {
    return (
        <span
            aria-hidden
            data-slot="pagination-ellipsis"
            className={cn("flex size-8 items-center justify-center", className)}
            {...props}>
            <IconDots className="size-4" stroke={1.8} />
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
