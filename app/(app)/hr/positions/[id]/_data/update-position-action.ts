"use server";

import { runUpdateAction } from "@/lib/api/update-action";
import type { UpdatePositionRequest } from "@/lib/api/hr/positions";
import { updatePosition } from "@/lib/api/hr/positions-dal";
import {
    positionUpdateSchema,
    type PositionUpdateValues,
} from "../../../_data/position-form-schema";

export const updatePositionAction = async (id: string, values: PositionUpdateValues) =>
    runUpdateAction<PositionUpdateValues, UpdatePositionRequest>({
        values,
        schema: positionUpdateSchema,
        revalidate: ["/hr/positions", `/hr/positions/${id}`],
        redirectTo: `/hr/positions/${id}`,
        errorMessage: "Couldn't update the position. Try again.",
        update: (body) => updatePosition(id, body),
        toBody: (v) => ({
            title: v.title.trim(),
            departmentId: v.departmentId?.trim() || null,
            payGrade: v.payGrade?.trim() || null,
        }),
    });
