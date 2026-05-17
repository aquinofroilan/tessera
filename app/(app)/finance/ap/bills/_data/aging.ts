import type { BillSummaryResponse } from "@/lib/api/finance/bills";
import { deriveAgingSummary, type AgingSummary } from "../../../_data/aging";
import { isOpenDocument } from "../../../_data/list-query";

export type ApAgingSummary = AgingSummary;

export const deriveApAgingSummary = (bills: BillSummaryResponse[], asOfDate: string): ApAgingSummary =>
    deriveAgingSummary(
        bills.map((bill) => ({
            isOpen: isOpenDocument(bill.status),
            outstanding: Number(bill.totalAmount) - Number(bill.amountPaid),
            dueDate: bill.dueDate,
        })),
        asOfDate,
    );
