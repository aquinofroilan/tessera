import { createRootRoute, createRoute, createRouter, Outlet, redirect } from '@tanstack/react-router';
import { z } from 'zod';
import { ProtectedRoute } from '@/src/components/router/ProtectedRoute';
import { loginRoute } from '@/src/features/auth/routes/login';
import { signupRoute } from '@/src/features/auth/routes/signup';
import { forgotPasswordRoute } from '@/src/features/auth/routes/forgotPassword';
import { resetPasswordRoute } from '@/src/features/auth/routes/resetPassword';
import { magicLinkRoute } from '@/src/features/auth/routes/magicLink';
import { invitationRoute } from '@/src/features/auth/routes/invitation';
import { DashboardPage } from '@/src/features/dashboard/pages/DashboardPage';
import { LandingPage } from '@/src/features/landing/pages/LandingPage';
import { InventoryPage } from '@/src/features/inventory/pages/InventoryPage';
import { ProductCategorySettingsPage } from '@/src/features/inventory/pages/ProductCategorySettingsPage';
import { ProductCreatePage } from '@/src/features/inventory/pages/ProductCreatePage';
import { ProductDetailPage } from '@/src/features/inventory/pages/ProductDetailPage';
import { ProductVariantDetailPage } from '@/src/features/inventory/pages/ProductVariantDetailPage';
import { TaxGroupSettingsPage } from '@/src/features/finance/pages/TaxGroupSettingsPage';
import { TaxGroupCreatePage } from '@/src/features/finance/pages/TaxGroupCreatePage';
import { TaxRateCreatePage } from '@/src/features/finance/pages/TaxRateCreatePage';
import { clearPendingRequestToasts } from '@/src/lib/axios';

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
  component: DashboardPage,
});

const productCreateRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/inventory/products/new',
  component: ProductCreatePage,
});

const productDetailRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/inventory/item/$uuid',
  component: ProductDetailRouteComponent,
});

function ProductDetailRouteComponent() {
  const { uuid } = productDetailRoute.useParams();
  return <ProductDetailPage productId={uuid} />;
}

const productCategorySettingsRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/inventory/settings/product-categories',
  component: ProductCategorySettingsPage,
});

const taxRateCreateRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/finance/tax/rates/new',
  component: TaxRateCreatePage,
});

const productVariantDetailRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/inventory/item/$uuid/variant/$variantUuid',
  component: ProductVariantDetailRouteComponent,
});

const taxGroupSettingsRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/finance/tax/groups',
  component: TaxGroupSettingsPage,
});

const taxGroupCreateRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/finance/tax/groups/new',
  component: TaxGroupCreatePage,
});

function ProductVariantDetailRouteComponent() {
  const { uuid, variantUuid } = productVariantDetailRoute.useParams();
  return <ProductVariantDetailPage productId={uuid} variantId={variantUuid} />;
}

const inventorySearchSchema = z.object({
  search: z.string().optional().catch(undefined),
  categoryId: z.string().optional().catch(undefined),
  activeFilter: z.enum(['true', 'false']).optional().catch(undefined),
});

const inventoryRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/inventory',
  validateSearch: inventorySearchSchema,
  component: InventoryRouteComponent,
});

function InventoryRouteComponent() {
  const search = inventoryRoute.useSearch();
  const navigate = inventoryRoute.useNavigate();

  return (
    <InventoryPage
      searchParams={search}
      updateSearchParams={(updates) =>
        navigate({
          replace: true,
          search: (previous) => ({ ...previous, ...updates }),
        })
      }
      clearSearchParams={() => navigate({ replace: true, search: {} })}
    />
  );
}

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/landing',
  component: LandingPage,
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
  landingRoute,
  protectedLayoutRoute.addChildren([dashboardRoute, inventoryRoute, productCreateRoute, productDetailRoute, productVariantDetailRoute, productCategorySettingsRoute, taxGroupSettingsRoute, taxGroupCreateRoute, taxRateCreateRoute]),
]);

export const router = createRouter({ routeTree });
router.subscribe('onBeforeNavigate', clearPendingRequestToasts);

// Register router for full strict mode types
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
