"use client";

import { ArchiveButton } from "../../../_components/ArchiveButton";
import { deactivateDepartmentAction } from "../_data/deactivate-department-action";

type Props = {
    departmentId: string;
    isActive: boolean;
};

export const DepartmentDeactivateButton = ({ departmentId, isActive }: Props) => (
    <ArchiveButton
        isActive={isActive}
        action={() => deactivateDepartmentAction(departmentId)}
        successMessage="Department archived."
    />
);
