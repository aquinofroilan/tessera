import { createRoute, Link } from '@tanstack/react-router';
import { rootRoute } from '../../../routes';
import { AuthLayout, LoginForm } from '../components';

export const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/login',
    component: () => (
        <AuthLayout title="Welcome back" description="Enter your credentials to continue">
            <LoginForm />
            <div className="mt-4 text-center text-sm">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary hover:underline font-medium">
                    Sign up
                </Link>
            </div>
        </AuthLayout>
    ),
});
