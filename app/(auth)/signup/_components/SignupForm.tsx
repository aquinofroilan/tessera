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
} from "@/components/ui";
import { AuthFinePrint } from "../../_components/AuthFinePrint";
import { AuthSubmitButton } from "../../_components/AuthSubmitButton";
import { EmailFormField } from "../../_components/EmailFormField";
import { useAuthSubmitState } from "../../_components/useAuthSubmitState";
import { SsoButtons } from "../../_components/SsoButtons";
import { signupSchema, type SignupValues } from "./signup-schema";
import { PasswordField } from "./PasswordField";

export function SignupForm() {
    const { status, submit, disabled } = useAuthSubmitState();
    const form = useForm<SignupValues>({
        resolver: zodResolver(signupSchema),
        mode: "onBlur",
        defaultValues: {
            name: "",
            role: "",
            email: "",
            company: "",
            password: "",
            terms: false as unknown as true,
        },
    });

    const onSubmit = form.handleSubmit(async (values) => {
        await submit(async () => {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });
            if (!response.ok) {
                throw new Error(`Signup failed: ${response.status} ${response.statusText}`);
            }
        });
    });

    return (
        <Form {...form}>
            <form className="grid gap-4" onSubmit={onSubmit} noValidate>
                <SsoButtons disabled={disabled} twoColumn />

                <FormDivider label="or with work email" />

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="gap-1.5">
                                <FormLabel asChild>
                                    <Label variant="eyebrow">
                                        Your name <span className="text-(--accent)">*</span>
                                    </Label>
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="Emma Voss" autoComplete="name" disabled={disabled} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem className="gap-1.5">
                                <FormLabel asChild>
                                    <Label variant="eyebrow">
                                        Your role{" "}
                                        <span className="font-sans text-[11px] tracking-normal text-(--muted-2) normal-case">
                                            (optional)
                                        </span>
                                    </Label>
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="Controller, COO, Owner…" disabled={disabled} {...field} />
                                </FormControl>
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
}
