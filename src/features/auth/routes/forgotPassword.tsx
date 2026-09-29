import { createRoute, Link } from '@tanstack/react-router';
import { rootRoute } from '../../../routes';
import { AuthLayout, ForgotPasswordForm } from '../components';

export const forgotPasswordRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/forgot-password',
    component: () => (
        <AuthLayout 
            title="Reset Password" 
            description="Enter your email to receive a reset link"
        >
            <ForgotPasswordForm />
            <div className="mt-4 text-center text-sm">
                Remember your password?{' '}
                <Link to="/login" className="text-primary hover:underline font-medium">
                    Log in
                </Link>
            </div>
        </AuthLayout>
    ),
});
