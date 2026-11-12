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
    createdAt: string | null;
    updatedAt: string | null;
};
