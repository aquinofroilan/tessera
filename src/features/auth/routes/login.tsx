import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../../../routes';
import { AuthLayout, LoginForm } from '../components';

export const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/login',
    component: () => (
        <AuthLayout title="Welcome back" description="Enter your credentials to continue">
            <LoginForm />
        </AuthLayout>
    ),
});
