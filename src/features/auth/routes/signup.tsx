import { createRoute, Link } from '@tanstack/react-router';
import { rootRoute } from '@/src/routes';
import { AuthLayout, SignupForm } from '@/src/features/auth/components';

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
                    <span className="mb-7 flex items-center gap-2.5 font-mono text-[11px] tracking-[0.18em] text-(--accent-light) uppercase before:h-px before:w-6 before:bg-(--accent-light) before:content-['']">
                        Tessera · built for the whole shop
                    </span>
                    <p className="max-w-[12ch] font-display text-[46px] leading-[1.08] font-light tracking-[-0.025em] text-(--paper) max-[520px]:text-4xl">
                        Run the whole shop on <em className="text-(--accent-light) italic">Tessera.</em>
                    </p>
                </div>
            }
        >
            <SignupForm />
            <div className="text-center text-sm">
                Already have an account?{' '}
                <Link to="/auth/signin" className="text-primary hover:underline font-medium">
                    Log in
                </Link>
            </div>
        </AuthLayout>
    ),
});
