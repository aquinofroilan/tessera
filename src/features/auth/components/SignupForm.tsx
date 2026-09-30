import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "@tanstack/react-router";
import { useRegister } from "@/src/features/auth/api/register";
import { 
    Button, 
    Input, 
    Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui";

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
        },
        mode: "onChange",
    });

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

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {step === 0 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="grid grid-cols-2 gap-4">
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
                                        <Input type="password" placeholder="••••••••" {...field} />
                                    </FormControl>
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
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
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
                        <div className="grid grid-cols-2 gap-4">
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

                        <div className="flex gap-4">
                            <Button type="button" variant="outline" onClick={prevStep} className="w-full" disabled={registerMutation.isPending}>
                                Back
                            </Button>
                            <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
                                {registerMutation.isPending ? "Creating..." : "Create Account"}
                            </Button>
                        </div>
                    </div>
                )}
            </form>
        </Form>
    );
};
