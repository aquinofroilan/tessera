"use server";

import { runCreateAction } from "@/lib/api/create-action";
import type { CreatePositionRequest } from "@/lib/api/hr/positions";
import { createPosition } from "@/lib/api/hr/positions-dal";
import {
    positionFormSchema,
    type PositionFormValues,
} from "../../../_data/position-form-schema";

export const createPositionAction = async (values: PositionFormValues) =>
    runCreateAction<PositionFormValues, CreatePositionRequest>({
        values,
        schema: positionFormSchema,
        path: "/hr/positions",
        errorMessage: "Couldn't create the position. Try again.",
        create: createPosition,
        toBody: (v) => ({
            code: v.code.trim(),
            title: v.title.trim(),
            departmentId: v.departmentId?.trim() || null,
            payGrade: v.payGrade?.trim() || null,
        }),
    });
