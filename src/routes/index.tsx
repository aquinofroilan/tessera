import {
  createRootRoute,
  createRoute,
  createRouter,
  lazyRouteComponent,
  Outlet,
  redirect,
} from '@tanstack/react-router';
import { z } from 'zod';
import { ProtectedRoute } from '@/src/components/router/ProtectedRoute';
import { loginRoute } from '@/src/features/auth/routes/login';
import { signupRoute } from '@/src/features/auth/routes/signup';
import { forgotPasswordRoute } from '@/src/features/auth/routes/forgotPassword';
import { resetPasswordRoute } from '@/src/features/auth/routes/resetPassword';
import { magicLinkRoute } from '@/src/features/auth/routes/magicLink';
import { invitationRoute } from '@/src/features/auth/routes/invitation';
import type { WarehouseSearchParams } from '@/src/features/inventory/types/warehouses';
import { clearPendingRequestToasts } from '@/src/lib/axios';

const DashboardPage = lazyRouteComponent(
  () => import('@/src/features/dashboard/pages/DashboardPage'),
  'DashboardPage',
);
const LandingPage = lazyRouteComponent(
  () => import('@/src/features/landing/pages/LandingPage'),
  'LandingPage',
);
const InventoryPage = lazyRouteComponent(
  () => import('@/src/features/inventory/pages/InventoryPage'),
  'InventoryPage',
);
const InventoryVariantsPage = lazyRouteComponent(
  () => import('@/src/features/inventory/pages/InventoryVariantsPage'),
  'InventoryVariantsPage',
);
const StockMovementsPage = lazyRouteComponent(
  () => import('@/src/features/inventory/pages/StockMovementsPage'),
  'StockMovementsPage',
);
const ProductsPage = lazyRouteComponent(
  () => import('@/src/features/inventory/pages/ProductsPage'),
  'ProductsPage',
);
const ProductCreatePage = lazyRouteComponent(
  () => import('@/src/features/inventory/pages/ProductCreatePage'),
  'ProductCreatePage',
);
const ProductDetailPage = lazyRouteComponent(
  () => import('@/src/features/inventory/pages/ProductDetailPage'),
  'ProductDetailPage',
);
const ProductVariantDetailPage = lazyRouteComponent(
  () => import('@/src/features/inventory/pages/ProductVariantDetailPage'),
  'ProductVariantDetailPage',
);
const ProductCategorySettingsPage = lazyRouteComponent(
  () => import('@/src/features/inventory/pages/ProductCategorySettingsPage'),
  'ProductCategorySettingsPage',
);
const UnitOfMeasureCreatePage = lazyRouteComponent(
  () => import('@/src/features/inventory/pages/UnitOfMeasureCreatePage'),
  'UnitOfMeasureCreatePage',
);
const UnitOfMeasureDetailPage = lazyRouteComponent(
  () => import('@/src/features/inventory/pages/UnitOfMeasureDetailPage'),
  'UnitOfMeasureDetailPage',
);
const UnitOfMeasureSettingsPage = lazyRouteComponent(
  () => import('@/src/features/inventory/pages/UnitOfMeasureSettingsPage'),
  'UnitOfMeasureSettingsPage',
);
const WarehousesPage = lazyRouteComponent(
  () => import('@/src/features/inventory/pages/WarehousesPage'),
  'WarehousesPage',
);
const WarehouseCreatePage = lazyRouteComponent(
  () => import('@/src/features/inventory/pages/WarehouseCreatePage'),
  'WarehouseCreatePage',
);
const WarehouseDetailPage = lazyRouteComponent(
  () => import('@/src/features/inventory/pages/WarehouseDetailPage'),
  'WarehouseDetailPage',
);
const ReorderRulesPage = lazyRouteComponent(
  () => import('@/src/features/inventory/pages/ReorderRulesPage'),
  'ReorderRulesPage',
);
const ReorderRuleCreatePage = lazyRouteComponent(
  () => import('@/src/features/inventory/pages/ReorderRuleCreatePage'),
  'ReorderRuleCreatePage',
);
const ReorderRuleDetailPage = lazyRouteComponent(
  () => import('@/src/features/inventory/pages/ReorderRuleDetailPage'),
  'ReorderRuleDetailPage',
);
const FinanceHomePage = lazyRouteComponent(
  () => import('@/src/features/finance/pages/FinanceHomePage'),
  'FinanceHomePage',
);
const TaxGroupSettingsPage = lazyRouteComponent(
  () => import('@/src/features/finance/pages/TaxGroupSettingsPage'),
  'TaxGroupSettingsPage',
);
const TaxGroupCreatePage = lazyRouteComponent(
  () => import('@/src/features/finance/pages/TaxGroupCreatePage'),
  'TaxGroupCreatePage',
);
const TaxGroupDetailPage = lazyRouteComponent(
  () => import('@/src/features/finance/pages/TaxGroupDetailPage'),
  'TaxGroupDetailPage',
);
const TaxRatesSettingsPage = lazyRouteComponent(
  () => import('@/src/features/finance/pages/TaxRatesSettingsPage'),
  'TaxRatesSettingsPage',
);
const TaxRateCreatePage = lazyRouteComponent(
  () => import('@/src/features/finance/pages/TaxRateCreatePage'),
  'TaxRateCreatePage',
);

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

const reorderRulesRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/inventory/reorder-rules',
  component: ReorderRulesPage,
});

const reorderRuleCreateRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/inventory/reorder-rules/new',
  component: ReorderRuleCreatePage,
});

const reorderRuleDetailRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/inventory/reorder-rules/$ruleId',
  component: ReorderRuleDetailRouteComponent,
});

function ReorderRuleDetailRouteComponent() {
  const { ruleId } = reorderRuleDetailRoute.useParams();
  return <ReorderRuleDetailPage ruleId={ruleId} />;
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
  },
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
  protectedLayoutRoute.addChildren([
    dashboardRoute,
    financeHomeRoute,
    inventoryRoute,
    productsRoute,
    inventoryVariantsRoute,
    stockMovementsRoute,
    warehousesRoute,
    warehouseCreateRoute,
    warehouseDetailRoute,
    reorderRulesRoute,
    reorderRuleCreateRoute,
    reorderRuleDetailRoute,
    productCreateRoute,
    productDetailRoute,
    productVariantDetailRoute,
    productCategorySettingsRoute,
    unitOfMeasureSettingsRoute,
    unitOfMeasureCreateRoute,
    unitOfMeasureDetailRoute,
    taxGroupSettingsRoute,
    taxGroupCreateRoute,
    taxGroupDetailRoute,
    taxRatesSettingsRoute,
    taxRateCreateRoute,
  ]),
]);

export const router = createRouter({ routeTree });
router.subscribe('onBeforeNavigate', clearPendingRequestToasts);

// Register router for full strict mode types
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
