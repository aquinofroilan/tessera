import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "@tanstack/react-router";
import { IconCheck } from "@tabler/icons-react";
import { useRegister } from "@/src/features/auth/api/register";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FormDivider } from "@/components/ui/form-divider";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PasswordInput, PasswordStrengthMeter } from "@/components/ui/password-input";

const signupSchema = z.object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    username: z.string().min(3, { message: "Username must be at least 3 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    orgName: z.string().min(1, { message: "Organization name is required" }),
    orgSlug: z.string().min(1, { message: "Organization slug is required" }),
    orgBaseCurrency: z.enum(["USD", "EUR", "GBP", "JPY", "PHP"], { 
        required_error: "Base currency is required" 
    }),
    orgDescription: z.string().optional(),
    termsAccepted: z.boolean().refine((value) => value, {
        message: "You must accept the terms and privacy policy",
    }),
});

type SignupValues = z.infer<typeof signupSchema>;

export const SignupForm = () => {
    const [step, setStep] = useState(0);
    const navigate = useNavigate();
    
    const registerMutation = useRegister({
        onSuccess: () => {
            navigate({ to: "/auth/signin" });
        },
    });

    const form = useForm<SignupValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            password: "",
            orgName: "",
            orgSlug: "",
            orgBaseCurrency: "USD",
            orgDescription: "",
            termsAccepted: false,
        },
        mode: "onChange",
    });

    const orgName = form.watch("orgName");
    const isOrgSlugDirty = form.formState.dirtyFields.orgSlug;

    useEffect(() => {
        if (!isOrgSlugDirty) {
            const slug = (orgName || "").toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            if (slug !== form.getValues("orgSlug")) {
                form.setValue("orgSlug", slug, { shouldValidate: orgName.length > 0 });
            }
        }
    }, [orgName, isOrgSlugDirty, form]);


    const nextStep = async () => {
        const isValid = await form.trigger(["firstName", "lastName", "username", "email", "password"]);
        if (isValid) {
            setStep(1);
        }
    };

    const prevStep = () => {
        setStep(0);
    };

    const onSubmit = (values: SignupValues) => {
        registerMutation.mutate(values);
    };

    const registrationError =
        registerMutation.error instanceof Error
            ? registerMutation.error.message
            : "We couldn't create your account. Please try again.";

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {registerMutation.isError && (
                    <div
                        role="alert"
                        className="rounded-[10px] border border-(--accent) bg-(--accent-soft) px-3.5 py-3 text-[13px] leading-[1.45] text-(--accent-deep)"
                    >
                        {registrationError}
                    </div>
                )}
                {step === 0 && (
                    <div className="space-y-4">
                        <FormDivider label="or with work email" className="mb-5" />
                        <div className="grid grid-cols-2 gap-4 max-[520px]:grid-cols-1">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Jane" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="janedoe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="jane@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <PasswordInput placeholder="••••••••" {...field} />
                                    </FormControl>
                                    <PasswordStrengthMeter value={field.value} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <Button type="button" onClick={nextStep} className="w-full">
                            Continue Setup
                        </Button>
                    </div>
                )}

                {step === 1 && (
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="orgName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Organization Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Acme Corp" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4 max-[520px]:grid-cols-1">
                            <FormField
                                control={form.control}
                                name="orgSlug"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Workspace Slug</FormLabel>
                                        <FormControl>
                                            <Input placeholder="acme-corp" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="orgBaseCurrency"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Base Currency</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a currency" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="USD">USD ($)</SelectItem>
                                                <SelectItem value="EUR">EUR (€)</SelectItem>
                                                <SelectItem value="GBP">GBP (£)</SelectItem>
                                                <SelectItem value="JPY">JPY (¥)</SelectItem>
                                                <SelectItem value="PHP">PHP (₱)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="orgDescription"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="What does your org do?" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="termsAccepted"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <div className="flex items-start gap-3">
                                        <FormControl>
                                            <Checkbox
                                                id="terms-consent"
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                aria-label="Accept the terms of service and privacy policy"
                                            />
                                        </FormControl>
                                        <label
                                            htmlFor="terms-consent"
                                            className="text-[13px] leading-[1.5] text-(--ink-soft)"
                                        >
                                            I agree to the{" "}
                                            <a
                                                href="/terms"
                                                className="text-(--ink) underline decoration-(--rule) underline-offset-2 hover:decoration-(--accent) focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ink)"
                                            >
                                                Terms of Service
                                            </a>{" "}
                                            and{" "}
                                            <a
                                                href="/privacy"
                                                className="text-(--ink) underline decoration-(--rule) underline-offset-2 hover:decoration-(--accent) focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ink)"
                                            >
                                                Privacy Policy
                                            </a>
                                            .
                                        </label>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex flex-col gap-4">
                            <Button
                                type="submit"
                                className="w-full rounded-[10px] bg-(--ink) px-5 py-3.5 text-[15px] font-medium text-(--paper) transition-[background-color,transform] duration-150 hover:-translate-y-px hover:bg-(--accent) active:translate-y-0 motion-reduce:transition-none"
                                disabled={registerMutation.isPending}
                            >
                                {registerMutation.isPending ? "Creating..." : "Create Account"}
                            </Button>
                            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 font-mono text-[11px] leading-[1.4] text-(--muted)">
                                <span className="inline-flex items-center gap-1.5">
                                    <IconCheck aria-hidden="true" size={12} stroke={2} />
                                    No credit card
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <IconCheck aria-hidden="true" size={12} stroke={2} />
                                    Cancel anytime
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <IconCheck aria-hidden="true" size={12} stroke={2} />
                                    SOC 2 ready
                                </span>
                            </div>
                            <Button type="button" variant="outline" onClick={prevStep} className="w-full" disabled={registerMutation.isPending}>
                                Back
                            </Button>
                        </div>
                    </div>
                )}
            </form>
        </Form>
    );
};
