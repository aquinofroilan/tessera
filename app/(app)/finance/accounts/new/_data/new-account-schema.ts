import { z } from "zod";

export const newAccountSchema = z.object({
    code: z.string().trim().min(1, "Required"),
    name: z.string().trim().min(1, "Required"),
    type: z.string().min(1, "Required"),
    parentId: z.string().trim().optional(),
    description: z.string().trim().optional(),
});

export type NewAccountValues = z.infer<typeof newAccountSchema>;
