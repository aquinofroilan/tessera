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
    createdAt: string | null;
    updatedAt: string | null;
};
