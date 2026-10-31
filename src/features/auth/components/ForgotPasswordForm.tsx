import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForgotPassword } from "@/src/features/auth/api/forgotPassword";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { IconArrowLeft, IconCheck } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";

const forgotPasswordSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordForm = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    const forgotPasswordMutation = useForgotPassword();

    const form = useForm<ForgotPasswordValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: "" },
    });

    const onSubmit = (values: ForgotPasswordValues) => {
        forgotPasswordMutation.mutate(values, {
            onSuccess: () => {
                setIsSubmitted(true);
            },
        });
    };

    if (isSubmitted) {
        return (
            <div className="space-y-6" role="status" aria-live="polite">
                <div className="flex items-start gap-3.5 rounded-[10px] border border-(--moss) bg-[rgb(61_90_58/8%)] px-4 py-3.5 text-(--moss)">
                    <IconCheck aria-hidden="true" className="mt-0.5 shrink-0" size={18} stroke={2.2} />
                    <div className="space-y-1">
                        <h2 className="text-[14px] font-medium">Check your email</h2>
                        <p className="text-[13px] leading-[1.45] text-(--ink-soft)">
                            If an account exists for <span className="font-medium text-(--ink)">{form.getValues("email")}</span>, we&apos;ve sent a secure password reset link.
                        </p>
                    </div>
                </div>
                <p className="text-center text-[13px] text-(--muted)">
                    The link will expire for your security. Check your spam folder if it doesn&apos;t arrive.
                </p>
                <Link
                    to="/auth/signin"
                    className="mx-auto flex w-fit items-center gap-1.5 text-[13px] font-medium text-(--ink-soft) underline decoration-(--rule) underline-offset-4 transition-colors hover:text-(--accent) focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--ink)"
                >
                    <IconArrowLeft aria-hidden="true" size={14} />
                    Return to login
                </Link>
            </div>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {forgotPasswordMutation.isError && (
                    <div
                        role="alert"
                        className="rounded-[10px] border border-(--accent) bg-(--accent-soft) px-3.5 py-3 text-[13px] leading-[1.45] text-(--accent-deep)"
                    >
                        We couldn&apos;t send the reset link right now. Check your connection and try again.
                    </div>
                )}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email address</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="name@example.com"
                                    autoComplete="email"
                                    {...field}
                                    disabled={forgotPasswordMutation.isPending}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" variant="pill" size="pill-lg" className="w-full" disabled={forgotPasswordMutation.isPending}>
                    {forgotPasswordMutation.isPending ? "Sending reset link..." : "Send reset link"}
                </Button>
                <p className="text-center text-[12px] leading-[1.45] text-(--muted)">
                    We&apos;ll only use your email to help you regain access.
                </p>
                <Link
                    to="/auth/signin"
                    className="mx-auto flex w-fit items-center gap-1.5 text-[13px] font-medium text-(--ink-soft) underline decoration-(--rule) underline-offset-4 transition-colors hover:text-(--accent) focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--ink)"
                >
                    <IconArrowLeft aria-hidden="true" size={14} />
                    Return to login
                </Link>
            </form>
        </Form>
    );
};
