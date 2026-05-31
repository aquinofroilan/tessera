import type { IsoDate, IsoDateTime, Money } from "../types";

export type PayrollRunStatus = "DRAFT" | "APPROVED" | "PAID" | "CANCELLED";

export const PAYROLL_RUN_STATUSES: readonly PayrollRunStatus[] = [
    "DRAFT",
    "APPROVED",
    "PAID",
    "CANCELLED",
] as const;

export type CreatePayrollRunRequest = {
    periodStart: IsoDate;
    periodEnd: IsoDate;
    payDate: IsoDate;
};

export type PayrollRunLine = {
    id: string;
    lineNumber: number;
    employeeId: string;
    employeeNumber: string;
    employeeName: string;
    compensationId: string;
    grossAmount: Money;
};

export type PayrollRunResponse = {
    id: string;
    runNumber: string;
    periodStart: IsoDate;
    periodEnd: IsoDate;
    payDate: IsoDate;
    organizationId: string;
    status: PayrollRunStatus;
    lines: PayrollRunLine[];
    totalGross: Money;
    currency: string;
    createdBy: string;
    accrualJournalEntryId: string | null;
    paymentJournalEntryId: string | null;
    approvedAt: IsoDateTime | null;
    paidAt: IsoDateTime | null;
    cancelledAt: IsoDateTime | null;
    createdAt: IsoDateTime | null;
    updatedAt: IsoDateTime | null;
};
