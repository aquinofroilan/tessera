import type { Metadata } from "next";
import Link from "next/link";
import { IconMailFast } from "@tabler/icons-react";

import { Button, Eyebrow } from "@/components/ui";
import { TesseraLogo } from "@/components/atoms/tessera-logo";
import { AuthFinePrint } from "../../_components/AuthFinePrint";
import { AuthShellFooter } from "../../_components/AuthShellFooter";
import { EditorialPanel } from "../_components/EditorialPanel";

export const metadata: Metadata = {
    title: "Check your inbox · Tessera",
    description: "We sent a one-time sign-in link to your email.",
};

type Props = { searchParams: Promise<{ email?: string }> };

const SigninSentPage = async ({ searchParams }: Props) => {
    const { email } = await searchParams;

    return (
        <div className="landing-root bg-background text-foreground grid min-h-screen grid-cols-1 md:grid-cols-2">
            <div className="relative flex flex-col px-7 pt-7 pb-10 md:px-10">
                <header className="mb-10 flex items-center justify-between md:mb-16">
                    <TesseraLogo />
                    <Button asChild variant="pill-ghost" size="pill" className="text-[13px]">
                        <Link href="/signup">
                            New to Tessera?
                            <strong className="text-foreground font-medium">Start a trial</strong>
                        </Link>
                    </Button>
                </header>

                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-105">
                        <Eyebrow tag="link sent" tagTone="paper" className="mb-5">
                            Check your inbox
                        </Eyebrow>

                        <span className="mb-6 grid size-12 place-items-center rounded-full bg-(--paper-2) text-(--accent)">
                            <IconMailFast className="size-6" stroke={1.6} />
                        </span>

                        <h1 className="font-display mb-3.5 text-[46px] leading-[0.98] font-[340] tracking-[-0.03em] max-sm:text-[38px]">
                            We just <em className="text-(--accent) italic">emailed you a link.</em>
                        </h1>

                        <p className="mb-8 max-w-[42ch] text-[15px] text-(--ink-soft)">
                            {email ? (
                                <>
                                    If <strong className="text-foreground font-medium">{email}</strong> matches an
                                    account, a one-time sign-in link is on its way. Open it on this device to finish
                                    signing in.
                                </>
                            ) : (
                                <>
                                    If that email matches an account, a one-time sign-in link is on its way. Open it on
                                    this device to finish signing in.
                                </>
                            )}
                        </p>

                        <div className="mb-8 flex flex-wrap gap-3">
                            <Button asChild variant="pill" size="pill-lg">
                                <Link href="/signin">Back to sign-in</Link>
                            </Button>
                            <Button asChild variant="pill-ghost" size="pill-lg">
                                <Link href="/signin">Send another link</Link>
                            </Button>
                        </div>

                        <AuthFinePrint items={["Link expires in 15 minutes", "One-time use", "Only works on this device"]} />
                    </div>
                </div>

                <AuthShellFooter />
            </div>
            <EditorialPanel />
        </div>
    );
};

export default SigninSentPage;
