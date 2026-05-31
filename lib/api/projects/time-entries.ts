import type { IsoDate, IsoDateTime } from "../types";

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
    entryDate: IsoDate;
    hours: string;
    billable?: boolean;
    rate?: string | null;
    notes?: string | null;
};

export type UpdateTimeEntryRequest = {
    taskId?: string | null;
    entryDate?: IsoDate | null;
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
    entryDate: IsoDate;
    hours: string;
    billable: boolean;
    rate: string | null;
    status: TimeEntryStatus;
    notes: string | null;
    approvedBy: string | null;
    approvedAt: IsoDateTime | null;
    organizationId: string;
    createdAt: IsoDateTime | null;
    updatedAt: IsoDateTime | null;
};
