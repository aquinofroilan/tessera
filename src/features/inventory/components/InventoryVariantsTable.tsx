import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useProductCategories } from '@/src/features/inventory/api/productCategories'
import { useInventoryVariants } from '@/src/features/inventory/api/productVariants'
import { useProducts } from '@/src/features/inventory/api/products'
import type { InventoryPageProps } from '@/src/features/inventory/types/inventory'
import type { ProductResponse } from '@/src/features/inventory/types/products'
import { formatVariantAttribute } from '@/src/features/inventory/utils/formatVariantAttribute'
import { getApiErrorMessage } from '@/src/lib/api-error'

type InventoryVariantsTableProps = Pick<InventoryPageProps, 'searchParams' | 'clearSearchParams'>

function getVariantErrorMessage ( error: unknown ) {
    return getApiErrorMessage( error, 'Product variants could not be loaded. Check your connection and try again.', {
        403: 'You do not have permission to view product variants. Ask an administrator for inventory:read access.',
    } )
}

function getProductName ( product: ProductResponse | undefined, productId: string ) {
    return product?.name ?? `Product ${ productId.slice( 0, 8 ) }`
}

export function InventoryVariantsTable ( { searchParams, clearSearchParams }: InventoryVariantsTableProps ) {
    const { search = '', categoryId = '', activeFilter = 'true' } = searchParams
    const variantsQuery = useInventoryVariants( {
        search: search.trim() || undefined,
        categoryId: categoryId || undefined,
        isActive: activeFilter === 'true',
    } )
    const activeProductsQuery = useProducts( { isActive: true } )
    const inactiveProductsQuery = useProducts( { isActive: false } )
    const categoriesQuery = useProductCategories( { activeOnly: false } )

    const productsById = new Map( [
        ...( activeProductsQuery.data ?? [] ),
        ...( inactiveProductsQuery.data ?? [] ),
    ].map( product => [ product.id, product ] ) )
    const categoryNames = new Map( ( categoriesQuery.data ?? [] ).map( category => [ category.id, category.name ] ) )

    const isLoading = variantsQuery.isPending || activeProductsQuery.isPending || inactiveProductsQuery.isPending || categoriesQuery.isPending
    const hasFilters = Boolean( search.trim() || categoryId || activeFilter !== 'true' )
    const productLookupError = activeProductsQuery.isError ? activeProductsQuery.error : inactiveProductsQuery.error
    const isError = variantsQuery.isError || activeProductsQuery.isError || inactiveProductsQuery.isError
    const error = variantsQuery.error ?? productLookupError
    const retry = () => {
        void Promise.all( [ variantsQuery.refetch(), activeProductsQuery.refetch(), inactiveProductsQuery.refetch(), categoriesQuery.refetch() ] )
    }

    const renderTableContent = () => {
        if ( isError ) {
            return (
                <div className="flex flex-col items-start gap-3 p-5 sm:p-6" role="alert">
                    <p className="text-sm text-(--accent-deep)">{ getVariantErrorMessage( error ) }</p>
                    <Button type="button" variant="pill-ghost" className="border border-(--rule)" onClick={ retry }>Retry</Button>
                </div>
            )
        }

        if ( isLoading ) {
            return (
                <div className="flex items-center justify-center gap-2 p-8 text-sm text-(--muted)" aria-live="polite">
                    <Spinner className="size-4 text-(--accent)" aria-label="Loading variants" />
                    <span>Loading variants…</span>
                </div>
            )
        }

        if ( variantsQuery.data?.length ) {
            return (
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead>Code</TableHead>
                            <TableHead>Variant</TableHead>
                            <TableHead>SKU suffix</TableHead>
                            <TableHead>Attributes</TableHead>
                            <TableHead>Parent product</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        { variantsQuery.data.map( variant => {
                            const product = productsById.get( variant.productId )
                            const attributes = Object.entries( variant.attributes ?? {} )
                            const categoryName = product?.categoryId ? categoryNames.get( product.categoryId ) : undefined

                            return (
                                <TableRow key={ variant.id }>
                                    <TableCell className="font-mono text-xs text-(--ink-soft)">{ variant.code }</TableCell>
                                    <TableCell>
                                        <Link
                                            to="/inventory/item/$uuid/variant/$variantUuid"
                                            params={ { uuid: variant.productId, variantUuid: variant.id } }
                                            aria-label={ `View ${ variant.name } variant details` }
                                            className="rounded-sm font-medium text-(--ink) underline decoration-transparent underline-offset-4 transition-colors hover:text-(--accent) hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ink)"
                                        >
                                            { variant.name }
                                        </Link>
                                    </TableCell>
                                    <TableCell className="font-mono text-xs text-(--ink-soft)">{ variant.skuSuffix || '—' }</TableCell>
                                    <TableCell>
                                        { attributes.length ? (
                                            <div className="flex flex-wrap gap-1.5">
                                                { attributes.map( ( [ key, value ] ) => <span key={ key } className="rounded-full bg-(--paper-2) px-2 py-0.5 text-[11px] text-(--ink-soft)">{ key }: { formatVariantAttribute( value ) }</span> ) }
                                            </div>
                                        ) : <span className="text-(--muted)">—</span> }
                                    </TableCell>
                                    <TableCell>
                                        <Link
                                            to="/inventory/item/$uuid"
                                            params={ { uuid: variant.productId } }
                                            className="rounded-sm font-medium text-(--ink) underline decoration-transparent underline-offset-4 transition-colors hover:text-(--accent) hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ink)"
                                        >
                                            { getProductName( product, variant.productId ) }
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-(--ink-soft)">{ product?.categoryId ? categoryName ?? 'Category unavailable' : '—' }</TableCell>
                                    <TableCell>
                                        <span className={ `inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${ variant.isActive ? 'bg-(--moss-soft) text-(--moss)' : 'bg-(--paper-2) text-(--muted)' }` }>{ variant.isActive ? 'Active' : 'Inactive' }</span>
                                    </TableCell>
                                </TableRow>
                            )
                        } ) }
                    </TableBody>
                </Table>
            )
        }

        return (
            <div className="px-5 py-12 text-center">
                <h3 className="font-display text-xl">{ hasFilters ? 'No variants match these filters' : 'No variants yet' }</h3>
                <p className="mt-2 text-sm text-(--muted)">{ hasFilters ? 'Try a different search or clear the filters to see more variants.' : 'Variants for products in this organization will appear here.' }</p>
                { hasFilters ? <Button type="button" variant="pill-ghost" className="mt-4 border border-(--rule)" onClick={ clearSearchParams }>Clear filters</Button> : null }
            </div>
        )
    }

    return (
        <section aria-labelledby="inventory-variants-heading" className="mt-6">
            <Card className="overflow-hidden">
                <div className="flex items-center justify-between gap-4 border-b border-(--rule) px-5 py-4 sm:px-6">
                    <div>
                        <p className="mb-1 font-mono text-[10px] tracking-[0.14em] text-(--muted) uppercase">Catalog</p>
                        <h2 id="inventory-variants-heading" className="font-display text-xl font-light">Product variants</h2>
                    </div>
                    { variantsQuery.data ? <span className="whitespace-nowrap font-mono text-xs text-(--muted)">{ variantsQuery.data.length } { variantsQuery.data.length === 1 ? 'variant' : 'variants' }</span> : null }
                </div>
                <CardContent className="p-0">{ renderTableContent() }</CardContent>
            </Card>
        </section>
    )
}
