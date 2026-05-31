"use server";

import { deactivatePosition } from "@/lib/api/hr/positions-dal";
import { createDeactivateAction } from "../../../_data/create-deactivate-action";

export const deactivatePositionAction = createDeactivateAction({
    deactivate: deactivatePosition,
    revalidate: (id) => [`/hr/positions/${id}`, "/hr/positions"],
    errorMessage: "Couldn't deactivate the position. Try again.",
});
