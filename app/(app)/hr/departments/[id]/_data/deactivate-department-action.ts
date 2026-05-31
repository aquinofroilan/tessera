"use server";

import { deactivateDepartment } from "@/lib/api/hr/departments-dal";
import { createDeactivateAction } from "../../../_data/create-deactivate-action";

export const deactivateDepartmentAction = createDeactivateAction({
    deactivate: deactivateDepartment,
    revalidate: (id) => [`/hr/departments/${id}`, "/hr/departments"],
    errorMessage: "Couldn't deactivate the department. Try again.",
});
