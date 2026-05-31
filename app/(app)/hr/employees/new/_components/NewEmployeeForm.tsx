"use client";

import { useMemo } from "react";

import { EmployeeForm, type DepartmentOption } from "../../_components/EmployeeForm";
import { employeeFormDefaults } from "../../../_data/employee-form-schema";
import { createEmployeeAction } from "../_data/create-employee-action";

type Props = { departments: DepartmentOption[] };

export const NewEmployeeForm = ({ departments }: Props) => {
    const defaults = useMemo(() => employeeFormDefaults(), []);
    return (
        <EmployeeForm
            defaultValues={defaults}
            submitLabel="Hire employee"
            departments={departments}
            action={createEmployeeAction}
        />
    );
};
