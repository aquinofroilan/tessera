"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconBuilding } from "@tabler/icons-react";

import {
    Checkbox,
    Form,
    FormControl,
    FormDivider,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    IconInput,
    Input,
    Label,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui";
import { AuthFinePrint } from "../../_components/AuthFinePrint";
import { AuthSubmitButton } from "../../_components/AuthSubmitButton";
import { EmailFormField } from "../../_components/EmailFormField";
import { useAuthSubmitState } from "../../_components/useAuthSubmitState";
import { CURRENCIES, signupSchema, type SignupValues } from "./signup-schema";
import { PasswordField } from "./PasswordField";
import { SsoButtons } from "./SsoButtons";

export const SignupForm = () => {
    const { status, error, submit, disabled } = useAuthSubmitState({ redirectTo: "/" });
    const form = useForm<SignupValues>({
        resolver: zodResolver(signupSchema),
        mode: "onBlur",
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            company: "",
            password: "",
            baseCurrency: "USD",
            terms: false as unknown as true,
        },
    });

    const onSubmit = form.handleSubmit(async (values) => {
        await submit(async () => {
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...values, timezone }),
            });
            if (!response.ok) {
                const data = (await response.json().catch(() => null)) as { error?: string } | null;
                throw new Error(data?.error ?? "Couldn't create your account. Try again.");
            }
        });
    });

    return (
        <Form {...form}>
            <form className="grid gap-4" onSubmit={onSubmit} noValidate>
                <SsoButtons disabled={disabled} />

                <FormDivider label="or with work email" />

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem className="gap-1.5">
                                <FormLabel asChild>
                                    <Label variant="eyebrow">
                                        First name <span className="text-(--accent)">*</span>
                                    </Label>
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="Emma" autoComplete="given-name" disabled={disabled} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem className="gap-1.5">
                                <FormLabel asChild>
                                    <Label variant="eyebrow">
                                        Last name <span className="text-(--accent)">*</span>
                                    </Label>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Voss"
                                        autoComplete="family-name"
                                        disabled={disabled}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <EmailFormField control={form.control} name="email" disabled={disabled} />

                <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                        <FormItem className="gap-1.5">
                            <FormLabel asChild>
                                <Label variant="eyebrow">
                                    Company name <span className="text-(--accent)">*</span>
                                </Label>
                            </FormLabel>
                            <FormControl>
                                <IconInput
                                    type="text"
                                    placeholder="Hollis & Dray Millwork"
                                    autoComplete="organization"
                                    disabled={disabled}
                                    startIcon={<IconBuilding className="size-4" />}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="baseCurrency"
                    render={({ field }) => (
                        <FormItem className="gap-1.5">
                            <FormLabel asChild>
                                <Label variant="eyebrow">
                                    Base currency <span className="text-(--accent)">*</span>
                                </Label>
                            </FormLabel>
                            <Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select currency" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {CURRENCIES.map((currency) => (
                                        <SelectItem key={currency.code} value={currency.code}>
                                            {currency.symbol} · {currency.code} — {currency.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <PasswordField control={form.control} disabled={disabled} />

                <FormField
                    control={form.control}
                    name="terms"
                    render={({ field }) => (
                        <FormItem className="mt-1 gap-1.5">
                            <div className="flex items-start gap-2.5">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value === true}
                                        onCheckedChange={(value) => field.onChange(value === true)}
                                        disabled={disabled}
                                        className="mt-0.5"
                                    />
                                </FormControl>
                                <span className="text-[13px] leading-normal text-(--ink-soft)">
                                    I agree to Loom&apos;s{" "}
                                    <Link
                                        href="#"
                                        className="border-border text-foreground border-b no-underline transition-colors hover:border-(--accent)">
                                        Terms of Service
                                    </Link>{" "}
                                    and{" "}
                                    <Link
                                        href="#"
                                        className="border-border text-foreground border-b no-underline transition-colors hover:border-(--accent)">
                                        Privacy Policy
                                    </Link>
                                    , and I understand I can export or delete all data at any time.
                                </span>
                            </div>
                            <FormMessage />
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
                    idleLabel="Start my 30-day trial"
                    submittingLabel="Setting up your workspace…"
                    successLabel="Workspace ready · redirecting"
                />

                <AuthFinePrint items={["No credit card", "Cancel anytime", "SOC 2 Type II"]} />
            </form>
        </Form>
    );
};
