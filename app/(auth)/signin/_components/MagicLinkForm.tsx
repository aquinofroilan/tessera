"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui";
import { AuthFinePrint } from "../../_components/AuthFinePrint";
import { AuthSubmitButton } from "../../_components/AuthSubmitButton";
import { EmailFormField } from "../../_components/EmailFormField";
import { useAuthSubmitState } from "../../_components/useAuthSubmitState";
import { magicLinkSchema, type MagicLinkValues } from "./magic-link-schema";

type MagicLinkFormProps = {
    onSwitchToPassword: () => void;
};

export function MagicLinkForm({ onSwitchToPassword }: MagicLinkFormProps) {
    const router = useRouter();
    const { status, error, submit, disabled } = useAuthSubmitState();
    const [pendingEmail, setPendingEmail] = useState<string | null>(null);
    const form = useForm<MagicLinkValues>({
        resolver: zodResolver(magicLinkSchema),
        mode: "onBlur",
        defaultValues: { email: "" },
    });

    const onSubmit = form.handleSubmit(async (values) => {
        setPendingEmail(values.email);
        await submit(async () => {
            const response = await fetch("/api/auth/login-link/request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });
            if (!response.ok) {
                const data = (await response.json().catch(() => null)) as { error?: string } | null;
                throw new Error(data?.error ?? "Couldn't send the link. Try again.");
            }
            router.push(`/signin/sent?email=${encodeURIComponent(values.email)}`);
        });
    });

    return (
        <Form {...form}>
            <form className="grid gap-4" onSubmit={onSubmit} noValidate>
                <p className="text-[13px] text-(--ink-soft)">
                    We&rsquo;ll email a one-time sign-in link. No password needed.
                </p>

                <EmailFormField control={form.control} name="email" disabled={disabled} />

                {error && (
                    <p role="alert" className="text-[13px] text-(--accent)">
                        {error}
                    </p>
                )}

                <AuthSubmitButton
                    status={status}
                    idleLabel="Email me a sign-in link"
                    submittingLabel={pendingEmail ? `Sending to ${pendingEmail}…` : "Sending…"}
                    successLabel="Check your inbox"
                />

                <button
                    type="button"
                    onClick={onSwitchToPassword}
                    disabled={disabled}
                    className="cursor-pointer self-center font-mono text-[10px] tracking-[0.08em] text-(--ink-soft) uppercase no-underline transition-colors hover:text-(--accent) disabled:cursor-not-allowed disabled:opacity-60">
                    Use a password instead
                </button>

                <AuthFinePrint items={["End-to-end encrypted", "Link expires in 15 minutes", "One-time use"]} />
            </form>
        </Form>
    );
}
