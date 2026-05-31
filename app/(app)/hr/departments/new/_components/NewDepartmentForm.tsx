"use client";

import { DEPARTMENT_FORM_DEFAULTS } from "../../../_data/department-form-schema";
import { DepartmentForm } from "../../_components/DepartmentForm";
import { createDepartmentAction } from "../_data/create-department-action";

export const NewDepartmentForm = () => (
    <DepartmentForm
        defaultValues={DEPARTMENT_FORM_DEFAULTS}
        submitLabel="Create department"
        action={createDepartmentAction}
    />
);
