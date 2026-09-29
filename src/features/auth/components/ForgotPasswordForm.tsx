import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForgotPassword } from "@/src/features/auth/api/forgotPassword";
import { Button, Input, Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui";
import { CheckCircle2 } from "lucide-react";

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
            onError: () => {
                // To prevent email enumeration, we usually treat even errors as a success message in the UI,
                // or you can handle specific network errors here.
                setIsSubmitted(true);
            }
        });
    };

    if (isSubmitted) {
        return (
            <div className="flex flex-col items-center justify-center space-y-4 text-center animate-in fade-in zoom-in duration-300">
                <CheckCircle2 className="w-12 h-12 text-primary" />
                <div className="space-y-2">
                    <h3 className="text-xl font-medium">Check your email</h3>
                    <p className="text-muted-foreground text-sm">
                        We've sent a password reset link to <span className="font-medium text-foreground">{form.getValues("email")}</span>.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="name@example.com" {...field} disabled={forgotPasswordMutation.isPending} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                <Button type="submit" className="w-full" disabled={forgotPasswordMutation.isPending}>
                    {forgotPasswordMutation.isPending ? "Sending..." : "Send reset link"}
                </Button>
            </form>
        </Form>
    );
};
