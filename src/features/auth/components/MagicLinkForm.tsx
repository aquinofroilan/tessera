import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRequestMagicLink } from "@/src/features/auth/api/magicLink";
import { Button, Input, Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui";
import { CheckCircle2 } from "lucide-react";

const magicLinkSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
});

type MagicLinkValues = z.infer<typeof magicLinkSchema>;

export const MagicLinkForm = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const magicLinkMutation = useRequestMagicLink();

    const form = useForm<MagicLinkValues>({
        resolver: zodResolver(magicLinkSchema),
        defaultValues: { email: "" },
    });

    const onSubmit = (values: MagicLinkValues) => {
        magicLinkMutation.mutate(values, {
            onSuccess: () => setIsSubmitted(true),
            onError: () => setIsSubmitted(true), // Obscure error to prevent enumeration
        });
    };

    if (isSubmitted) {
        return (
            <div className="flex flex-col items-center justify-center space-y-4 text-center animate-in fade-in zoom-in duration-300">
                <CheckCircle2 className="w-12 h-12 text-primary" />
                <div className="space-y-2">
                    <h3 className="text-xl font-medium">Check your email</h3>
                    <p className="text-muted-foreground text-sm">
                        We've sent a magic link to <span className="font-medium text-foreground">{form.getValues("email")}</span>.
                        Click the link to instantly log in.
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
                                <Input type="email" placeholder="name@example.com" {...field} disabled={magicLinkMutation.isPending} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                <Button type="submit" className="w-full" disabled={magicLinkMutation.isPending}>
                    {magicLinkMutation.isPending ? "Sending..." : "Send Magic Link"}
                </Button>
            </form>
        </Form>
    );
};
