"use server";

import { runCreateAction } from "@/lib/api/create-action";
import type { CreateVendorRequest } from "@/lib/api/finance/vendors";
import { createVendor } from "@/lib/api/finance/vendors-dal";
import { partyFormSchema, type PartyFormValues } from "../../../../_data/party-form-schema";

export const createVendorAction = async (values: PartyFormValues) =>
    runCreateAction<PartyFormValues, CreateVendorRequest>({
        values,
        schema: partyFormSchema,
        path: "/finance/ap/vendors",
        errorMessage: "Couldn't create the vendor. Try again.",
        create: createVendor,
        toBody: (v) => ({
            name: v.name,
            contactName: v.contactName?.trim() || null,
            contactEmail: v.contactEmail?.trim() || null,
            contactPhone: v.contactPhone?.trim() || null,
            paymentTermDays: Number(v.paymentTermDays),
            defaultExpenseAccountId: v.defaultAccountId?.trim() || null,
        }),
    });
