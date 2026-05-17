import type { IsoDate, IsoDateTime, Money } from "../types";

export type JournalEntryStatus = "DRAFT" | "POSTED" | "VOIDED";

export type JournalEntrySource = "MANUAL" | "SYSTEM";

export type JournalEntryLineRequest = {
    accountId: string;
    debit?: Money;
    credit?: Money;
    description?: string | null;
};

export type CreateJournalEntryRequest = {
    date: IsoDate;
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
    debit: Money;
    credit: Money;
    description: string | null;
};

export type JournalEntryResponse = {
    id: string;
    entryNumber: string;
    date: IsoDate;
    description: string;
    organizationId: string;
    status: JournalEntryStatus;
    source: JournalEntrySource;
    sourceReference: string | null;
    lines: JournalEntryLineResponse[];
    createdBy: string;
    postedAt: IsoDateTime | null;
    voidedAt: IsoDateTime | null;
    voidReason: string | null;
    createdAt: IsoDateTime | null;
    updatedAt: IsoDateTime | null;
};

export type AccountBalanceResponse = {
    accountId: string;
    accountCode: string;
    accountName: string;
    accountType: string;
    totalDebits: Money;
    totalCredits: Money;
    balance: Money;
};

export type TrialBalanceResponse = {
    accounts: AccountBalanceResponse[];
    totalDebits: Money;
    totalCredits: Money;
    asOfDate: IsoDate | null;
};
