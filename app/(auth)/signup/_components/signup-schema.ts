import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  role: z.string().trim().optional(),
  email: z.email("Enter a valid work email").trim().toLowerCase(),
  company: z.string().trim().min(1, "Required"),
  password: z.string().min(10, "At least 10 characters"),
  terms: z.literal(true, { message: "You must agree to continue" }),
});

export type SignupValues = z.infer<typeof signupSchema>;

export type PasswordStrength = {
  score: 0 | 1 | 2 | 3 | 4;
  label: "Empty" | "Too short" | "Weak" | "Fair" | "Good" | "Strong";
};

export function scorePassword(value: string): PasswordStrength {
  if (!value) return { score: 0, label: "Empty" };

  let score = 0;
  if (value.length >= 10) score++;
  if (value.length >= 14) score++;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
  if (/\d/.test(value) && /[^A-Za-z0-9]/.test(value)) score++;

  if (score === 0) return { score: 0, label: "Too short" };
  const labels = ["Weak", "Fair", "Good", "Strong"] as const;
  return { score: score as 1 | 2 | 3 | 4, label: labels[score - 1] };
}
