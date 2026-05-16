import "server-only";

import { z } from "zod";

const isAbsoluteUrl = (value: string): boolean => {
    try {
        new URL(value);
        return true;
    } catch {
        return false;
    }
};

const envSchema = z.object({
    BACKEND_API_URL: z
        .string()
        .min(1, "BACKEND_API_URL is required")
        .refine(isAbsoluteUrl, "BACKEND_API_URL must be an absolute URL (e.g. http://localhost:8080)"),
    BACKEND_API_TIMEOUT_MS: z.coerce.number().int().positive().default(10_000),
    BACKEND_API_TOKEN: z.string().min(1).optional(),
});

export type ServerEnv = z.infer<typeof envSchema>;

let cached: ServerEnv | undefined;

export const serverEnv = (): ServerEnv => {
    if (cached) return cached;

    const parsed = envSchema.safeParse({
        BACKEND_API_URL: process.env.BACKEND_API_URL,
        BACKEND_API_TIMEOUT_MS: process.env.BACKEND_API_TIMEOUT_MS,
        BACKEND_API_TOKEN: process.env.BACKEND_API_TOKEN,
    });

    if (!parsed.success) {
        const issues = parsed.error.issues
            .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
            .join("\n");
        throw new Error(`Invalid backend environment configuration:\n${issues}`);
    }

    cached = parsed.data;
    return cached;
};
