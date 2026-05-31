"use server";

import { runUpdateAction } from "@/lib/api/update-action";
import type { UpdateEmployeeRequest } from "@/lib/api/hr/employees";
import { updateEmployee } from "@/lib/api/hr/employees-dal";
import {
    employeeUpdateSchema,
    type EmployeeUpdateValues,
} from "../../../_data/employee-form-schema";

export const updateEmployeeAction = async (id: string, values: EmployeeUpdateValues) =>
    runUpdateAction<EmployeeUpdateValues, UpdateEmployeeRequest>({
        values,
        schema: employeeUpdateSchema,
        revalidate: ["/hr/employees", `/hr/employees/${id}`],
        redirectTo: `/hr/employees/${id}`,
        errorMessage: "Couldn't update the employee. Try again.",
        update: (body) => updateEmployee(id, body),
        toBody: (v) => ({
            firstName: v.firstName.trim(),
            lastName: v.lastName.trim(),
            email: v.email?.trim() || null,
            jobTitle: v.jobTitle?.trim() || null,
        }),
    });
