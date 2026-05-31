import type { Metadata } from "next";
import { EditorialPanel } from "./_components/EditorialPanel";
import { SigninFormPanel } from "./_components/SigninFormPanel";

export const metadata: Metadata = {
    title: "Sign in · Tessera",
    description: "Sign in to your Tessera workspace.",
};

export default function SigninPage() {
    return (
        <div className="landing-root bg-background text-foreground grid min-h-screen grid-cols-1 md:grid-cols-2">
            <SigninFormPanel />
            <EditorialPanel />
        </div>
    );
}
