import type { ReactNode } from "react";
import Link from "next/link";

import { Button, Eyebrow, type EyebrowProps } from "@/components/ui";
import { LoomLogo } from "@/components/atoms/loom-logo";
import { AuthShellFooter } from "./AuthShellFooter";

type AuthFormPanelProps = {
    /** Header pill linking to the opposite auth flow. */
    altPrompt: string;
    altAction: string;
    altHref: string;
    eyebrowTag: string;
    eyebrowTone: EyebrowProps["tagTone"];
    eyebrowLabel: ReactNode;
    heading: ReactNode;
    description: ReactNode;
    /** The form, followed by its AuthCallout. */
    children: ReactNode;
};

export function AuthFormPanel({
    altPrompt,
    altAction,
    altHref,
    eyebrowTag,
    eyebrowTone,
    eyebrowLabel,
    heading,
    description,
    children,
}: AuthFormPanelProps) {
    return (
        <div className="relative flex flex-col px-7 pt-7 pb-10 md:px-10">
            <header className="mb-10 flex items-center justify-between md:mb-16">
                <LoomLogo />
                <Button asChild variant="pill-ghost" size="pill" className="text-[13px]">
                    <Link href={altHref}>
                        {altPrompt}
                        <strong className="text-foreground font-medium">{altAction}</strong>
                    </Link>
                </Button>
            </header>

            <div className="flex flex-1 items-center justify-center">
                <div className="w-full max-w-105">
                    <Eyebrow tag={eyebrowTag} tagTone={eyebrowTone} className="mb-5">
                        {eyebrowLabel}
                    </Eyebrow>

                    <h1 className="font-display mb-3.5 text-[46px] leading-[0.98] font-[340] tracking-[-0.03em] max-sm:text-[38px]">
                        {heading}
                    </h1>

                    <p className="mb-8 max-w-[40ch] text-[15px] text-(--ink-soft)">{description}</p>

                    {children}
                </div>
            </div>

            <AuthShellFooter />
        </div>
    );
}
