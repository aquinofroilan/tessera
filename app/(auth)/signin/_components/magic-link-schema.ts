import { z } from "zod";

export const magicLinkSchema = z.object({
    email: z.email("Enter a valid work email").trim().toLowerCase(),
});

export type MagicLinkValues = z.infer<typeof magicLinkSchema>;
