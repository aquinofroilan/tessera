import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "@tanstack/react-router";
import { useResetPassword } from "@/src/features/auth/api/resetPassword";
import { Button, Input, Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui";

const resetPasswordSchema = z.object({
    newPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
    token: string;
}

export const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const resetPasswordMutation = useResetPassword();

    const form = useForm<ResetPasswordValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { newPassword: "", confirmPassword: "" },
    });

    const onSubmit = (values: ResetPasswordValues) => {
        setErrorMsg(null);
        resetPasswordMutation.mutate(
            { token, newPassword: values.newPassword },
            {
                onSuccess: () => {
                    navigate({ to: "/auth/signin" });
                },
                onError: (error: any) => {
                    setErrorMsg(error?.response?.data?.error || "Failed to reset password. The link might be expired.");
                }
            }
        );
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {errorMsg && (
                    <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                        {errorMsg}
                    </div>
                )}
                
                <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="••••••••" {...field} disabled={resetPasswordMutation.isPending} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="••••••••" {...field} disabled={resetPasswordMutation.isPending} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                <Button type="submit" className="w-full" disabled={resetPasswordMutation.isPending}>
                    {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
                </Button>
            </form>
        </Form>
    );
};
