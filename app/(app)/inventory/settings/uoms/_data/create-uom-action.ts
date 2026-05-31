"use server";

import { runCreateAction } from "@/lib/api/create-action";
import type { CreateUomRequest } from "@/lib/api/inventory/uoms";
import { createUom } from "@/lib/api/inventory/uoms-dal";
import { uomFormSchema, type UomFormValues } from "../../../_data/uom-form-schema";

export const createUomAction = async (values: UomFormValues) =>
    runCreateAction<UomFormValues, CreateUomRequest>({
        values,
        schema: uomFormSchema,
        toBody: (data) => ({
            code: data.code.trim().toUpperCase(),
            name: data.name.trim(),
            precision: Number(data.precision),
        }),
        create: createUom,
        path: "/inventory/settings/uoms",
        errorMessage: "Couldn't add the unit. Try again.",
    });
