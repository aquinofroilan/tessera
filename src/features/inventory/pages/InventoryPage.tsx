import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DashboardShell } from '@/src/features/dashboard/components/DashboardShell'
import { useProductCategories } from '@/src/features/inventory/api/productCategories'
import { useUnitsOfMeasure } from '@/src/features/inventory/api/unitsOfMeasure'
import { useProducts } from '@/src/features/inventory/api/products'
import { InventoryVariantsTable } from '@/src/features/inventory/components/InventoryVariantsTable'
import { UnitOfMeasureTable } from '@/src/features/inventory/components/UnitOfMeasureTable'
import type { ProductCategoryResponse } from '@/src/features/inventory/types/productCategories'
import type { ProductResponse } from '@/src/features/inventory/types/products'
import { formatPrice } from '@/src/features/inventory/utils/formatPrice'
import { getApiErrorMessage } from '@/src/lib/api-error'

function ProductOverviewTable ( { products }: Readonly<{ products: ProductResponse[] }> ) {
    if ( !products.length ) {
        return (
            <div className="px-5 py-12 text-center">
                <h3 className="font-display text-xl">No products yet</h3>
                <p className="mt-2 text-sm text-(--muted)">Products added to this organization will appear here.</p>
            </div>
        )
    }

    return (
        <Table>
            <TableHeader>
                <TableRow className="hover:bg-transparent">
                    <TableHead>SKU</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">List price</TableHead>
                    <TableHead>Tracking</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                { products.map( product => {
                    const tracking: string[] = []
                    if ( product.isLotTracked ) tracking.push( 'Lots' )
                    if ( product.isSerialized ) tracking.push( 'Serial' )
                    if ( product.hasExpiry ) tracking.push( 'Expiry' )

                    return (
                        <TableRow key={ product.id }>
                            <TableCell className="font-mono text-xs text-(--ink-soft)">{ product.sku }</TableCell>
                            <TableCell>
                                <Link
                                    to="/inventory/item/$uuid"
                                    params={ { uuid: product.id } }
                                    className="rounded-sm font-medium text-(--ink) underline decoration-transparent underline-offset-4 transition-colors hover:text-(--accent) hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ink)"
                                >
                                    { product.name }
                                </Link>
                                { product.description ? <span className="mt-0.5 block max-w-[42ch] truncate text-xs text-(--muted)">{ product.description }</span> : null }
                            </TableCell>
                            <TableCell className="text-right font-medium">{ formatPrice( product ) }</TableCell>
                            <TableCell>
                                { tracking.length ? (
                                    <div className="flex flex-wrap gap-1.5">
                                        { tracking.map( label => <span key={ label } className="rounded-full bg-(--paper-2) px-2 py-0.5 text-[11px] text-(--ink-soft)">{ label }</span> ) }
                                    </div>
                                ) : <span className="text-(--muted)">None</span> }
                            </TableCell>
                            <TableCell>
                                <StatusBadge isActive={ product.isActive } />
                            </TableCell>
                        </TableRow>
                    )
                } ) }
            </TableBody>
        </Table>
    )
}

function CategoryOverviewTable ( { categories }: Readonly<{ categories: ProductCategoryResponse[] }> ) {
    if ( !categories.length ) {
        return (
            <div className="px-5 py-12 text-center">
                <h3 className="font-display text-xl">No product categories yet</h3>
                <p className="mt-2 text-sm text-(--muted)">Categories configured for this organization will appear here.</p>
            </div>
        )
    }

    return (
        <Table>
            <TableHeader>
                <TableRow className="hover:bg-transparent">
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                { categories.map( category => (
                    <TableRow key={ category.id }>
                        <TableCell className="font-medium">{ category.name }</TableCell>
                        <TableCell className="max-w-[48ch] truncate text-(--ink-soft)">{ category.description || '—' }</TableCell>
                        <TableCell><StatusBadge isActive={ category.isActive } /></TableCell>
                    </TableRow>
                ) ) }
            </TableBody>
        </Table>
    )
}

function StatusBadge ( { isActive }: Readonly<{ isActive: boolean }> ) {
    return (
        <span className={ `inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${ isActive ? 'bg-(--moss-soft) text-(--moss)' : 'bg-(--paper-2) text-(--muted)' }` }>
            { isActive ? 'Active' : 'Inactive' }
        </span>
    )
}

export function InventoryPage () {
    const activeProductsQuery = useProducts( { isActive: true } )
    const inactiveProductsQuery = useProducts( { isActive: false } )
    const categoriesQuery = useProductCategories( { activeOnly: false } )
    const unitsQuery = useUnitsOfMeasure( { activeOnly: false } )
    const products = [ ...( activeProductsQuery.data ?? [] ), ...( inactiveProductsQuery.data ?? [] ) ]
        .sort( ( first, second ) => first.name.localeCompare( second.name ) )
    const isProductsLoading = activeProductsQuery.isPending || inactiveProductsQuery.isPending
    const productsError = activeProductsQuery.error ?? inactiveProductsQuery.error
    const retryProducts = () => {
        void Promise.all( [ activeProductsQuery.refetch(), inactiveProductsQuery.refetch() ] )
    }

    return (
        <DashboardShell>
            <div className="w-full">
                <header className="mb-7 border-b border-(--rule) pb-6">
                    <h1 className="font-display text-[clamp(36px,4vw,48px)] font-light leading-none tracking-[-0.03em]">Inventory</h1>
                    <p className="mt-2.5 max-w-2xl text-[15px] text-(--ink-soft)">An organization-wide view of products, variants, categories, and units of measure.</p>
                </header>

                <section aria-labelledby="inventory-products-heading" className="mb-6 min-w-0">
                    <Card className="overflow-hidden">
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-(--rule) px-5 py-4 sm:px-6">
                            <div>
                                <p className="mb-1 font-mono text-[10px] tracking-[0.14em] text-(--muted) uppercase">Inventory overview</p>
                                <h2 id="inventory-products-heading" className="font-display text-xl font-light">Products</h2>
                            </div>
                            <Button asChild variant="pill-ghost" size="sm" className="border border-(--rule)">
                                <Link to="/inventory/products">View all products</Link>
                            </Button>
                        </div>
                        { activeProductsQuery.isError || inactiveProductsQuery.isError ? (
                            <div className="flex flex-col items-start gap-3 p-5 sm:p-6" role="alert">
                                <p className="text-sm text-(--accent-deep)">{ getApiErrorMessage( productsError, 'Products could not be loaded. Check your connection and try again.', { 403: 'You do not have permission to view inventory products. Ask an administrator for inventory:read access.' } ) }</p>
                                <Button type="button" variant="pill-ghost" className="border border-(--rule)" onClick={ retryProducts }>Retry</Button>
                            </div>
                        ) : isProductsLoading ? (
                            <div className="flex items-center justify-center gap-2 p-8 text-sm text-(--muted)" aria-live="polite">
                                <Spinner className="size-4 text-(--accent)" aria-label="Loading products" />
                                <span>Loading products…</span>
                            </div>
                        ) : <ProductOverviewTable products={ products } /> }
                    </Card>
                </section>

                <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-2">
                    <InventoryVariantsTable showCategory={ false } className="min-w-0" />

                    <section aria-labelledby="inventory-categories-heading" className="min-w-0">
                        <Card className="overflow-hidden">
                            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-(--rule) px-5 py-4 sm:px-6">
                                <div>
                                    <p className="mb-1 font-mono text-[10px] tracking-[0.14em] text-(--muted) uppercase">Inventory setup</p>
                                    <h2 id="inventory-categories-heading" className="font-display text-xl font-light">Product categories</h2>
                                </div>
                                <Button asChild variant="pill-ghost" size="sm" className="border border-(--rule)">
                                    <Link to="/inventory/settings/product-categories">Manage</Link>
                                </Button>
                            </div>
                            { categoriesQuery.isError ? (
                                <div className="flex flex-col items-start gap-3 p-5 sm:p-6" role="alert">
                                    <p className="text-sm text-(--accent-deep)">{ getApiErrorMessage( categoriesQuery.error, 'Product categories could not be loaded. Check your connection and try again.', { 403: 'You do not have permission to view product categories.' } ) }</p>
                                    <Button type="button" variant="pill-ghost" className="border border-(--rule)" onClick={ () => { void categoriesQuery.refetch() } }>Retry</Button>
                                </div>
                            ) : categoriesQuery.isPending ? (
                                <div className="flex items-center justify-center gap-2 p-8 text-sm text-(--muted)" aria-live="polite">
                                    <Spinner className="size-4 text-(--accent)" aria-label="Loading product categories" />
                                    <span>Loading product categories…</span>
                                </div>
                            ) : <CategoryOverviewTable categories={ categoriesQuery.data ?? [] } /> }
                        </Card>
                    </section>
                </div>

                <section aria-labelledby="inventory-uoms-heading" className="mt-6 min-w-0">
                    <Card className="overflow-hidden">
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-(--rule) px-5 py-4 sm:px-6">
                            <div>
                                <p className="mb-1 font-mono text-[10px] tracking-[0.14em] text-(--muted) uppercase">Inventory setup</p>
                                <h2 id="inventory-uoms-heading" className="font-display text-xl font-light">Units of measure</h2>
                                <p className="mt-1 text-sm text-(--ink-soft)">{ unitsQuery.isPending ? 'Loading units…' : unitsQuery.isError ? 'Unit count is unavailable.' : `${ unitsQuery.data?.length ?? 0 } ${ unitsQuery.data?.length === 1 ? 'unit' : 'units' } configured, including inactive units.` }</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <Button asChild variant="pill-ghost" size="sm" className="border border-(--rule)">
                                    <Link to="/inventory/settings/uoms">Manage units</Link>
                                </Button>
                                <Button asChild variant="pill-ghost" size="sm" className="bg-(--ink) text-(--paper) hover:bg-(--accent)">
                                    <Link to="/inventory/settings/uoms/new">Add unit</Link>
                                </Button>
                            </div>
                        </div>
                        <CardContent className="p-0">
                            { unitsQuery.isError ? (
                                <div className="flex flex-col items-start gap-3 p-5 sm:p-6" role="alert">
                                    <p className="text-sm text-(--accent-deep)">{ getApiErrorMessage( unitsQuery.error, 'Units of measure could not be loaded. Check your connection and try again.', { 403: 'You do not have permission to view units of measure. Ask an administrator for inventory:read access.' } ) }</p>
                                    <Button type="button" variant="pill-ghost" className="border border-(--rule)" onClick={ () => { void unitsQuery.refetch() } }>Retry</Button>
                                </div>
                            ) : unitsQuery.isPending ? (
                                <div className="flex items-center justify-center gap-2 p-8 text-sm text-(--muted)" aria-live="polite">
                                    <Spinner className="size-4 text-(--accent)" aria-label="Loading units of measure" />
                                    <span>Loading units of measure…</span>
                                </div>
                            ) : unitsQuery.data?.length ? (
                                <UnitOfMeasureTable units={ [ ...unitsQuery.data ].sort( ( first, second ) => first.name.localeCompare( second.name ) ) } />
                            ) : (
                                <div className="px-5 py-12 text-center">
                                    <h3 className="font-display text-xl">No units of measure yet</h3>
                                    <p className="mt-2 text-sm text-(--muted)">Units configured for this organization will appear here.</p>
                                    <Button asChild variant="pill-ghost" className="mt-4 bg-(--ink) text-(--paper) hover:bg-(--accent)">
                                        <Link to="/inventory/settings/uoms/new">Create a unit</Link>
                                    </Button>
                                </div>
                            ) }
                        </CardContent>
                    </Card>
                </section>
            </div>
        </DashboardShell>
    )
}
