import { createRoute, Link } from '@tanstack/react-router';
import { rootRoute } from '@/src/routes';
import { AuthLayout, MagicLinkForm, MagicLinkConsume } from '@/src/features/auth/components';
import { z } from 'zod';

const magicLinkSearchSchema = z.object({
    token: z.string().optional(),
});

export const magicLinkRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/magic-link',
    validateSearch: magicLinkSearchSchema,
    component: () => {
        const { token } = magicLinkRoute.useSearch();
        
        if (token) {
            return (
                <AuthLayout 
                    title="Authenticating" 
                    description="Please wait while we log you in"
                >
                    <MagicLinkConsume token={token} />
                </AuthLayout>
            );
        }

        return (
            <AuthLayout 
                title="Sign in with Magic Link" 
                description="We'll email you a secure, passwordless link to instantly log in."
            >
                <MagicLinkForm />
                <div className="text-center text-sm animate-in fade-in slide-in-from-right-4 duration-300">
                    Prefer to use a password?{' '}
                    <Link to="/auth/signin" className="text-primary hover:underline font-medium">
                        Log in
                    </Link>
                </div>
            </AuthLayout>
        );
    },
});
