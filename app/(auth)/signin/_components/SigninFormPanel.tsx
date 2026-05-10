import Link from "next/link";
import { IconSparkles } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { LoomLogo } from "@/components/atoms/loom-logo";
import { AuthCallout } from "../../_components/AuthCallout";
import { AuthShellFooter } from "../../_components/AuthShellFooter";
import { SigninForm } from "./SigninForm";

export function SigninFormPanel() {
    return (
        <div className="relative flex flex-col px-7 pt-7 pb-10 md:px-10">
            <header className="mb-10 flex items-center justify-between md:mb-16">
                <LoomLogo />
                <Button asChild variant="pill-ghost" size="pill" className="text-[13px]">
                    <Link href="/signup">
                        New to Loom?
                        <strong className="font-medium text-[var(--ink)]">Start a trial</strong>
                    </Link>
                </Button>
            </header>

            <div className="flex flex-1 items-center justify-center">
                <div className="w-full max-w-[420px]">
                    <Eyebrow tag="v4.2 · live" tagTone="paper" className="mb-5">
                        Welcome back
                    </Eyebrow>

                    <h1 className="font-display mb-3.5 text-[46px] leading-[0.98] font-[340] tracking-[-0.03em] max-sm:text-[38px]">
                        Pick up where you <em className="text-[var(--accent)] italic">left off.</em>
                    </h1>

                    <p className="mb-8 max-w-[40ch] text-[15px] text-[var(--ink-soft)]">
                        Sign in to your Loom workspace. Your shop, your data, your dashboards — exactly how you left
                        them.
                    </p>

                    <SigninForm />

                    <AuthCallout icon={<IconSparkles className="h-4 w-4" />} title="Don't have an account yet?">
                        Try Loom free for 30 days — every module, no credit card.{" "}
                        <Link href="/signup" className="font-medium text-[var(--accent)] no-underline">
                            Start a trial →
                        </Link>
                    </AuthCallout>
                </div>
            </div>

            <AuthShellFooter />
        </div>
    );
}
