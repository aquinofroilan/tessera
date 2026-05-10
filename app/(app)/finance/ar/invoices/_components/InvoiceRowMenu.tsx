"use client";

import { useRouter } from "next/navigation";
import { IconCash, IconCircleCheck, IconCircleX, IconEye, IconPencil } from "@tabler/icons-react";

import type { InvoiceStatus } from "@/lib/api/finance/invoices";
import { RowActionsMenu, type RowAction } from "../../../_components/RowActionsMenu";

type InvoiceRowMenuProps = {
    id: string;
    invoiceNumber: string;
    status: InvoiceStatus;
};

export function InvoiceRowMenu({ id, invoiceNumber, status }: InvoiceRowMenuProps) {
    const router = useRouter();
    const isDraft = status === "DRAFT";
    const isOpen = status === "APPROVED" || status === "PARTIALLY_PAID";

    const actions: RowAction[] = [
        { key: "view", label: "View", icon: <IconEye />, onSelect: () => router.push(`/finance/ar/invoices/${id}`) },
        ...(isDraft
            ? [
                  {
                      key: "edit",
                      label: "Edit",
                      icon: <IconPencil />,
                      onSelect: () => router.push(`/finance/ar/invoices/${id}/edit`),
                  },
                  {
                      key: "approve",
                      label: "Approve",
                      icon: <IconCircleCheck />,
                      onSelect: () => console.info("[mock] approve", id),
                  },
              ]
            : []),
        ...(isOpen
            ? [
                  {
                      key: "receipt",
                      label: "Record receipt",
                      icon: <IconCash />,
                      onSelect: () => console.info("[mock] record receipt", id),
                  },
                  {
                      key: "void",
                      label: "Void invoice",
                      icon: <IconCircleX />,
                      destructive: true,
                      separatorBefore: true,
                      onSelect: () => console.info("[mock] void", id),
                  },
              ]
            : []),
    ];

    return <RowActionsMenu label={invoiceNumber} triggerAriaLabel={`Actions for ${invoiceNumber}`} actions={actions} />;
}
