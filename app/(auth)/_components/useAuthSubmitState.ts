"use client";

import { useState } from "react";

import type { AuthSubmitStatus } from "./AuthSubmitButton";

export function useAuthSubmitState() {
    const [status, setStatus] = useState<AuthSubmitStatus>("idle");

    const submit = async (handler: () => Promise<void>) => {
        setStatus("submitting");
        try {
            await handler();
            setStatus("success");
        } catch (error) {
            console.error(error);
            setStatus("idle");
        }
    };

    return { status, submit, disabled: status !== "idle" };
}
