import { createRoute, Link } from '@tanstack/react-router';
import { rootRoute } from '@/src/routes';
import { AuthLayout, LoginForm } from '@/src/features/auth/components';

export const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/auth/signin',
    component: () => (
        <AuthLayout title="Welcome back" description="Enter your credentials to continue">
            <LoginForm />
            <div className="text-center text-sm animate-in fade-in slide-in-from-left-4 duration-300">
                Don't have an account?{' '}
                <Link to="/auth/signup" className="text-primary hover:underline font-medium">
                    Sign up
                </Link>
            </div>
        </AuthLayout>
    ),
});
