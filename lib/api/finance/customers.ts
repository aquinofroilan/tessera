export type CreateCustomerRequest = {
    name: string;
    contactName?: string | null;
    contactEmail?: string | null;
    contactPhone?: string | null;
    paymentTermDays?: number;
    defaultRevenueAccountId?: string | null;
};

export type UpdateCustomerRequest = {
    name?: string | null;
    contactName?: string | null;
    contactEmail?: string | null;
    contactPhone?: string | null;
    paymentTermDays?: number | null;
    defaultRevenueAccountId?: string | null;
};

export type CustomerResponse = {
    id: string;
    name: string;
    contactName: string | null;
    contactEmail: string | null;
    contactPhone: string | null;
    paymentTermDays: number;
    defaultRevenueAccountId: string | null;
    organizationId: string;
    isActive: boolean;
    createdAt: string | null;
    updatedAt: string | null;
};
