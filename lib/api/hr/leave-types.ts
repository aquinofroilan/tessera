import type { IsoDateTime } from "../types";

export type CreateLeaveTypeRequest = {
    code: string;
    name: string;
    paid: boolean;
    defaultAnnualDays: number;
};

export type UpdateLeaveTypeRequest = {
    name?: string | null;
    paid?: boolean | null;
    defaultAnnualDays?: number | null;
};

export type LeaveTypeResponse = {
    id: string;
    code: string;
    name: string;
    paid: boolean;
    defaultAnnualDays: number;
    organizationId: string;
    isActive: boolean;
    createdAt: IsoDateTime | null;
    updatedAt: IsoDateTime | null;
};
