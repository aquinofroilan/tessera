"use server";

import { runCreateAction } from "@/lib/api/create-action";
import type { CreateEmployeeRequest } from "@/lib/api/hr/employees";
import { createEmployee } from "@/lib/api/hr/employees-dal";
import {
    employeeFormSchema,
    type EmployeeFormValues,
} from "../../../_data/employee-form-schema";

export const createEmployeeAction = async (values: EmployeeFormValues) =>
    runCreateAction<EmployeeFormValues, CreateEmployeeRequest>({
        values,
        schema: employeeFormSchema,
        path: "/hr/employees",
        errorMessage: "Couldn't create the employee. Try again.",
        create: createEmployee,
        toBody: (v) => ({
            firstName: v.firstName.trim(),
            lastName: v.lastName.trim(),
            email: v.email?.trim() || null,
            jobTitle: v.jobTitle?.trim() || null,
            departmentId: v.departmentId?.trim() || null,
            hireDate: v.hireDate,
        }),
    });
