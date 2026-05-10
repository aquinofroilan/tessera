"use client";

import { useRouter } from "next/navigation";
import {
    IconCash,
    IconDots,
    IconEye,
    IconPencil,
    IconCircleCheck,
    IconCircleX,
} from "@tabler/icons-react";

import {
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui";
import type { InvoiceStatus } from "@/lib/api/finance/invoices";

type InvoiceRowMenuProps = {
    id: string;
    invoiceNumber: string;
    status: InvoiceStatus;
};

export function InvoiceRowMenu({ id, invoiceNumber, status }: InvoiceRowMenuProps) {
    const router = useRouter();

    const isDraft = status === "DRAFT";
    const isOpen = status === "APPROVED" || status === "PARTIALLY_PAID";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${invoiceNumber}`}>
                    <IconDots stroke={1.8} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>{invoiceNumber}</DropdownMenuLabel>
                <DropdownMenuItem onSelect={() => router.push(`/finance/ar/invoices/${id}`)}>
                    <IconEye />
                    View
                </DropdownMenuItem>
                {isDraft && (
                    <DropdownMenuItem onSelect={() => router.push(`/finance/ar/invoices/${id}/edit`)}>
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
                    <DropdownMenuItem onSelect={() => console.info("[mock] record receipt", id)}>
                        <IconCash />
                        Record receipt
                    </DropdownMenuItem>
                )}
                {isOpen && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onSelect={() => console.info("[mock] void", id)}>
                            <IconCircleX />
                            Void invoice
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
