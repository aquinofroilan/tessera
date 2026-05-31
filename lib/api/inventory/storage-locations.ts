import type { IsoDateTime } from "../types";

export type CreateStorageLocationRequest = {
    code: string;
    name: string;
    parentLocationId?: string | null;
};

export type StorageLocationResponse = {
    id: string;
    warehouseId: string;
    code: string;
    name: string;
    parentLocationId: string | null;
    isActive: boolean;
    organizationId: string;
    createdAt: IsoDateTime | null;
    updatedAt: IsoDateTime | null;
};
