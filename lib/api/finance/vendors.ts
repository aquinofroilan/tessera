export type CreateVendorRequest = {
    name: string;
    contactName?: string | null;
    contactEmail?: string | null;
    contactPhone?: string | null;
    paymentTermDays?: number;
    defaultExpenseAccountId?: string | null;
};

export type UpdateVendorRequest = {
    name?: string | null;
    contactName?: string | null;
    contactEmail?: string | null;
    contactPhone?: string | null;
    paymentTermDays?: number | null;
    defaultExpenseAccountId?: string | null;
};

export type VendorResponse = {
    id: string;
    name: string;
    contactName: string | null;
    contactEmail: string | null;
    contactPhone: string | null;
    paymentTermDays: number;
    defaultExpenseAccountId: string | null;
    organizationId: string;
    isActive: boolean;
    createdAt: string | null;
    updatedAt: string | null;
};
