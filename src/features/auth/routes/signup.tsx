import { createRoute, Link } from '@tanstack/react-router';
import { rootRoute } from '@/src/routes';
import { AuthLayout, SignupForm } from '@/src/features/auth/components';

export const signupRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/auth/signup',
    component: () => (
        <AuthLayout 
            title="Create an account" 
            description="Enter your details to get started"
            variant="editorial"
            editorialContent={
                <div className="auth-editorial-content">
                    <span className="auth-editorial-kicker">Tessera · built for the whole shop</span>
                    <p className="auth-editorial-quote">
                        Run the whole shop on <em>Tessera.</em>
                    </p>
                </div>
            }
        >
            <SignupForm />
            <div className="text-center text-sm animate-in fade-in slide-in-from-right-4 duration-300">
                Already have an account?{' '}
                <Link to="/auth/signin" className="text-primary hover:underline font-medium">
                    Log in
                </Link>
            </div>
        </AuthLayout>
    ),
});
