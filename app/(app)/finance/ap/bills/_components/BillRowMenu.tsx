"use client";

import { useRouter } from "next/navigation";
import { IconCash, IconCircleCheck, IconCircleX, IconDots, IconEye, IconPencil } from "@tabler/icons-react";

import {
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui";
import type { BillStatus } from "@/lib/api/finance/bills";

type BillRowMenuProps = {
    id: string;
    billNumber: string;
    status: BillStatus;
};

export function BillRowMenu({ id, billNumber, status }: BillRowMenuProps) {
    const router = useRouter();

    const isDraft = status === "DRAFT";
    const isOpen = status === "APPROVED" || status === "PARTIALLY_PAID";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${billNumber}`}>
                    <IconDots stroke={1.8} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>{billNumber}</DropdownMenuLabel>
                <DropdownMenuItem onSelect={() => router.push(`/finance/ap/bills/${id}`)}>
                    <IconEye />
                    View
                </DropdownMenuItem>
                {isDraft && (
                    <DropdownMenuItem onSelect={() => router.push(`/finance/ap/bills/${id}/edit`)}>
                        <IconPencil />
                        Edit
                    </DropdownMenuItem>
                )}
                {isDraft && (
                    <DropdownMenuItem onSelect={() => console.info("[mock] approve", id)}>
                        <IconCircleCheck />
                        Approve
                    </DropdownMenuItem>
                )}
                {isOpen && (
                    <DropdownMenuItem onSelect={() => console.info("[mock] record payment", id)}>
                        <IconCash />
                        Record payment
                    </DropdownMenuItem>
                )}
                {isOpen && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onSelect={() => console.info("[mock] void", id)}>
                            <IconCircleX />
                            Void bill
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
