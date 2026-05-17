"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { AuthSubmitStatus } from "./AuthSubmitButton";

export const useAuthSubmitState = (options?: { redirectTo?: string }) => {
    const router = useRouter();
    const [status, setStatus] = useState<AuthSubmitStatus>("idle");
    const [error, setError] = useState<string | null>(null);

    const submit = async (handler: () => Promise<void>) => {
        setStatus("submitting");
        setError(null);
        try {
            await handler();
            setStatus("success");
            if (options?.redirectTo) {
                router.replace(options.redirectTo);
                router.refresh();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
            setStatus("idle");
        }
    };

    return { status, error, submit, disabled: status !== "idle" };
};
