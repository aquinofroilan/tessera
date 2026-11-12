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
    hireDate: string;
};

export type UpdateEmployeeRequest = {
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    jobTitle?: string | null;
};

export type TerminateEmployeeRequest = {
    terminationDate: string;
};

export type EmployeeResponse = {
    id: string;
    employeeNumber: string;
    firstName: string;
    lastName: string;
    email: string | null;
    jobTitle: string | null;
    departmentId: string | null;
    hireDate: string;
    status: EmploymentStatus;
    terminationDate: string | null;
    organizationId: string;
    createdAt: string | null;
    updatedAt: string | null;
};
