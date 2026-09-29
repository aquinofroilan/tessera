import { createRootRoute, createRoute, createRouter, Outlet, redirect } from '@tanstack/react-router';
import { ProtectedRoute } from '../components/router/ProtectedRoute';
import { loginRoute } from '../features/auth/routes/login';
import { signupRoute } from '../features/auth/routes/signup';
import { forgotPasswordRoute } from '../features/auth/routes/forgotPassword';
import { resetPasswordRoute } from '../features/auth/routes/resetPassword';
import { magicLinkRoute } from '../features/auth/routes/magicLink';
import { invitationRoute } from '../features/auth/routes/invitation';

// Root route acts as the main layout wrapper
export const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// A protected layout route
export const protectedLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'protected',
  component: () => <ProtectedRoute />,
});

// The dashboard/index route, which is protected
export const dashboardRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/dashboard',
  component: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Tessera Dashboard</h1>
        <p className="text-gray-600">You are securely logged in.</p>
      </div>
    </div>
  ),
});

// Redirect root to dashboard
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/dashboard', replace: true });
  }
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  signupRoute,
  forgotPasswordRoute,
  resetPasswordRoute,
  magicLinkRoute,
  invitationRoute,
  protectedLayoutRoute.addChildren([dashboardRoute]),
]);

export const router = createRouter({ routeTree });

// Register router for full strict mode types
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
