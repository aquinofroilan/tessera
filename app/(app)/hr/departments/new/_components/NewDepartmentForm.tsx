"use client";

import { DEPARTMENT_FORM_DEFAULTS } from "../../../_data/department-form-schema";
import { DepartmentForm } from "../../_components/DepartmentForm";
import type { SelectOption } from "../../../_components/form-fields";
import { createDepartmentAction } from "../_data/create-department-action";

type Props = {
    parentOptions: SelectOption[];
};

export const NewDepartmentForm = ({ parentOptions }: Props) => (
    <DepartmentForm
        defaultValues={DEPARTMENT_FORM_DEFAULTS}
        submitLabel="Create department"
        action={createDepartmentAction}
        parentOptions={parentOptions}
    />
);
