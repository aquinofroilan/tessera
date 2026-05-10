import Link from "next/link";
import { IconReplace } from "@tabler/icons-react";
import { Button, Eyebrow } from "@/components/ui";
import { LoomLogo } from "@/components/atoms/loom-logo";
import { AuthCallout } from "../../_components/AuthCallout";
import { AuthShellFooter } from "../../_components/AuthShellFooter";
import { SignupForm } from "./SignupForm";

export function SignupFormPanel() {
    return (
        <div className="relative flex flex-col px-7 pt-7 pb-10 md:px-10">
            <header className="mb-10 flex items-center justify-between md:mb-16">
                <LoomLogo />
                <Button asChild variant="pill-ghost" size="pill" className="text-[13px]">
                    <Link href="/signin">
                        Already have an account?
                        <strong className="text-foreground font-medium">Sign in</strong>
                    </Link>
                </Button>
            </header>

            <div className="flex flex-1 items-center justify-center">
                <div className="w-full max-w-105">
                    <Eyebrow tag="30 days · free" tagTone="moss" className="mb-5">
                        Start your trial
                    </Eyebrow>

                    <h1 className="font-display mb-3.5 text-[46px] leading-[0.98] font-[340] tracking-[-0.03em] max-sm:text-[38px] sm:text-[46px]">
                        Run the whole shop on <em className="text-(--accent) italic">Loom.</em>
                    </h1>

                    <p className="mb-8 max-w-[40ch] text-[15px] text-(--ink-soft)">
                        No credit card. No sales call. Every module, every feature — for 30 days. If you don&apos;t like
                        it, just walk away.
                    </p>

                    <SignupForm />

                    <AuthCallout
                        icon={<IconReplace className="size-4" />}
                        title="Coming from QuickBooks, NetSuite, or SAP B1?">
                        Our migration team will move your data for you, free.{" "}
                        <Link href="#" className="font-medium text-(--accent) no-underline">
                            Book a 30-min call →
                        </Link>
                    </AuthCallout>
                </div>
            </div>

            <AuthShellFooter />
        </div>
    );
}
