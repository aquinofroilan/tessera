"use server";

import { runCreateAction } from "@/lib/api/create-action";
import type { CreateCustomerRequest } from "@/lib/api/finance/customers";
import { createCustomer } from "@/lib/api/finance/customers-dal";
import { partyFormSchema, type PartyFormValues } from "../../../../_data/party-form-schema";

export const createCustomerAction = async (values: PartyFormValues) =>
    runCreateAction<PartyFormValues, CreateCustomerRequest>({
        values,
        schema: partyFormSchema,
        path: "/finance/ar/customers",
        errorMessage: "Couldn't create the customer. Try again.",
        create: createCustomer,
        toBody: (v) => ({
            name: v.name,
            contactName: v.contactName?.trim() || null,
            contactEmail: v.contactEmail?.trim() || null,
            contactPhone: v.contactPhone?.trim() || null,
            paymentTermDays: Number(v.paymentTermDays),
            defaultRevenueAccountId: v.defaultAccountId?.trim() || null,
        }),
    });
