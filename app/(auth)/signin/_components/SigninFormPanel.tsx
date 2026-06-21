import Link from "next/link";
import { IconSparkles } from "@tabler/icons-react";
import { Button, Eyebrow } from "@/components/ui";
import { TesseraLogo } from "@/components/atoms/tessera-logo";
import { AuthCallout } from "../../_components/AuthCallout";
import { AuthShellFooter } from "../../_components/AuthShellFooter";
import { SigninSurface } from "./SigninSurface";

export function SigninFormPanel() {
    return (
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
                    <Eyebrow tag="v4.2 · live" tagTone="paper" className="mb-5">
                        Welcome back
                    </Eyebrow>

                    <h1 className="font-display mb-3.5 text-[46px] leading-[0.98] font-[340] tracking-[-0.03em] max-sm:text-[38px]">
                        Pick up where you <em className="text-(--accent) italic">left off.</em>
                    </h1>

                    <p className="mb-8 max-w-[40ch] text-[15px] text-(--ink-soft)">
                        Sign in to your Tessera workspace. Your shop, your data, your dashboards — exactly how you left
                        them.
                    </p>

                    <SigninSurface />

                    <AuthCallout icon={<IconSparkles className="size-4" />} title="Don't have an account yet?">
                        Try Tessera free for 30 days — every module, no credit card.{" "}
                        <Link href="/signup" className="font-medium text-(--accent) no-underline">
                            Start a trial →
                        </Link>
                    </AuthCallout>
                </div>
            </div>

            <AuthShellFooter />
        </div>
    );
}
