import { z } from "zod";

export const storageLocationFormSchema = z.object({
    code: z.string().trim().min(1, "Required").max(32, "Too long"),
    name: z.string().trim().min(1, "Required").max(120, "Too long"),
    parentLocationId: z.string().trim().optional(),
});

export type StorageLocationFormValues = z.infer<typeof storageLocationFormSchema>;

export const STORAGE_LOCATION_FORM_DEFAULTS: StorageLocationFormValues = {
    code: "",
    name: "",
    parentLocationId: "",
};
