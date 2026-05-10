import { IconBan, IconCheck, IconCoins, IconPencil } from "@tabler/icons-react";

import { Button } from "@/components/ui";
import type { InvoiceStatus } from "@/lib/api/finance/invoices";

export function InvoiceActionBar({ status }: { status: InvoiceStatus }) {
    if (status === "DRAFT") {
        return (
            <>
                <Button variant="outline" size="sm">
                    <IconPencil stroke={1.8} />
                    Edit
                </Button>
                <Button variant="default" size="sm">
                    <IconCheck stroke={1.8} />
                    Approve
                </Button>
            </>
        );
    }
    if (status === "APPROVED" || status === "PARTIALLY_PAID") {
        return (
            <>
                <Button variant="outline" size="sm">
                    <IconBan stroke={1.8} />
                    Void
                </Button>
                <Button variant="default" size="sm">
                    <IconCoins stroke={1.8} />
                    Record receipt
                </Button>
            </>
        );
    }
    return null;
}
