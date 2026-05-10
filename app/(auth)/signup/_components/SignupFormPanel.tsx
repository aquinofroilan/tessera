import Link from "next/link";
import { IconReplace } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SignupForm } from "./SignupForm";

export function SignupFormPanel() {
    return (
        <div className="relative flex flex-col px-7 pt-7 pb-10 md:px-10">
            <header className="mb-10 flex items-center justify-between md:mb-16">
                <Link
                    href="/"
                    className="font-display inline-flex items-baseline gap-1 text-[26px] font-medium tracking-[-0.02em] text-[var(--ink)] italic no-underline">
                    Loom
                    <span className="mb-[3px] ml-0.5 size-1.5 rounded-full bg-[var(--accent)]" />
                </Link>
                <Button asChild variant="pill-ghost" size="pill" className="text-[13px]">
                    <Link href="/signin">
                        Already have an account?
                        <strong className="font-medium text-[var(--ink)]">Sign in</strong>
                    </Link>
                </Button>
            </header>

            <div className="flex flex-1 items-center justify-center">
                <div className="w-full max-w-[420px]">
                    <Eyebrow tag="30 days · free" tagTone="moss" className="mb-5">
                        Start your trial
                    </Eyebrow>

                    <h1 className="font-display mb-3.5 text-[46px] leading-[0.98] font-[340] tracking-[-0.03em] max-sm:text-[38px] sm:text-[46px]">
                        Run the whole shop on <em className="text-[var(--accent)] italic">Loom.</em>
                    </h1>

                    <p className="mb-8 max-w-[40ch] text-[15px] text-[var(--ink-soft)]">
                        No credit card. No sales call. Every module, every feature — for 30 days. If you don&apos;t like
                        it, just walk away.
                    </p>

                    <SignupForm />

                    <div className="mt-6 flex items-start gap-3 rounded-[10px] border border-dashed border-[var(--rule)] bg-[var(--paper-2)] px-4 py-3.5 text-[13px] leading-[1.5] text-[var(--ink-soft)]">
                        <div className="grid size-7.5 flex-none place-items-center rounded-md bg-[var(--ink)] text-[var(--paper)]">
                            <IconReplace className="h-4 w-4" />
                        </div>
                        <div>
                            <strong className="font-medium text-[var(--ink)]">
                                Coming from QuickBooks, NetSuite, or SAP B1?
                            </strong>
                            <br />
                            Our migration team will move your data for you, free.{" "}
                            <a href="#" className="font-medium text-[var(--accent)] no-underline">
                                Book a 30-min call →
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="mt-10 flex flex-wrap justify-between gap-3 font-mono text-[11px] tracking-[0.04em] text-[var(--muted)]">
                <span>© 2026 Loom Systems, Inc. · Portland, OR</span>
                <span className="space-x-1.5">
                    <a href="#" className="text-inherit no-underline hover:text-[var(--ink)]">
                        Status
                    </a>
                    <span>·</span>
                    <a href="#" className="text-inherit no-underline hover:text-[var(--ink)]">
                        Security
                    </a>
                    <span>·</span>
                    <a href="#" className="text-inherit no-underline hover:text-[var(--ink)]">
                        Docs
                    </a>
                </span>
            </footer>
        </div>
    );
}
