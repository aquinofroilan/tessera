import type { IsoDate, IsoDateTime, Money } from "../types";
import type { AgingBucket, PaymentMethod } from "./invoices";

export type BillStatus = "DRAFT" | "APPROVED" | "PARTIALLY_PAID" | "PAID" | "VOID";

export type BillLineRequest = {
    accountId: string;
    amount: Money;
    description?: string | null;
};

export type CreateBillRequest = {
    vendorId: string;
    date: IsoDate;
    dueDate: IsoDate;
    referenceNumber?: string | null;
    taxGroupId?: string | null;
    currencyCode?: string | null;
    lines: BillLineRequest[];
};

export type VoidBillRequest = {
    reason: string;
};

export type RecordPaymentRequest = {
    paymentDate: IsoDate;
    amount: Money;
    paymentMethod: PaymentMethod;
    referenceNumber?: string | null;
};

export type BillLineResponse = {
    accountId: string;
    accountCode: string;
    accountName: string;
    amount: Money;
    description: string | null;
};

export type BillResponse = {
    id: string;
    billNumber: string;
    vendorId: string;
    vendorName: string;
    date: IsoDate;
    dueDate: IsoDate;
    referenceNumber: string | null;
    taxGroupId: string | null;
    organizationId: string;
    status: BillStatus;
    lines: BillLineResponse[];
    totalAmount: Money;
    taxAmount: Money;
    amountPaid: Money;
    currencyCode: string;
    exchangeRate: Money;
    baseCurrencyAmount: Money;
    baseCurrencyTaxAmount: Money;
    baseCurrencyAmountPaid: Money;
    journalEntryId: string | null;
    createdBy: string;
    approvedAt: IsoDateTime | null;
    approvedBy: string | null;
    paidAt: IsoDateTime | null;
    voidedAt: IsoDateTime | null;
    voidedBy: string | null;
    voidReason: string | null;
    createdAt: IsoDateTime | null;
    updatedAt: IsoDateTime | null;
};

export type BillSummaryResponse = {
    id: string;
    billNumber: string;
    vendorName: string;
    date: IsoDate;
    dueDate: IsoDate;
    status: BillStatus;
    totalAmount: Money;
    taxAmount: Money;
    amountPaid: Money;
    currencyCode: string;
};

export type BillPaymentResponse = {
    id: string;
    billId: string;
    paymentDate: IsoDate;
    amount: Money;
    baseCurrencyAmount: Money;
    exchangeRate: Money;
    paymentMethod: PaymentMethod;
    referenceNumber: string | null;
    journalEntryId: string | null;
    createdBy: string;
    createdAt: IsoDateTime | null;
};

export type VendorAgingResponse = {
    vendorId: string;
    vendorName: string;
    aging: AgingBucket;
};

export type ApAgingReportResponse = {
    asOfDate: IsoDate;
    vendors: VendorAgingResponse[];
    totals: AgingBucket;
};
