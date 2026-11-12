export type PayPeriod = "ANNUAL" | "MONTHLY" | "HOURLY";

export const PAY_PERIODS: readonly PayPeriod[] = ["ANNUAL", "MONTHLY", "HOURLY"] as const;

export type CreateEmployeeCompensationRequest = {
    positionId?: string | null;
    payRate: string;
    currency: string;
    payPeriod: PayPeriod;
    effectiveDate: string;
};

export type EmployeeCompensationResponse = {
    id: string;
    employeeId: string;
    positionId: string | null;
    payRate: string;
    currency: string;
    payPeriod: PayPeriod;
    effectiveDate: string;
    organizationId: string;
    createdBy: string;
    createdAt: string | null;
};
