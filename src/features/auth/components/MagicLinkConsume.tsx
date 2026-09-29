import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useConsumeMagicLink } from "../api/magicLink";
import { useAuthStore } from "../stores/authStore";
import { Button } from "@/components/ui";

interface MagicLinkConsumeProps {
    token: string;
}

export const MagicLinkConsume = ({ token }: MagicLinkConsumeProps) => {
    const navigate = useNavigate();
    const consumeMutation = useConsumeMagicLink();
    const setUser = useAuthStore((state) => state.setUser);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        // Automatically consume token on mount
        consumeMutation.mutate(
            { token },
            {
                onSuccess: (data) => {
                    // Store user state and navigate to dashboard
                    setUser(data.user);
                    navigate({ to: "/dashboard" });
                },
                onError: (error: any) => {
                    setErrorMsg(error?.response?.data?.error || "This magic link is invalid or has expired.");
                }
            }
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    if (errorMsg) {
        return (
            <div className="text-center space-y-4">
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                    {errorMsg}
                </div>
                <Button variant="outline" onClick={() => navigate({ to: "/magic-link" })}>
                    Request a new link
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-muted-foreground text-sm">Authenticating your magic link...</p>
        </div>
    );
};
