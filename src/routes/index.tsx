import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';

// Root route acts as the main layout
const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Tessera Dashboard</h1>
        <p className="mt-2 text-gray-600">Bulletproof React Scaffolding Active</p>
      </div>
    </div>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
});

const routeTree = rootRoute.addChildren([indexRoute]);

export const router = createRouter({ routeTree });

// Register router for full strict mode types
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
