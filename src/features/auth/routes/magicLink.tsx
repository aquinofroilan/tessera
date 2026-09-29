import { createRoute, Link } from '@tanstack/react-router';
import { rootRoute } from '../../../routes';
import { AuthLayout, MagicLinkForm, MagicLinkConsume } from '../components';
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
                <div className="mt-4 text-center text-sm">
                    Prefer to use a password?{' '}
                    <Link to="/login" className="text-primary hover:underline font-medium">
                        Log in
                    </Link>
                </div>
            </AuthLayout>
        );
    },
});
