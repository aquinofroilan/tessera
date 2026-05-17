"use client";

import { useRouter } from "next/navigation";

import type { BillStatus } from "@/lib/api/finance/bills";
import { RowActionsMenu } from "../../../_components/RowActionsMenu";
import { buildDocumentRowActions } from "../../../_components/documentRowActions";

type BillRowMenuProps = {
    id: string;
    billNumber: string;
    status: BillStatus;
};

export function BillRowMenu({ id, billNumber, status }: BillRowMenuProps) {
    const router = useRouter();
    const actions = buildDocumentRowActions({
        id,
        basePath: "/finance/ap/bills",
        status,
        payKey: "pay",
        payLabel: "Record payment",
        voidLabel: "Void bill",
        push: router.push,
    });

    return <RowActionsMenu label={billNumber} triggerAriaLabel={`Actions for ${billNumber}`} actions={actions} />;
}
