"use client";

import { IconArrowRight, IconCheck, IconLoader2 } from "@tabler/icons-react";

import { Button } from "@/components/ui";

export type AuthSubmitStatus = "idle" | "submitting" | "success";

type AuthSubmitButtonProps = {
    status: AuthSubmitStatus;
    idleLabel: string;
    submittingLabel: string;
    successLabel: string;
};

export function AuthSubmitButton({ status, idleLabel, submittingLabel, successLabel }: AuthSubmitButtonProps) {
    const disabled = status !== "idle";
    return (
        <Button
            type="submit"
            variant={status === "success" ? "pill-success" : "pill"}
            size="pill-lg"
            disabled={disabled}
            className="mt-1.5 w-full">
            {status === "idle" && (
                <>
                    {idleLabel}
                    <IconArrowRight className="size-4" />
                </>
            )}
            {status === "submitting" && (
                <>
                    <IconLoader2 className="size-4 animate-[spin_0.9s_linear_infinite]" />
                    {submittingLabel}
                </>
            )}
            {status === "success" && (
                <>
                    <IconCheck className="size-4" />
                    {successLabel}
                </>
            )}
        </Button>
    );
}
