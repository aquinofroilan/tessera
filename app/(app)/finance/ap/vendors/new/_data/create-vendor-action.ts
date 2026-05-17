"use server";

import { runCreateAction } from "@/lib/api/create-action";
import type { CreateVendorRequest } from "@/lib/api/finance/vendors";
import { createVendor } from "@/lib/api/finance/vendors-dal";
import { newVendorSchema, type NewVendorValues } from "./new-vendor-schema";

export const createVendorAction = async (values: NewVendorValues) =>
    runCreateAction<NewVendorValues, CreateVendorRequest>({
        values,
        schema: newVendorSchema,
        path: "/finance/ap/vendors",
        errorMessage: "Couldn't create the vendor. Try again.",
        create: createVendor,
        toBody: (v) => ({
            name: v.name,
            contactName: v.contactName?.trim() || null,
            contactEmail: v.contactEmail?.trim() || null,
            contactPhone: v.contactPhone?.trim() || null,
            paymentTermDays: Number(v.paymentTermDays),
            defaultExpenseAccountId: v.defaultExpenseAccountId?.trim() || null,
        }),
    });
