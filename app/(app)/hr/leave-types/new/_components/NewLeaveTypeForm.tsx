"use client";

import { LEAVE_TYPE_FORM_DEFAULTS } from "../../../_data/leave-type-form-schema";
import { LeaveTypeForm } from "../../_components/LeaveTypeForm";
import { createLeaveTypeAction } from "../_data/create-leave-type-action";

export const NewLeaveTypeForm = () => (
    <LeaveTypeForm
        defaultValues={LEAVE_TYPE_FORM_DEFAULTS}
        submitLabel="Create leave type"
        action={createLeaveTypeAction}
    />
);
