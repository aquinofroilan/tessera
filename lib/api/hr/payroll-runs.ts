export type PayrollRunStatus = "DRAFT" | "APPROVED" | "PAID" | "CANCELLED";

export const PAYROLL_RUN_STATUSES: readonly PayrollRunStatus[] = [
    "DRAFT",
    "APPROVED",
    "PAID",
    "CANCELLED",
] as const;

export type CreatePayrollRunRequest = {
    periodStart: string;
    periodEnd: string;
    payDate: string;
};

export type PayrollRunLine = {
    id: string;
    lineNumber: number;
    employeeId: string;
    employeeNumber: string;
    employeeName: string;
    compensationId: string;
    grossAmount: string;
};

export type PayrollRunResponse = {
    id: string;
    runNumber: string;
    periodStart: string;
    periodEnd: string;
    payDate: string;
    organizationId: string;
    status: PayrollRunStatus;
    lines: PayrollRunLine[];
    totalGross: string;
    currency: string;
    createdBy: string;
    accrualJournalEntryId: string | null;
    paymentJournalEntryId: string | null;
    approvedAt: string | null;
    paidAt: string | null;
    cancelledAt: string | null;
    createdAt: string | null;
    updatedAt: string | null;
};
