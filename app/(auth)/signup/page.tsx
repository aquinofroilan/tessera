import type { Metadata } from "next";
import { EditorialPanel } from "./_components/EditorialPanel";
import { SignupFormPanel } from "./_components/SignupFormPanel";

export const metadata: Metadata = {
    title: "Start your trial · Loom",
    description: "Run the whole shop on Loom. 30-day free trial — every module, every feature, no credit card.",
};

export default function SignupPage() {
    return (
        <div className="landing-root grid min-h-screen grid-cols-1 bg-(--paper) text-(--ink) md:grid-cols-2">
            <SignupFormPanel />
            <EditorialPanel />
        </div>
    );
}
