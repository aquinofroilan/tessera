import Link from "next/link";
import { IconReplace } from "@tabler/icons-react";

import { AuthCallout } from "../../_components/AuthCallout";
import { AuthFormPanel } from "../../_components/AuthFormPanel";
import { SignupForm } from "./SignupForm";

export function SignupFormPanel() {
    return (
        <AuthFormPanel
            altPrompt="Already have an account?"
            altAction="Sign in"
            altHref="/signin"
            eyebrowTag="30 days · free"
            eyebrowTone="moss"
            eyebrowLabel="Start your trial"
            heading={
                <>
                    Run the whole shop on <em className="text-(--accent) italic">Loom.</em>
                </>
            }
            description="No credit card. No sales call. Every module, every feature — for 30 days. If you don't like it, just walk away.">
            <SignupForm />

            <AuthCallout icon={<IconReplace className="size-4" />} title="Coming from QuickBooks, NetSuite, or SAP B1?">
                Our migration team will move your data for you, free.{" "}
                <Link href="#" className="font-medium text-(--accent) no-underline">
                    Book a 30-min call →
                </Link>
            </AuthCallout>
        </AuthFormPanel>
    );
}
