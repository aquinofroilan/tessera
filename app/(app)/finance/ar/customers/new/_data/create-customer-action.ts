"use server";

import { runCreateAction } from "@/lib/api/create-action";
import type { CreateCustomerRequest } from "@/lib/api/finance/customers";
import { createCustomer } from "@/lib/api/finance/customers-dal";
import { newCustomerSchema, type NewCustomerValues } from "./new-customer-schema";

export const createCustomerAction = async (values: NewCustomerValues) =>
    runCreateAction<NewCustomerValues, CreateCustomerRequest>({
        values,
        schema: newCustomerSchema,
        path: "/finance/ar/customers",
        errorMessage: "Couldn't create the customer. Try again.",
        create: createCustomer,
        toBody: (v) => ({
            name: v.name,
            contactName: v.contactName?.trim() || null,
            contactEmail: v.contactEmail?.trim() || null,
            contactPhone: v.contactPhone?.trim() || null,
            paymentTermDays: Number(v.paymentTermDays),
            defaultRevenueAccountId: v.defaultRevenueAccountId?.trim() || null,
        }),
    });
