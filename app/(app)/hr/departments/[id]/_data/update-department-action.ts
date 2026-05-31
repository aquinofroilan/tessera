"use server";

import { runUpdateAction } from "@/lib/api/update-action";
import type { UpdateDepartmentRequest } from "@/lib/api/hr/departments";
import { updateDepartment } from "@/lib/api/hr/departments-dal";
import {
    departmentUpdateSchema,
    type DepartmentUpdateValues,
} from "../../../_data/department-update-schema";

export const updateDepartmentAction = async (id: string, values: DepartmentUpdateValues) =>
    runUpdateAction<DepartmentUpdateValues, UpdateDepartmentRequest>({
        values,
        schema: departmentUpdateSchema,
        revalidate: ["/hr/departments", `/hr/departments/${id}`],
        redirectTo: `/hr/departments/${id}`,
        errorMessage: "Couldn't update the department. Try again.",
        update: (body) => updateDepartment(id, body),
        toBody: (v) => ({
            name: v.name.trim(),
            description: v.description?.trim() || null,
        }),
    });
