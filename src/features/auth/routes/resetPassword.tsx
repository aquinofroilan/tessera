import { createRoute, Link } from '@tanstack/react-router';
import { rootRoute } from '../../../routes';
import { AuthLayout, ResetPasswordForm } from '../components';
import { z } from 'zod';

const resetPasswordSearchSchema = z.object({
    token: z.string().optional(),
});

export const resetPasswordRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/reset-password',
    validateSearch: resetPasswordSearchSchema,
    component: () => {
        const { token } = resetPasswordRoute.useSearch();
        
        if (!token) {
            return (
                <AuthLayout title="Invalid Link" description="The password reset link is invalid or missing a token.">
                    <div className="text-center mt-4">
                        <Link to="/forgot-password" className="text-primary hover:underline font-medium">
                            Request a new link
                        </Link>
                    </div>
                </AuthLayout>
            );
        }

        return (
            <AuthLayout 
                title="Create New Password" 
                description="Enter your new password below"
            >
                <ResetPasswordForm token={token} />
            </AuthLayout>
        );
    },
});
