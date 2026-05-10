import type { BillResponse } from "@/lib/api/finance/bills";
import { deriveAgingSummary, type AgingSummary } from "../../../_data/aging";

export type ApAgingSummary = AgingSummary;

export function deriveApAgingSummary(bills: BillResponse[], asOfDate: string): ApAgingSummary {
    return deriveAgingSummary(
        bills.map((bill) => ({
            isOpen: bill.status === "APPROVED" || bill.status === "PARTIALLY_PAID",
            outstanding: Number(bill.totalAmount) - Number(bill.amountPaid),
            dueDate: bill.dueDate,
        })),
        asOfDate,
    );
}
