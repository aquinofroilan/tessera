"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconAlertTriangle, IconLoader2 } from "@tabler/icons-react";

import { Button, Eyebrow } from "@/components/ui";
import { TesseraLogo } from "@/components/atoms/tessera-logo";
import { AuthShellFooter } from "../../../_components/AuthShellFooter";
import { EditorialPanel } from "../../_components/EditorialPanel";

type Status = "pending" | "error";

type CallbackConsumerProps = {
    token: string;
};

export function CallbackConsumer({ token }: CallbackConsumerProps) {
    const router = useRouter();
    const [status, setStatus] = useState<Status>(token ? "pending" : "error");
    const [error, setError] = useState<string | null>(token ? null : "Missing sign-in token.");

    useEffect(() => {
        if (!token) return;
        let cancelled = false;

        const consume = async () => {
            try {
                const response = await fetch("/api/auth/login-link/consume", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token }),
                });
                if (cancelled) return;
                if (!response.ok) {
                    const data = (await response.json().catch(() => null)) as { error?: string } | null;
                    setError(data?.error ?? "Invalid or expired login link.");
                    setStatus("error");
                    return;
                }
                router.replace("/");
                router.refresh();
            } catch {
                if (cancelled) return;
                setError("Something went wrong. Try again.");
                setStatus("error");
            }
        };

        void consume();
        return () => {
            cancelled = true;
        };
    }, [token, router]);

    return (
        <div className="landing-root bg-background text-foreground grid min-h-screen grid-cols-1 md:grid-cols-2">
            <div className="relative flex flex-col px-7 pt-7 pb-10 md:px-10">
                <header className="mb-10 flex items-center justify-between md:mb-16">
                    <TesseraLogo />
                </header>

                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-105">
                        {status === "pending" ? (
                            <>
                                <Eyebrow tag="verifying" tagTone="paper" className="mb-5">
                                    Almost there
                                </Eyebrow>

                                <span className="mb-6 grid size-12 place-items-center rounded-full bg-(--paper-2) text-(--ink-soft)">
                                    <IconLoader2 className="size-6 animate-[spin_0.9s_linear_infinite]" stroke={1.6} />
                                </span>

                                <h1 className="font-display mb-3.5 text-[46px] leading-[0.98] font-[340] tracking-[-0.03em] max-sm:text-[38px]">
                                    Signing you <em className="text-(--accent) italic">in.</em>
                                </h1>

                                <p className="max-w-[40ch] text-[15px] text-(--ink-soft)">
                                    Verifying your link and redirecting to your workspace.
                                </p>
                            </>
                        ) : (
                            <>
                                <Eyebrow tag="link invalid" tagTone="paper" className="mb-5">
                                    Couldn&rsquo;t sign you in
                                </Eyebrow>

                                <span className="mb-6 grid size-12 place-items-center rounded-full bg-(--paper-2) text-(--accent)">
                                    <IconAlertTriangle className="size-6" stroke={1.6} />
                                </span>

                                <h1 className="font-display mb-3.5 text-[46px] leading-[0.98] font-[340] tracking-[-0.03em] max-sm:text-[38px]">
                                    This link <em className="text-(--accent) italic">didn&rsquo;t work.</em>
                                </h1>

                                <p className="mb-8 max-w-[40ch] text-[15px] text-(--ink-soft)">
                                    {error ?? "Invalid or expired login link."} You can request a new one or sign in
                                    with your password.
                                </p>

                                <div className="flex flex-wrap gap-3">
                                    <Button asChild variant="pill" size="pill-lg">
                                        <Link href="/signin">Back to sign-in</Link>
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <AuthShellFooter />
            </div>
            <EditorialPanel />
        </div>
    );
}
