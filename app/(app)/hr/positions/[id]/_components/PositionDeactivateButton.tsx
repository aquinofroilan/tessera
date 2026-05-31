"use client";

import { ArchiveButton } from "../../../_components/ArchiveButton";
import { deactivatePositionAction } from "../_data/deactivate-position-action";

type Props = { id: string; isActive: boolean };

export const PositionDeactivateButton = ({ id, isActive }: Props) => (
    <ArchiveButton
        isActive={isActive}
        action={() => deactivatePositionAction(id)}
        successMessage="Position archived."
    />
);
