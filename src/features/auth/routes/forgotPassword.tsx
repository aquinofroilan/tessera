import { createRoute, Link } from '@tanstack/react-router';
import { rootRoute } from '@/src/routes';
import { AuthLayout, ForgotPasswordForm } from '@/src/features/auth/components';

export const forgotPasswordRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/auth/forgot-password',
    component: () => (
        <AuthLayout 
            title="Reset Password" 
            description="Enter your email to receive a reset link"
        >
            <ForgotPasswordForm />
            <div className="text-center text-sm animate-in fade-in slide-in-from-right-4 duration-300">
                Remember your password?{' '}
                <Link to="/auth/signin" className="text-primary hover:underline font-medium">
                    Log in
                </Link>
            </div>
        </AuthLayout>
    ),
});
