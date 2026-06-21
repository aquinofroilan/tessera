"use server";

import { runCreateAction } from "@/lib/api/create-action";
import type { CreateDepartmentRequest } from "@/lib/api/hr/departments";
import { createDepartment } from "@/lib/api/hr/departments-dal";
import {
    departmentFormSchema,
    type DepartmentFormValues,
} from "../../../_data/department-form-schema";
import { NONE_SENTINEL } from "../../../_data/select-sentinels";

export const createDepartmentAction = async (values: DepartmentFormValues) =>
    runCreateAction<DepartmentFormValues, CreateDepartmentRequest>({
        values,
        schema: departmentFormSchema,
        path: "/hr/departments",
        errorMessage: "Couldn't create the department. Try again.",
        create: createDepartment,
        toBody: (v) => ({
            code: v.code.trim(),
            name: v.name.trim(),
            description: v.description?.trim() || null,
            parentId: v.parentId && v.parentId !== NONE_SENTINEL ? v.parentId : null,
        }),
    });
