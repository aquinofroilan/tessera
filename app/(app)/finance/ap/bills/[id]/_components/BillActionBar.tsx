import { IconBan, IconCash, IconCheck, IconPencil } from "@tabler/icons-react";

import type { BillStatus } from "@/lib/api/finance/bills";
import { StatusActionBar, type StatusActionBarItem } from "../../../../_components/StatusActionBar";

export function BillActionBar({ status }: { status: BillStatus }) {
    const actions: StatusActionBarItem[] = [];
    if (status === "DRAFT") {
        actions.push(
            { key: "edit", label: "Edit", icon: <IconPencil stroke={1.8} />, variant: "outline" },
            { key: "approve", label: "Approve", icon: <IconCheck stroke={1.8} />, variant: "default" },
        );
    } else if (status === "APPROVED" || status === "PARTIALLY_PAID") {
        actions.push(
            { key: "void", label: "Void", icon: <IconBan stroke={1.8} />, variant: "outline" },
            { key: "pay", label: "Record payment", icon: <IconCash stroke={1.8} />, variant: "default" },
        );
    }
    return <StatusActionBar actions={actions} />;
}
