import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, Link } from "@tanstack/react-router";
import { useLogin } from "@/src/features/auth/api/login";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";

const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Password is required" }),
    rememberMe: z.boolean(),
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
            rememberMe: false,
        },
    });

    const onSubmit = ({ email, password }: LoginValues) => {
        loginMutation.mutate({ email, password });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {loginMutation.isError && (
                    <div role="alert" className="rounded-[10px] border border-(--accent) bg-(--accent-soft) px-3.5 py-3 text-[13px] leading-[1.45] text-(--accent-deep)">
                        Unable to sign in with those credentials. Please check your email and password and try again.
                    </div>
                )}
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
                                <PasswordInput
                                    placeholder="••••••••"
                                    {...field}
                                    disabled={loginMutation.isPending}
                                />
                            </FormControl>
                            <FormMessage />
                            <label className="flex items-center gap-2 text-[13px] text-(--ink-soft)">
                                <Checkbox
                                    checked={form.watch("rememberMe")}
                                    onCheckedChange={(checked) => form.setValue("rememberMe", checked === true)}
                                    aria-label="Remember me"
                                />
                                Remember me
                            </label>
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
