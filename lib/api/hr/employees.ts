import type { IsoDate, IsoDateTime } from "../types";

export type EmploymentStatus = "ACTIVE" | "ON_LEAVE" | "TERMINATED";

export const EMPLOYMENT_STATUSES: readonly EmploymentStatus[] = [
    "ACTIVE",
    "ON_LEAVE",
    "TERMINATED",
] as const;

export type CreateEmployeeRequest = {
    firstName: string;
    lastName: string;
    email?: string | null;
    jobTitle?: string | null;
    departmentId?: string | null;
    hireDate: IsoDate;
};

export type UpdateEmployeeRequest = {
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    jobTitle?: string | null;
};

export type TerminateEmployeeRequest = {
    terminationDate: IsoDate;
};

export type EmployeeResponse = {
    id: string;
    employeeNumber: string;
    firstName: string;
    lastName: string;
    email: string | null;
    jobTitle: string | null;
    departmentId: string | null;
    hireDate: IsoDate;
    status: EmploymentStatus;
    terminationDate: IsoDate | null;
    organizationId: string;
    createdAt: IsoDateTime | null;
    updatedAt: IsoDateTime | null;
};
