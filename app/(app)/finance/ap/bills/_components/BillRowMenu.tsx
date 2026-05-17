"use client";

import { useRouter } from "next/navigation";
import { IconCash, IconCircleCheck, IconCircleX, IconEye, IconPencil } from "@tabler/icons-react";

import type { BillStatus } from "@/lib/api/finance/bills";
import { RowActionsMenu, type RowAction } from "../../../_components/RowActionsMenu";

type BillRowMenuProps = {
    id: string;
    billNumber: string;
    status: BillStatus;
};

export function BillRowMenu({ id, billNumber, status }: BillRowMenuProps) {
    const router = useRouter();
    const isDraft = status === "DRAFT";
    const isOpen = status === "APPROVED" || status === "PARTIALLY_PAID";

    const actions: RowAction[] = [
        { key: "view", label: "View", icon: <IconEye />, onSelect: () => router.push(`/finance/ap/bills/${id}`) },
        ...(isDraft
            ? [
                  {
                      key: "edit",
                      label: "Edit",
                      icon: <IconPencil />,
                      onSelect: () => router.push(`/finance/ap/bills/${id}/edit`),
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
                      key: "pay",
                      label: "Record payment",
                      icon: <IconCash />,
                      onSelect: () => console.info("[mock] record payment", id),
                  },
                  {
                      key: "void",
                      label: "Void bill",
                      icon: <IconCircleX />,
                      destructive: true,
                      separatorBefore: true,
                      onSelect: () => console.info("[mock] void", id),
                  },
              ]
            : []),
    ];

    return <RowActionsMenu label={billNumber} triggerAriaLabel={`Actions for ${billNumber}`} actions={actions} />;
}
