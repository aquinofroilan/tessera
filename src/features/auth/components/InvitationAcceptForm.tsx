import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "@tanstack/react-router";
import { useValidateInvitation, useAcceptInvitation } from "@/src/features/auth/api/invitation";
import { Button, Input, Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui";

const newUserSchema = z.object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    username: z.string().min(3, { message: "Username must be at least 3 characters" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

type NewUserValues = z.infer<typeof newUserSchema>;

interface InvitationAcceptFormProps {
    token: string;
}

export const InvitationAcceptForm = ({ token }: InvitationAcceptFormProps) => {
    const navigate = useNavigate();
    const { data: validationData, isLoading, error } = useValidateInvitation(token);
    const acceptMutation = useAcceptInvitation();

    const form = useForm<NewUserValues>({
        resolver: zodResolver(newUserSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            username: "",
            password: "",
        },
    });

    const onAcceptExisting = () => {
        acceptMutation.mutate({ token }, {
            onSuccess: () => navigate({ to: "/auth/signin" }),
        });
    };

    const onSubmitNewUser = (values: NewUserValues) => {
        acceptMutation.mutate({ token, ...values }, {
            onSuccess: () => navigate({ to: "/auth/signin" }),
        });
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-muted-foreground text-sm">Validating invitation...</p>
            </div>
        );
    }

    if (error || !validationData) {
        return (
            <div className="text-center space-y-4">
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                    This invitation link is invalid or has expired.
                </div>
            </div>
        );
    }

    if (validationData.existingUser) {
        return (
            <div className="space-y-6 text-center animate-in fade-in zoom-in duration-300">
                <div className="space-y-2">
                    <p className="text-muted-foreground text-sm">
                        You've been invited to join an organization with the email <strong>{validationData.email}</strong>.
                    </p>
                    <p className="text-muted-foreground text-sm">
                        Since you already have an account, simply click below to accept the invitation and log in.
                    </p>
                </div>
                <Button 
                    onClick={onAcceptExisting} 
                    className="w-full" 
                    disabled={acceptMutation.isPending}
                >
                    {acceptMutation.isPending ? "Accepting..." : "Accept Invitation"}
                </Button>
            </div>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitNewUser)} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="bg-muted/50 p-3 rounded-md mb-4 text-center">
                    <p className="text-sm font-medium">Invited as {validationData.email}</p>
                    <p className="text-xs text-muted-foreground">Please complete your profile to join.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Jane" {...field} disabled={acceptMutation.isPending} />
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
                                    <Input placeholder="Doe" {...field} disabled={acceptMutation.isPending} />
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
                                <Input placeholder="janedoe" {...field} disabled={acceptMutation.isPending} />
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
                                <Input type="password" placeholder="••••••••" {...field} disabled={acceptMutation.isPending} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                <Button type="submit" className="w-full" disabled={acceptMutation.isPending}>
                    {acceptMutation.isPending ? "Joining..." : "Accept & Join"}
                </Button>
            </form>
        </Form>
    );
};
