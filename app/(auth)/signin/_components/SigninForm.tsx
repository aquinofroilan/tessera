"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconEye, IconEyeOff, IconLock } from "@tabler/icons-react";

import {
    Button,
    Checkbox,
    Form,
    FormControl,
    FormDivider,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    IconInput,
    Label,
} from "@/components/ui";
import { AuthFinePrint } from "../../_components/AuthFinePrint";
import { AuthSubmitButton } from "../../_components/AuthSubmitButton";
import { EmailFormField } from "../../_components/EmailFormField";
import { useAuthSubmitState } from "../../_components/useAuthSubmitState";
import { signinSchema, type SigninValues } from "./signin-schema";
import { SsoButtons } from "./SsoButtons";

export function SigninForm() {
    const { status, error, submit, disabled } = useAuthSubmitState({ redirectTo: "/" });
    const [showPassword, setShowPassword] = useState(false);
    const form = useForm<SigninValues>({
        resolver: zodResolver(signinSchema),
        mode: "onBlur",
        defaultValues: {
            email: "",
            password: "",
            remember: true,
        },
    });

    const onSubmit = form.handleSubmit(async (values) => {
        await submit(async () => {
            const response = await fetch("/api/auth/signin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });
            if (!response.ok) {
                const data = (await response.json().catch(() => null)) as { error?: string } | null;
                throw new Error(data?.error ?? "Couldn't sign you in. Try again.");
            }
        });
    });

    return (
        <Form {...form}>
            <form className="grid gap-4" onSubmit={onSubmit} noValidate>
                <SsoButtons disabled={disabled} />

                <FormDivider label="or with email" />

                <EmailFormField control={form.control} name="email" disabled={disabled} />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem className="gap-1.5">
                            <div className="flex items-center justify-between">
                                <FormLabel asChild>
                                    <Label variant="eyebrow">
                                        Password <span className="text-(--accent)">*</span>
                                    </Label>
                                </FormLabel>
                                <Link
                                    href="#"
                                    className="font-mono text-[10px] tracking-[0.08em] text-(--ink-soft) uppercase no-underline transition-colors hover:text-(--accent)">
                                    Forgot?
                                </Link>
                            </div>
                            <FormControl>
                                <IconInput
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Your password"
                                    autoComplete="current-password"
                                    disabled={disabled}
                                    startIcon={<IconLock className="size-4" />}
                                    endAdornment={
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon-sm"
                                            onClick={() => setShowPassword((v) => !v)}
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                            className="hover:text-foreground rounded-md text-(--muted) hover:bg-(--paper-2)">
                                            {showPassword ? (
                                                <IconEyeOff className="size-4" />
                                            ) : (
                                                <IconEye className="size-4" />
                                            )}
                                        </Button>
                                    }
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="remember"
                    render={({ field }) => (
                        <FormItem className="mt-1">
                            <div className="flex items-center gap-2.5">
                                <FormControl>
                                    <Checkbox
                                        checked={!!field.value}
                                        onCheckedChange={(value) => field.onChange(value === true)}
                                        disabled={disabled}
                                    />
                                </FormControl>
                                <span className="text-[13px] text-(--ink-soft)">
                                    Keep me signed in on this device for 30 days.
                                </span>
                            </div>
                        </FormItem>
                    )}
                />

                {error && (
                    <p role="alert" className="text-[13px] text-(--accent)">
                        {error}
                    </p>
                )}

                <AuthSubmitButton
                    status={status}
                    idleLabel="Sign in"
                    submittingLabel="Signing you in…"
                    successLabel="Signed in · redirecting"
                />

                <AuthFinePrint items={["End-to-end encrypted", "SOC 2 Type II", "MFA available"]} />
            </form>
        </Form>
    );
}
