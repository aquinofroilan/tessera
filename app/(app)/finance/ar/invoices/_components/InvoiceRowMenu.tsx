"use client";

import { useRouter } from "next/navigation";

import type { InvoiceStatus } from "@/lib/api/finance/invoices";
import { RowActionsMenu } from "../../../_components/RowActionsMenu";
import { buildDocumentRowActions } from "../../../_components/documentRowActions";

type InvoiceRowMenuProps = {
    id: string;
    invoiceNumber: string;
    status: InvoiceStatus;
};

export function InvoiceRowMenu({ id, invoiceNumber, status }: InvoiceRowMenuProps) {
    const router = useRouter();
    const actions = buildDocumentRowActions({
        id,
        basePath: "/finance/ar/invoices",
        status,
        payKey: "receipt",
        payLabel: "Record receipt",
        voidLabel: "Void invoice",
        push: router.push,
    });

    return (
        <RowActionsMenu label={invoiceNumber} triggerAriaLabel={`Actions for ${invoiceNumber}`} actions={actions} />
    );
}
