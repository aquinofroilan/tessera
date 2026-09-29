import { createRoute, Link } from '@tanstack/react-router';
import { rootRoute } from '@/src/routes';
import { AuthLayout, SignupForm } from '@/src/features/auth/components';

export const signupRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/signup',
    component: () => (
        <AuthLayout 
            title="Create an account" 
            description="Enter your details to get started"
        >
            <SignupForm />
            <div className="mt-4 text-center text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline font-medium">
                    Log in
                </Link>
            </div>
        </AuthLayout>
    ),
});
