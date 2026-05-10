import type { InvoiceResponse } from "@/lib/api/finance/invoices";
import { deriveAgingSummary, type AgingSummary } from "../../../_data/aging";

export type { AgingSummary };

export function deriveInvoicesAging(invoices: InvoiceResponse[], asOfDate: string): AgingSummary {
    return deriveAgingSummary(
        invoices.map((inv) => ({
            isOpen: inv.status === "APPROVED" || inv.status === "PARTIALLY_PAID",
            outstanding: Number(inv.totalAmount) - Number(inv.amountReceived),
            dueDate: inv.dueDate,
        })),
        asOfDate,
    );
}

export { deriveInvoicesAging as deriveAgingSummary };
