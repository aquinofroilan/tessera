"use server";

import { deactivateLeaveType } from "@/lib/api/hr/leave-types-dal";
import { createDeactivateAction } from "../../../_data/create-deactivate-action";

export const deactivateLeaveTypeAction = createDeactivateAction({
    deactivate: deactivateLeaveType,
    revalidate: (id) => [`/hr/leave-types/${id}`, "/hr/leave-types"],
    errorMessage: "Couldn't deactivate the leave type. Try again.",
});
