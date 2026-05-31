"use client";

import { ArchiveButton } from "../../../_components/ArchiveButton";
import { deactivateLeaveTypeAction } from "../_data/deactivate-leave-type-action";

type Props = { id: string; isActive: boolean };

export const LeaveTypeDeactivateButton = ({ id, isActive }: Props) => (
    <ArchiveButton
        isActive={isActive}
        action={() => deactivateLeaveTypeAction(id)}
        successMessage="Leave type archived."
    />
);
