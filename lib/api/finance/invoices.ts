import type { IsoDate, IsoDateTime, Money } from "../types";

export type InvoiceStatus = "DRAFT" | "APPROVED" | "PARTIALLY_PAID" | "PAID" | "VOID";

export type PaymentMethod = "CASH" | "CHECK" | "BANK_TRANSFER" | "CREDIT_CARD" | "OTHER";

export type InvoiceLineRequest = {
    accountId: string;
    amount: Money;
    description?: string | null;
};

export type CreateInvoiceRequest = {
    customerId: string;
    date: IsoDate;
    dueDate: IsoDate;
    referenceNumber?: string | null;
    taxGroupId?: string | null;
    currencyCode?: string | null;
    lines: InvoiceLineRequest[];
};

export type VoidInvoiceRequest = {
    reason: string;
};

export type RecordReceiptRequest = {
    receiptDate: IsoDate;
    amount: Money;
    paymentMethod: PaymentMethod;
    referenceNumber?: string | null;
};

export type InvoiceLineResponse = {
    accountId: string;
    accountCode: string;
    accountName: string;
    amount: Money;
    description: string | null;
};

export type InvoiceResponse = {
    id: string;
    invoiceNumber: string;
    customerId: string;
    customerName: string;
    date: IsoDate;
    dueDate: IsoDate;
    referenceNumber: string | null;
    taxGroupId: string | null;
    organizationId: string;
    status: InvoiceStatus;
    lines: InvoiceLineResponse[];
    totalAmount: Money;
    taxAmount: Money;
    amountReceived: Money;
    currencyCode: string;
    exchangeRate: Money;
    baseCurrencyAmount: Money;
    baseCurrencyTaxAmount: Money;
    baseCurrencyAmountReceived: Money;
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

export type InvoiceSummaryResponse = {
    id: string;
    invoiceNumber: string;
    customerName: string;
    date: IsoDate;
    dueDate: IsoDate;
    status: InvoiceStatus;
    totalAmount: Money;
    taxAmount: Money;
    amountReceived: Money;
    currencyCode: string;
};

export type InvoiceReceiptResponse = {
    id: string;
    invoiceId: string;
    receiptDate: IsoDate;
    amount: Money;
    baseCurrencyAmount: Money;
    exchangeRate: Money;
    paymentMethod: PaymentMethod;
    referenceNumber: string | null;
    journalEntryId: string | null;
    createdBy: string;
    createdAt: IsoDateTime | null;
};

export type AgingBucket = {
    current: Money;
    days1to30: Money;
    days31to60: Money;
    days61to90: Money;
    days90plus: Money;
    total: Money;
};

export type CustomerAgingResponse = {
    customerId: string;
    customerName: string;
    aging: AgingBucket;
};

export type ArAgingReportResponse = {
    asOfDate: IsoDate;
    customers: CustomerAgingResponse[];
    totals: AgingBucket;
};
