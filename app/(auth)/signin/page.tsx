import type { Metadata } from "next";
import { EditorialPanel } from "./_components/EditorialPanel";
import { SigninFormPanel } from "./_components/SigninFormPanel";

export const metadata: Metadata = {
    title: "Sign in · Loom",
    description: "Sign in to your Loom workspace.",
};

export default function SigninPage() {
    return (
        <div className="landing-root grid min-h-screen grid-cols-1 bg-[var(--paper)] text-[var(--ink)] md:grid-cols-2">
            <SigninFormPanel />
            <EditorialPanel />
        </div>
    );
}
