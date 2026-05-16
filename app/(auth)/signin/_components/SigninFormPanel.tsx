import Link from "next/link";
import { IconSparkles } from "@tabler/icons-react";

import { AuthCallout } from "../../_components/AuthCallout";
import { AuthFormPanel } from "../../_components/AuthFormPanel";
import { SigninForm } from "./SigninForm";

export function SigninFormPanel() {
    return (
        <AuthFormPanel
            altPrompt="New to Loom?"
            altAction="Start a trial"
            altHref="/signup"
            eyebrowTag="v4.2 · live"
            eyebrowTone="paper"
            eyebrowLabel="Welcome back"
            heading={
                <>
                    Pick up where you <em className="text-(--accent) italic">left off.</em>
                </>
            }
            description="Sign in to your Loom workspace. Your shop, your data, your dashboards — exactly how you left them.">
            <SigninForm />

            <AuthCallout icon={<IconSparkles className="size-4" />} title="Don't have an account yet?">
                Try Loom free for 30 days — every module, no credit card.{" "}
                <Link href="/signup" className="font-medium text-(--accent) no-underline">
                    Start a trial →
                </Link>
            </AuthCallout>
        </AuthFormPanel>
    );
}
