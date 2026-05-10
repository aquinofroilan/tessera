"use client";

// TODO: wire to a real signin endpoint when the backend is ready.

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FormDivider } from "@/components/ui/form-divider";
import { IconInput } from "@/components/ui/icon-input";
import { Label } from "@/components/ui/label";
import { IconArrowRight, IconCheck, IconEye, IconEyeOff, IconLoader2, IconLock, IconMail } from "@tabler/icons-react";
import { signinSchema, type SigninValues } from "./signin-schema";
import { SsoButtons } from "./SsoButtons";

type Status = "idle" | "submitting" | "success";

export function SigninForm() {
    const [status, setStatus] = useState<Status>("idle");
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

    const onSubmit = form.handleSubmit(async () => {
        setStatus("submitting");
        await new Promise((resolve) => setTimeout(resolve, 1400));
        setStatus("success");
    });

    const disabled = status !== "idle";

    return (
        <Form {...form}>
            <form className="grid gap-4" onSubmit={onSubmit} noValidate>
                <SsoButtons disabled={disabled} />

                <FormDivider label="or with email" />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="gap-1.5">
                            <FormLabel asChild>
                                <Label variant="eyebrow">
                                    Work email <span className="text-[var(--accent)]">*</span>
                                </Label>
                            </FormLabel>
                            <FormControl>
                                <IconInput
                                    type="email"
                                    placeholder="emma@hollisdray.co"
                                    autoComplete="email"
                                    disabled={disabled}
                                    startIcon={<IconMail className="h-4 w-4" />}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem className="gap-1.5">
                            <div className="flex items-center justify-between">
                                <FormLabel asChild>
                                    <Label variant="eyebrow">
                                        Password <span className="text-[var(--accent)]">*</span>
                                    </Label>
                                </FormLabel>
                                <Link
                                    href="#"
                                    className="font-mono text-[10px] tracking-[0.08em] text-[var(--ink-soft)] uppercase no-underline transition-colors hover:text-[var(--accent)]">
                                    Forgot?
                                </Link>
                            </div>
                            <FormControl>
                                <IconInput
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Your password"
                                    autoComplete="current-password"
                                    disabled={disabled}
                                    startIcon={<IconLock className="h-4 w-4" />}
                                    endAdornment={
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon-sm"
                                            onClick={() => setShowPassword((v) => !v)}
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                            className="rounded-md text-[var(--muted)] hover:bg-[var(--paper-2)] hover:text-[var(--ink)]">
                                            {showPassword ? (
                                                <IconEyeOff className="h-4 w-4" />
                                            ) : (
                                                <IconEye className="h-4 w-4" />
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
                                <span className="text-[13px] text-[var(--ink-soft)]">
                                    Keep me signed in on this device for 30 days.
                                </span>
                            </div>
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    variant={status === "success" ? "pill-success" : "pill"}
                    size="pill-lg"
                    disabled={disabled}
                    className="mt-1.5 w-full">
                    {status === "idle" && (
                        <>
                            Sign in
                            <IconArrowRight className="h-4 w-4" />
                        </>
                    )}
                    {status === "submitting" && (
                        <>
                            <IconLoader2 className="h-4 w-4 animate-[spin_0.9s_linear_infinite]" />
                            Signing you in…
                        </>
                    )}
                    {status === "success" && (
                        <>
                            <IconCheck className="h-4 w-4" />
                            Signed in · redirecting
                        </>
                    )}
                </Button>

                <div className="mt-3 flex flex-wrap gap-4 font-mono text-[11px] tracking-[0.04em] text-[var(--muted)]">
                    {["End-to-end encrypted", "SOC 2 Type II", "MFA available"].map((text) => (
                        <span key={text} className="inline-flex items-center gap-1.5">
                            <IconCheck className="h-3 w-3" stroke={2.4} />
                            {text}
                        </span>
                    ))}
                </div>
            </form>
        </Form>
    );
}
