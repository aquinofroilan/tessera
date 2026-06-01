import type { IsoDateTime } from "../types";

export type CreateDepartmentRequest = {
    code: string;
    name: string;
    description?: string | null;
    parentId?: string | null;
};

export type UpdateDepartmentRequest = {
    name?: string | null;
    description?: string | null;
};

export type SetDepartmentParentRequest = {
    parentId: string | null;
};

export type DepartmentResponse = {
    id: string;
    code: string;
    name: string;
    description: string | null;
    parentId: string | null;
    organizationId: string;
    isActive: boolean;
    createdAt: IsoDateTime | null;
    updatedAt: IsoDateTime | null;
};

export type DepartmentTreeNode = {
    id: string;
    code: string;
    name: string;
    isActive: boolean;
    children: DepartmentTreeNode[];
};
