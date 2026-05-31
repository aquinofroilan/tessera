import type { IsoDate, IsoDateTime, Money } from "../types";

export type PayPeriod = "ANNUAL" | "MONTHLY" | "HOURLY";

export const PAY_PERIODS: readonly PayPeriod[] = ["ANNUAL", "MONTHLY", "HOURLY"] as const;

export type CreateEmployeeCompensationRequest = {
    positionId?: string | null;
    payRate: Money;
    currency: string;
    payPeriod: PayPeriod;
    effectiveDate: IsoDate;
};

export type EmployeeCompensationResponse = {
    id: string;
    employeeId: string;
    positionId: string | null;
    payRate: Money;
    currency: string;
    payPeriod: PayPeriod;
    effectiveDate: IsoDate;
    organizationId: string;
    createdBy: string;
    createdAt: IsoDateTime | null;
};
