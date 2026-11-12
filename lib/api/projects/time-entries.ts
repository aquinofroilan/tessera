export type TimeEntryStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED";

export const TIME_ENTRY_STATUSES: readonly TimeEntryStatus[] = [
    "DRAFT",
    "SUBMITTED",
    "APPROVED",
    "REJECTED",
] as const;

export type CreateTimeEntryRequest = {
    employeeId: string;
    projectId: string;
    taskId?: string | null;
    entryDate: string;
    hours: string;
    billable?: boolean;
    rate?: string | null;
    notes?: string | null;
};

export type UpdateTimeEntryRequest = {
    taskId?: string | null;
    entryDate?: string | null;
    hours?: string | null;
    billable?: boolean | null;
    rate?: string | null;
    notes?: string | null;
};

export type TimeEntryResponse = {
    id: string;
    employeeId: string;
    projectId: string;
    taskId: string | null;
    entryDate: string;
    hours: string;
    billable: boolean;
    rate: string | null;
    status: TimeEntryStatus;
    notes: string | null;
    approvedBy: string | null;
    approvedAt: string | null;
    invoiced: boolean;
    invoiceId: string | null;
    organizationId: string;
    createdAt: string | null;
    updatedAt: string | null;
};
