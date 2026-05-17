import { IconBan, IconCheck, IconCoins, IconPencil } from "@tabler/icons-react";

import type { InvoiceStatus } from "@/lib/api/finance/invoices";
import { StatusActionBar, type StatusActionBarItem } from "../../../../_components/StatusActionBar";

export function InvoiceActionBar({ status }: { status: InvoiceStatus }) {
    const actions: StatusActionBarItem[] = [];
    if (status === "DRAFT") {
        actions.push(
            { key: "edit", label: "Edit", icon: <IconPencil stroke={1.8} />, variant: "outline" },
            { key: "approve", label: "Approve", icon: <IconCheck stroke={1.8} />, variant: "default" },
        );
    } else if (status === "APPROVED" || status === "PARTIALLY_PAID") {
        actions.push(
            { key: "void", label: "Void", icon: <IconBan stroke={1.8} />, variant: "outline" },
            { key: "receipt", label: "Record receipt", icon: <IconCoins stroke={1.8} />, variant: "default" },
        );
    }
    return <StatusActionBar actions={actions} />;
}
