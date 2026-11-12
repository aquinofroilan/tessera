import type { AgingBucket, PaymentMethod } from "./invoices";

export type BillStatus = "DRAFT" | "APPROVED" | "PARTIALLY_PAID" | "PAID" | "VOID";

export type BillLineRequest = {
    accountId: string;
    amount: string;
    description?: string | null;
};

export type CreateBillRequest = {
    vendorId: string;
    date: string;
    dueDate: string;
    referenceNumber?: string | null;
    taxGroupId?: string | null;
    currencyCode?: string | null;
    lines: BillLineRequest[];
};

export type VoidBillRequest = {
    reason: string;
};

export type RecordPaymentRequest = {
    paymentDate: string;
    amount: string;
    paymentMethod: PaymentMethod;
    referenceNumber?: string | null;
};

export type BillLineResponse = {
    accountId: string;
    accountCode: string;
    accountName: string;
    amount: string;
    description: string | null;
};

export type BillResponse = {
    id: string;
    billNumber: string;
    vendorId: string;
    vendorName: string;
    date: string;
    dueDate: string;
    referenceNumber: string | null;
    taxGroupId: string | null;
    organizationId: string;
    status: BillStatus;
    lines: BillLineResponse[];
    totalAmount: string;
    taxAmount: string;
    amountPaid: string;
    currencyCode: string;
    exchangeRate: string;
    baseCurrencyAmount: string;
    baseCurrencyTaxAmount: string;
    baseCurrencyAmountPaid: string;
    journalEntryId: string | null;
    createdBy: string;
    approvedAt: string | null;
    approvedBy: string | null;
    paidAt: string | null;
    voidedAt: string | null;
    voidedBy: string | null;
    voidReason: string | null;
    createdAt: string | null;
    updatedAt: string | null;
};

export type BillSummaryResponse = {
    id: string;
    billNumber: string;
    vendorName: string;
    date: string;
    dueDate: string;
    status: BillStatus;
    totalAmount: string;
    taxAmount: string;
    amountPaid: string;
    currencyCode: string;
};

export type BillPaymentResponse = {
    id: string;
    billId: string;
    paymentDate: string;
    amount: string;
    baseCurrencyAmount: string;
    exchangeRate: string;
    paymentMethod: PaymentMethod;
    referenceNumber: string | null;
    journalEntryId: string | null;
    createdBy: string;
    createdAt: string | null;
};

export type VendorAgingResponse = {
    vendorId: string;
    vendorName: string;
    aging: AgingBucket;
};

export type ApAgingReportResponse = {
    asOfDate: string;
    vendors: VendorAgingResponse[];
    totals: AgingBucket;
};
