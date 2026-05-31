import type { Metadata } from "next";
import { EditorialPanel } from "./_components/EditorialPanel";
import { SignupFormPanel } from "./_components/SignupFormPanel";

export const metadata: Metadata = {
    title: "Start your trial · Tessera",
    description: "Run the whole shop on Tessera. 30-day free trial — every module, every feature, no credit card.",
};

export default function SignupPage() {
    return (
        <div className="landing-root bg-background text-foreground grid min-h-screen grid-cols-1 md:grid-cols-2">
            <SignupFormPanel />
            <EditorialPanel />
        </div>
    );
}
