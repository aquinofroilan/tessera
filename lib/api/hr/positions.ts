import type { IsoDateTime } from "../types";

export type CreatePositionRequest = {
    code: string;
    title: string;
    departmentId?: string | null;
    payGrade?: string | null;
};

export type UpdatePositionRequest = {
    title?: string | null;
    departmentId?: string | null;
    payGrade?: string | null;
};

export type PositionResponse = {
    id: string;
    code: string;
    title: string;
    departmentId: string | null;
    payGrade: string | null;
    organizationId: string;
    isActive: boolean;
    createdAt: IsoDateTime | null;
    updatedAt: IsoDateTime | null;
};
