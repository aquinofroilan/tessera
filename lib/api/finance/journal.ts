export type JournalEntryStatus = "DRAFT" | "POSTED" | "VOIDED";

export type JournalEntrySource = "MANUAL" | "SYSTEM";

export type JournalEntryLineRequest = {
    accountId: string;
    debit?: string;
    credit?: string;
    description?: string | null;
};

export type CreateJournalEntryRequest = {
    date: string;
    description: string;
    lines: JournalEntryLineRequest[];
    sourceReference?: string | null;
};

export type VoidJournalEntryRequest = {
    reason: string;
};

export type JournalEntryLineResponse = {
    accountId: string;
    accountCode: string;
    accountName: string;
    debit: string;
    credit: string;
    description: string | null;
};

export type JournalEntryResponse = {
    id: string;
    entryNumber: string;
    date: string;
    description: string;
    organizationId: string;
    status: JournalEntryStatus;
    source: JournalEntrySource;
    sourceReference: string | null;
    lines: JournalEntryLineResponse[];
    createdBy: string;
    postedAt: string | null;
    voidedAt: string | null;
    voidReason: string | null;
    createdAt: string | null;
    updatedAt: string | null;
};

export type AccountBalanceResponse = {
    accountId: string;
    accountCode: string;
    accountName: string;
    accountType: string;
    totalDebits: string;
    totalCredits: string;
    balance: string;
};

export type TrialBalanceResponse = {
    accounts: AccountBalanceResponse[];
    totalDebits: string;
    totalCredits: string;
    asOfDate: string | null;
};
