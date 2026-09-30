import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, Link } from "@tanstack/react-router";
import { useLogin } from "@/src/features/auth/api/login";
import { Button, Input, Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui";

const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Password is required" }),
});

type LoginValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
    const navigate = useNavigate();
    const loginMutation = useLogin({
        onSuccess: () => {
            navigate({ to: "/dashboard" });
        },
    });

    const form = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (values: LoginValues) => {
        loginMutation.mutate(values);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="name@example.com"
                                    {...field}
                                    disabled={loginMutation.isPending}
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
                        <FormItem>
                            <div className="flex items-center justify-between">
                                <FormLabel>Password</FormLabel>
                                <Link to="/auth/forgot-password" className="text-sm text-primary hover:underline font-medium">
                                    Forgot password?
                                </Link>
                            </div>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    {...field}
                                    disabled={loginMutation.isPending}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loginMutation.isPending}
                >
                    {loginMutation.isPending ? "Signing in..." : "Sign in"}
                </Button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                </div>

                <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate({ to: "/magic-link" })}
                >
                    Magic Link
                </Button>
            </form>
        </Form>
    );
};
