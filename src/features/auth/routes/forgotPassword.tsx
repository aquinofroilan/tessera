import { createRoute, Link } from '@tanstack/react-router';
import { rootRoute } from '@/src/routes';
import { AuthLayout, ForgotPasswordForm } from '@/src/features/auth/components';

export const forgotPasswordRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/forgot-password',
    component: () => (
        <AuthLayout 
            title="Reset Password" 
            description="Enter your email to receive a reset link"
        >
            <ForgotPasswordForm />
            <div className="text-center text-sm">
                Remember your password?{' '}
                <Link to="/auth/signin" className="text-primary hover:underline font-medium">
                    Log in
                </Link>
            </div>
        </AuthLayout>
    ),
});
