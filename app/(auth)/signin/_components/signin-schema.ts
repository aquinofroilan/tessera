import { z } from "zod";

export const signinSchema = z.object({
  email: z.email("Enter a valid work email").trim().toLowerCase(),
  password: z.string().min(1, "Required"),
  remember: z.boolean().optional(),
});

export type SigninValues = z.infer<typeof signinSchema>;
