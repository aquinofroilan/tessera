import { IconBan, IconCash, IconCheck, IconPencil } from "@tabler/icons-react";

import { Button } from "@/components/ui";
import type { BillStatus } from "@/lib/api/finance/bills";

export function BillActionBar({ status }: { status: BillStatus }) {
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
                    <IconCash stroke={1.8} />
                    Record payment
                </Button>
            </>
        );
    }
    return null;
}
