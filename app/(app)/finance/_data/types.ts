import type { IsoDate, Money } from "@/lib/api/types";
import type { InvoiceStatus } from "@/lib/api/finance/invoices";

export type { IsoDate, Money, InvoiceStatus };

export type BillStatus = "DRAFT" | "APPROVED" | "PARTIALLY_PAID" | "PAID" | "VOID";
export type JournalEntryStatus = "DRAFT" | "POSTED" | "VOIDED";
export type JournalEntrySource = "MANUAL" | "SYSTEM";

export type KpiTone = "neutral" | "positive" | "warning" | "accent";

export type Kpi = {
    label: string;
    value: Money;
    currencyCode: string;
    delta: number | null;
    detail?: string;
    tone?: KpiTone;
};

export type InvoiceRow = {
    id: string;
    invoiceNumber: string;
    customerName: string;
    dueDate: IsoDate;
    // Negative = overdue, positive = days remaining.
    daysOverdue: number;
    status: InvoiceStatus;
    totalAmount: Money;
    amountReceived: Money;
    currencyCode: string;
};

export type BillRow = {
    id: string;
    billNumber: string;
    vendorName: string;
    dueDate: IsoDate;
    daysOverdue: number;
    status: BillStatus;
    totalAmount: Money;
    amountPaid: Money;
    currencyCode: string;
};

export type JournalRow = {
    id: string;
    entryNumber: string;
    date: IsoDate;
    description: string;
    status: JournalEntryStatus;
    source: JournalEntrySource;
    amount: Money;
    currencyCode: string;
};

export type TrendPoint = {
    label: string;
    revenue: number;
    expenses: number;
};
