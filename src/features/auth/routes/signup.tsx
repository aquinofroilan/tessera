import { createRoute, Link } from '@tanstack/react-router';
import { IconArrowUpRight, IconLifebuoy } from '@tabler/icons-react';
import packageJson from '../../../../package.json';
import { rootRoute } from '@/src/routes';
import { AuthLayout } from '@/src/features/auth/components/AuthLayout';
import { SignupForm } from '@/src/features/auth/components/SignupForm';

export const signupRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/auth/signup',
    component: () => (
        <AuthLayout 
            title="Create an account" 
            description="Enter your details to get started"
            variant="editorial"
            editorialIntro={
                <div className="mb-8">
                    <div className="mb-5 flex items-center gap-2.5 font-mono text-[11px] tracking-[0.14em] text-(--ink-soft) uppercase">
                        <span>Start your trial</span>
                        <span className="rounded-full bg-(--moss-soft) px-2.25 py-0.75 text-[10px] tracking-[0.1em] text-(--moss)">
                            30 days · free
                        </span>
                    </div>
                    <h1 className="mb-3.5 max-w-[12ch] font-display text-[46px] leading-[0.98] font-light tracking-[-0.03em] text-(--ink) max-[520px]:text-[38px]">
                        Run the whole shop on <em className="text-(--accent) italic">Tessera.</em>
                    </h1>
                    <p className="max-w-[40ch] text-[15px] text-(--ink-soft)">
                        No credit card. No sales call. Every module, every feature — for 30 days.{' '}
                        <Link
                            to="/auth/signup"
                            className="text-(--ink) underline decoration-(--rule) underline-offset-2 transition-colors duration-150 hover:decoration-(--accent) focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ink)"
                        >
                            Learn more
                        </Link>
                    </p>
                </div>
            }
            headerAction={
                <Link
                    to="/auth/signin"
                    className="inline-flex items-center gap-1.5 rounded-full border border-transparent px-3.5 py-2 text-[13px] text-(--ink-soft) transition-[border-color,background-color] duration-150 hover:border-(--rule) hover:bg-(--paper-2) focus-visible:ring-2 focus-visible:ring-(--ink) focus-visible:ring-offset-2 focus-visible:ring-offset-(--paper)"
                >
                    Already have an account?
                    <strong className="ml-0.5 font-medium text-(--ink)">Sign in</strong>
                </Link>
            }
            editorialContent={
                <div>
                    <div className="mb-12 flex justify-end">
                        <span className="inline-flex items-center gap-2 rounded-full border border-[rgb(246_241_230/22%)] px-3 py-1.5 font-mono text-[11px] tracking-[0.08em] text-[rgb(246_241_230/70%)] uppercase">
                            <span
                                aria-hidden="true"
                                className="size-1.5 rounded-full bg-(--moss) shadow-[0_0_0_3px_rgb(61_90_58/30%)] motion-safe:animate-[pulse_2.4s_ease-in-out_infinite] motion-reduce:animate-none"
                            />
                            Tessera v{packageJson.version} · live
                        </span>
                    </div>
                    <span className="mb-7 flex items-center gap-2.5 font-mono text-[11px] tracking-[0.18em] text-(--accent-light) uppercase before:h-px before:w-6 before:bg-(--accent-light) before:content-['']">
                        Tessera · built for the whole shop
                    </span>
                    <blockquote className="mb-5 max-w-[18ch] font-display text-[38px] leading-[1.08] font-light tracking-[-0.025em] text-(--paper) italic max-[520px]:text-[30px]">
                        “The operating system for the <em className="text-(--accent-light)">whole shop.</em>”
                    </blockquote>
                    <div className="flex items-center gap-3">
                        <span className="grid size-9.5 place-items-center rounded-full bg-[linear-gradient(135deg,var(--plum),var(--accent))] font-display text-[15px] font-medium text-(--paper) shadow-[inset_0_0_0_2px_rgb(255_255_255/20%)]">
                            JM
                        </span>
                        <div>
                            <div className="text-[14px] font-medium tracking-[-0.005em] text-(--paper)">Jordan M.</div>
                            <div className="mt-0.5 font-mono text-[11px] tracking-[0.05em] text-[rgb(246_241_230/60%)]">
                                Founder, Field Notes Co.
                            </div>
                        </div>
                    </div>
                </div>
            }
            editorialFooter={
                <nav aria-label="Resources" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-[11px] tracking-[0.05em] text-(--muted)">
                    <a href="#" className="transition-colors hover:text-(--ink) focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ink)">
                        Status
                    </a>
                    <a href="#" className="transition-colors hover:text-(--ink) focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ink)">
                        Security
                    </a>
                    <a href="#" className="transition-colors hover:text-(--ink) focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ink)">
                        Docs
                    </a>
                </nav>
            }
        >
            <SignupForm />
            <div className="mt-6 flex items-start gap-3 rounded-[10px] border border-dashed border-(--rule) bg-(--paper-2) p-3.5 text-[13px] leading-[1.45] text-(--ink-soft)">
                <span className="grid size-7.5 shrink-0 place-items-center rounded-[7px] bg-(--ink) text-(--paper)">
                    <IconLifebuoy aria-hidden="true" size={16} stroke={1.8} />
                </span>
                <p className="min-w-0">
                    <strong className="font-medium text-(--ink)">Need help migrating?</strong>{" "}
                    We can help you bring your data over.{" "}
                    <a
                        href="#"
                        className="inline-flex items-center gap-0.5 font-medium text-(--accent) underline decoration-transparent underline-offset-2 transition-[text-decoration-color] hover:decoration-current focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ink)"
                    >
                        Talk to us
                        <IconArrowUpRight aria-hidden="true" size={13} stroke={2} />
                    </a>
                </p>
            </div>
            <div className="text-center text-sm">
                Already have an account?{' '}
                <Link to="/auth/signin" className="text-primary hover:underline font-medium">
                    Log in
                </Link>
            </div>
        </AuthLayout>
    ),
});
