import type { IsoDate, IsoDateTime } from "../types";

export type ProjectStatus = "PLANNED" | "ACTIVE" | "ON_HOLD" | "CLOSED" | "CANCELLED";

export const PROJECT_STATUSES: readonly ProjectStatus[] = [
    "PLANNED",
    "ACTIVE",
    "ON_HOLD",
    "CLOSED",
    "CANCELLED",
] as const;

export type ProjectBillingType = "TIME_AND_MATERIALS" | "FIXED_PRICE" | "MILESTONE";

export const PROJECT_BILLING_TYPES: readonly ProjectBillingType[] = [
    "TIME_AND_MATERIALS",
    "FIXED_PRICE",
    "MILESTONE",
] as const;

export type CreateProjectRequest = {
    name: string;
    description?: string | null;
    customerId?: string | null;
    managerEmployeeId?: string | null;
    startDate: IsoDate;
    endDate?: IsoDate | null;
    billingType?: ProjectBillingType | null;
};

export type UpdateProjectRequest = {
    name?: string | null;
    description?: string | null;
    customerId?: string | null;
    managerEmployeeId?: string | null;
    endDate?: IsoDate | null;
    billingType?: ProjectBillingType | null;
};

export type ProjectResponse = {
    id: string;
    projectNumber: string;
    name: string;
    description: string | null;
    customerId: string | null;
    managerEmployeeId: string | null;
    startDate: IsoDate;
    endDate: IsoDate | null;
    status: ProjectStatus;
    billingType: ProjectBillingType;
    organizationId: string;
    createdAt: IsoDateTime | null;
    updatedAt: IsoDateTime | null;
};
