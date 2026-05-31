import type { IsoDateTime } from "../types";

export type CreateWarehouseRequest = {
    code: string;
    name: string;
    address?: string | null;
    allowNegativeStock: boolean;
    isDefault?: boolean;
};

export type UpdateWarehouseRequest = Partial<CreateWarehouseRequest> & {
    isActive?: boolean | null;
};

export type WarehouseResponse = {
    id: string;
    code: string;
    name: string;
    address: string | null;
    allowNegativeStock: boolean;
    isDefault: boolean;
    isActive: boolean;
    organizationId: string;
    storageLocationCount: number;
    createdAt: IsoDateTime | null;
    updatedAt: IsoDateTime | null;
};
