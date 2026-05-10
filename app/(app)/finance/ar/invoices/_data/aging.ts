import type { InvoiceResponse } from "@/lib/api/finance/invoices";
import { deriveAgingSummary, type AgingSummary } from "../../../_data/aging";
import { isOpenDocument } from "../../../_data/list-query";

export type { AgingSummary };

export function deriveInvoicesAging(invoices: InvoiceResponse[], asOfDate: string): AgingSummary {
    return deriveAgingSummary(
        invoices.map((inv) => ({
            isOpen: isOpenDocument(inv.status),
            outstanding: Number(inv.totalAmount) - Number(inv.amountReceived),
            dueDate: inv.dueDate,
        })),
        asOfDate,
    );
}

export { deriveInvoicesAging as deriveAgingSummary };
