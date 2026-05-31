import type { IsoDateTime } from "../types";

export type CreateUomRequest = {
    code: string;
    name: string;
    precision: number;
};

export type UomResponse = {
    id: string;
    code: string;
    name: string;
    precision: number;
    organizationId: string;
    createdAt: IsoDateTime | null;
    updatedAt: IsoDateTime | null;
};
