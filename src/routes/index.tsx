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
import { InventoryVariantsPage } from '@/src/features/inventory/pages/InventoryVariantsPage';
import { StockMovementsPage } from '@/src/features/inventory/pages/StockMovementsPage';
import { ProductsPage } from '@/src/features/inventory/pages/ProductsPage';
import { UnitOfMeasureCreatePage } from '@/src/features/inventory/pages/UnitOfMeasureCreatePage';
import { UnitOfMeasureDetailPage } from '@/src/features/inventory/pages/UnitOfMeasureDetailPage';
import { UnitOfMeasureSettingsPage } from '@/src/features/inventory/pages/UnitOfMeasureSettingsPage';
import { WarehousesPage } from '@/src/features/inventory/pages/WarehousesPage';
import { WarehouseCreatePage } from '@/src/features/inventory/pages/WarehouseCreatePage';
import { WarehouseDetailPage } from '@/src/features/inventory/pages/WarehouseDetailPage';
import type { WarehouseSearchParams } from '@/src/features/inventory/types/warehouses';
import { ProductCategorySettingsPage } from '@/src/features/inventory/pages/ProductCategorySettingsPage';
import { ProductCreatePage } from '@/src/features/inventory/pages/ProductCreatePage';
import { ProductDetailPage } from '@/src/features/inventory/pages/ProductDetailPage';
import { ProductVariantDetailPage } from '@/src/features/inventory/pages/ProductVariantDetailPage';
import { TaxGroupSettingsPage } from '@/src/features/finance/pages/TaxGroupSettingsPage';
import { FinanceHomePage } from '@/src/features/finance/pages/FinanceHomePage';
import { TaxGroupCreatePage } from '@/src/features/finance/pages/TaxGroupCreatePage';
import { TaxGroupDetailPage } from '@/src/features/finance/pages/TaxGroupDetailPage';
import { TaxRatesSettingsPage } from '@/src/features/finance/pages/TaxRatesSettingsPage';
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

const financeHomeRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/finance',
  component: FinanceHomePage,
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

const unitOfMeasureSettingsRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/inventory/settings/uoms',
  component: UnitOfMeasureSettingsPage,
});

const unitOfMeasureCreateRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/inventory/settings/uoms/new',
  component: UnitOfMeasureCreatePage,
});

const unitOfMeasureDetailRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/inventory/settings/uoms/$uomId',
  component: UnitOfMeasureDetailRouteComponent,
});

const warehouseCreateRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/inventory/warehouses/new',
  component: WarehouseCreatePage,
});

const warehouseDetailRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/inventory/warehouses/$warehouseId',
  component: WarehouseDetailRouteComponent,
});

function WarehouseDetailRouteComponent() {
  const { warehouseId } = warehouseDetailRoute.useParams();
  return <WarehouseDetailPage warehouseId={warehouseId} />;
}

function UnitOfMeasureDetailRouteComponent() {
  const { uomId } = unitOfMeasureDetailRoute.useParams();
  return <UnitOfMeasureDetailPage unitId={uomId} />;
}

const taxRateCreateRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/finance/tax/rates/new',
  component: TaxRateCreatePage,
});

const taxRatesSettingsRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/finance/tax/rates',
  component: TaxRatesSettingsPage,
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

const taxGroupDetailRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/finance/tax/groups/$groupId',
  component: TaxGroupDetailRouteComponent,
});

function TaxGroupDetailRouteComponent() {
  const { groupId } = taxGroupDetailRoute.useParams();
  return <TaxGroupDetailPage groupId={groupId} />;
}

function ProductVariantDetailRouteComponent() {
  const { uuid, variantUuid } = productVariantDetailRoute.useParams();
  return <ProductVariantDetailPage productId={uuid} variantId={variantUuid} />;
}

const inventorySearchSchema = z.object({
  search: z.string().optional().catch(undefined),
  categoryId: z.string().optional().catch(undefined),
  activeFilter: z.enum(['true', 'false']).optional().catch(undefined),
});

const warehouseSearchSchema = z.object({
  search: z.string().optional().catch(undefined),
  activeFilter: z.enum(['true', 'false']).optional().catch(undefined),
});

const inventoryRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/inventory',
  component: InventoryPage,
});

const productsRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/inventory/products',
  validateSearch: inventorySearchSchema,
  component: ProductsRouteComponent,
});

const inventoryVariantsRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/inventory/variants',
  component: InventoryVariantsPage,
});

const stockMovementsRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/inventory/stock-movements',
  component: StockMovementsPage,
});

const warehousesRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/inventory/warehouses',
  validateSearch: warehouseSearchSchema,
  component: WarehousesRouteComponent,
});

function WarehousesRouteComponent() {
  const search = warehousesRoute.useSearch();
  const navigate = warehousesRoute.useNavigate();

  return (
    <WarehousesPage
      searchParams={search}
      updateSearchParams={(updates: WarehouseSearchParams) =>
        navigate({
          replace: true,
          search: (previous) => ({ ...previous, ...updates }),
        })
      }
      clearSearchParams={() => navigate({ replace: true, search: {} })}
    />
  );
}

function ProductsRouteComponent() {
  const search = productsRoute.useSearch();
  const navigate = productsRoute.useNavigate();

  return (
    <ProductsPage
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
  protectedLayoutRoute.addChildren([dashboardRoute, financeHomeRoute, inventoryRoute, productsRoute, inventoryVariantsRoute, stockMovementsRoute, warehousesRoute, warehouseCreateRoute, warehouseDetailRoute, productCreateRoute, productDetailRoute, productVariantDetailRoute, productCategorySettingsRoute, unitOfMeasureSettingsRoute, unitOfMeasureCreateRoute, unitOfMeasureDetailRoute, taxGroupSettingsRoute, taxGroupCreateRoute, taxGroupDetailRoute, taxRatesSettingsRoute, taxRateCreateRoute]),
]);

export const router = createRouter({ routeTree });
router.subscribe('onBeforeNavigate', clearPendingRequestToasts);

// Register router for full strict mode types
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
