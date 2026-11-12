export type InvoiceStatus = "DRAFT" | "APPROVED" | "PARTIALLY_PAID" | "PAID" | "VOID";

export type PaymentMethod = "CASH" | "CHECK" | "BANK_TRANSFER" | "CREDIT_CARD" | "OTHER";

export type InvoiceLineRequest = {
    accountId: string;
    amount: string;
    description?: string | null;
};

export type CreateInvoiceRequest = {
    customerId: string;
    date: string;
    dueDate: string;
    referenceNumber?: string | null;
    taxGroupId?: string | null;
    currencyCode?: string | null;
    lines: InvoiceLineRequest[];
};

export type VoidInvoiceRequest = {
    reason: string;
};

export type RecordReceiptRequest = {
    receiptDate: string;
    amount: string;
    paymentMethod: PaymentMethod;
    referenceNumber?: string | null;
};

export type InvoiceLineResponse = {
    accountId: string;
    accountCode: string;
    accountName: string;
    amount: string;
    description: string | null;
};

export type InvoiceResponse = {
    id: string;
    invoiceNumber: string;
    customerId: string;
    customerName: string;
    date: string;
    dueDate: string;
    referenceNumber: string | null;
    taxGroupId: string | null;
    organizationId: string;
    status: InvoiceStatus;
    lines: InvoiceLineResponse[];
    totalAmount: string;
    taxAmount: string;
    amountReceived: string;
    currencyCode: string;
    exchangeRate: string;
    baseCurrencyAmount: string;
    baseCurrencyTaxAmount: string;
    baseCurrencyAmountReceived: string;
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

export type InvoiceSummaryResponse = {
    id: string;
    invoiceNumber: string;
    customerName: string;
    date: string;
    dueDate: string;
    status: InvoiceStatus;
    totalAmount: string;
    taxAmount: string;
    amountReceived: string;
    currencyCode: string;
};

export type InvoiceReceiptResponse = {
    id: string;
    invoiceId: string;
    receiptDate: string;
    amount: string;
    baseCurrencyAmount: string;
    exchangeRate: string;
    paymentMethod: PaymentMethod;
    referenceNumber: string | null;
    journalEntryId: string | null;
    createdBy: string;
    createdAt: string | null;
};

export type AgingBucket = {
    current: string;
    days1to30: string;
    days31to60: string;
    days61to90: string;
    days90plus: string;
    total: string;
};

export type CustomerAgingResponse = {
    customerId: string;
    customerName: string;
    aging: AgingBucket;
};

export type ArAgingReportResponse = {
    asOfDate: string;
    customers: CustomerAgingResponse[];
    totals: AgingBucket;
};
