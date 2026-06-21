import { z } from "zod";

import { NONE_SENTINEL } from "./select-sentinels";

export const departmentFormSchema = z.object({
    code: z.string().trim().min(1, "Required").max(32, "Too long"),
    name: z.string().trim().min(1, "Required").max(120, "Too long"),
    description: z.string().trim().optional(),
    parentId: z.string().trim().optional(),
});

export type DepartmentFormValues = z.infer<typeof departmentFormSchema>;

export const DEPARTMENT_FORM_DEFAULTS: DepartmentFormValues = {
    code: "",
    name: "",
    description: "",
    parentId: NONE_SENTINEL,
};
