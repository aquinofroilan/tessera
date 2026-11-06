import { Link } from '@tanstack/react-router'
import { formatDistanceToNow } from 'date-fns'
import type { ReactNode } from 'react'
import { ArrowLeft, CalendarClock, Package, Tag } from '@/components/ui/hugeicons'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { DashboardShell } from '@/src/features/dashboard/components/DashboardShell'
import { ProductEditSheet } from '@/src/features/inventory/components/ProductEditSheet'
import { ProductDeactivateDialog } from '@/src/features/inventory/components/ProductDeactivateDialog'
import { ProductVariantsTable } from '@/src/features/inventory/components/ProductVariantsTable'
import { useProduct } from '@/src/features/inventory/api/products'
import { useProductCategories } from '@/src/features/inventory/api/productCategories'
import type { ProductResponse } from '@/src/features/inventory/types/products'
import { formatPrice } from '@/src/features/inventory/utils/formatPrice'

type ProductDetailPageProps = {
    productId: string
}

function getErrorStatus ( error: unknown ): number | undefined {
    if ( typeof error !== 'object' || error === null || !('response' in error) ) return undefined
    const response = error.response
    if ( typeof response !== 'object' || response === null || !('status' in response) ) return undefined
    return typeof response.status === 'number' ? response.status : undefined
}

function getErrorMessage ( error: unknown ) {
    if ( typeof error === 'object' && error !== null && 'response' in error ) {
        const response = error.response
        if ( typeof response === 'object' && response !== null && 'data' in response ) {
            const data = response.data
            if ( typeof data === 'object' && data !== null && 'message' in data && typeof data.message === 'string' ) {
                return data.message
            }
        }
    }
    return 'Product details could not be loaded. Check your connection and try again.'
}

function formatExactDate ( date: Date ) {
    return date.toLocaleString()
}

function RecordDate ( { value }: { value: string } ) {
    const date = new Date( value )
    if ( Number.isNaN( date.getTime() ) ) return <>—</>

    return (
        <span className="grid gap-0.5">
            <time dateTime={ date.toISOString() } title={ formatExactDate( date ) }>{ formatDistanceToNow( date, { addSuffix: true } ) }</time>
            <span className="text-xs text-(--muted)">{ formatExactDate( date ) }</span>
        </span>
    )
}

function DetailItem ( { label, value }: { label: string, value: ReactNode } ) {
    return (
        <div className="grid gap-1 border-b border-(--rule) py-3 last:border-b-0 sm:grid-cols-[150px_1fr] sm:gap-4">
            <dt className="text-xs font-medium text-(--muted)">{ label }</dt>
            <dd className="min-w-0 break-words text-sm text-(--ink)">{ value }</dd>
        </div>
    )
}

function ProductDetails ( { product }: { product: ProductResponse } ) {
    const categoriesQuery = useProductCategories( { activeOnly: false } )
    const categoryName = product.categoryId
        ? categoriesQuery.data?.find( category => category.id === product.categoryId )?.name ?? 'Category unavailable'
        : 'Uncategorized'
    const tracking = [
        product.isLotTracked ? 'Lot tracked' : null,
        product.isSerialized ? 'Serialized' : null,
        product.hasExpiry ? 'Expiry tracked' : null,
    ].filter( ( value ): value is string => Boolean( value ) )

    return (
        <>
            <div className="mb-7 flex items-end justify-between gap-5 border-b border-(--rule) pb-6 max-sm:block">
                <div className="min-w-0">
                    <h1 className="break-words font-display text-[clamp(34px,4vw,48px)] font-light leading-none tracking-[-0.03em]">{ product.name }</h1>
                    <p className="mt-2.5 font-mono text-sm text-(--ink-soft)">{ product.sku }</p>
                </div>
                <div className="mt-5 flex shrink-0 flex-wrap gap-2 sm:mt-0">
                    <ProductEditSheet product={ product } />
                    { product.isActive ? <ProductDeactivateDialog productId={ product.id } productName={ product.name } /> : null }
                    <Button asChild variant="pill-ghost" size="sm" className="rounded-lg border border-(--rule)">
                        <Link to="/inventory"><ArrowLeft size={ 15 } aria-hidden="true" />Back to products</Link>
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(260px,0.8fr)]">
                <Card>
                    <CardContent className="p-5 sm:p-6">
                        <div className="mb-5 flex items-start justify-between gap-4">
                            <div>
                                <p className="mb-1 font-mono text-[10px] tracking-[0.12em] text-(--muted) uppercase">Product details</p>
                                <h2 className="font-display text-2xl font-light">Master data</h2>
                            </div>
                            <span className={ `inline-flex shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${ product.isActive ? 'bg-(--moss-soft) text-(--moss)' : 'bg-(--paper-2) text-(--muted)' }` }>
                                { product.isActive ? 'Active' : 'Inactive' }
                            </span>
                        </div>
                        { product.imageUrl ? (
                            <img src={ product.imageUrl } alt={ product.name } className="mb-5 max-h-64 w-full rounded-xl border border-(--rule) bg-(--paper-2) object-contain" />
                        ) : null }
                        <dl>
                            <DetailItem label="SKU" value={ product.sku } />
                            <DetailItem label="Category" value={ categoryName } />
                            <DetailItem label="Description" value={ product.description?.trim() || 'No description provided.' } />
                            <DetailItem label="List price" value={ formatPrice( product ) } />
                            <DetailItem label="Tax group" value={ product.taxGroupId || '—' } />
                        </dl>
                    </CardContent>
                </Card>

                <div className="grid content-start gap-4">
                    <Card>
                        <CardContent className="p-5 sm:p-6">
                            <div className="mb-4 flex items-center gap-2">
                                <Package size={ 17 } className="text-(--accent)" aria-hidden="true" />
                                <h2 className="font-display text-xl font-light">Inventory tracking</h2>
                            </div>
                            { tracking.length ? (
                                <div className="flex flex-wrap gap-2">
                                    { tracking.map( label => <span key={ label } className="rounded-full bg-(--paper-2) px-2.5 py-1 text-xs text-(--ink-soft)">{ label }</span> ) }
                                </div>
                            ) : <p className="text-sm text-(--muted)">No additional tracking enabled.</p> }
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-5 sm:p-6">
                            <div className="mb-3 flex items-center gap-2">
                                <Tag size={ 16 } className="text-(--accent)" aria-hidden="true" />
                                <h2 className="font-display text-xl font-light">Record information</h2>
                            </div>
                            <dl>
                                <DetailItem label="Product ID" value={ product.id } />
                                <DetailItem label="Organization ID" value={ product.organizationId } />
                                <DetailItem label="Created" value={ <RecordDate value={ product.createdAt } /> } />
                                <DetailItem label="Last updated" value={ <RecordDate value={ product.updatedAt } /> } />
                            </dl>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <ProductVariantsTable productId={ product.id } />
            <div className="mt-4 flex items-center gap-2 text-xs text-(--muted)">
                <CalendarClock size={ 14 } aria-hidden="true" />Record dates are shown in your local time.
            </div>
        </>
    )
}

export const ProductDetailPage = ( { productId }: ProductDetailPageProps ) => {
    const productQuery = useProduct( productId )
    const status = getErrorStatus( productQuery.error )

    return (
        <DashboardShell>
            <div className="w-full">
                { productQuery.isPending ? (
                    <div className="flex min-h-64 items-center justify-center gap-2 text-sm text-(--muted)" aria-live="polite">
                        <Spinner className="size-4 text-(--accent)" aria-label="Loading product" />
                        <span>Loading product…</span>
                    </div>
                ) : productQuery.isError ? (
                    <div className="mx-auto max-w-xl py-12 text-center">
                        <h1 className="font-display text-3xl font-light">{ status === 404 ? 'Product not found' : 'Could not load product' }</h1>
                        <p className="mt-2 text-sm text-(--muted)">{ status === 404 ? 'This product may have been removed or may no longer be available in this workspace.' : getErrorMessage( productQuery.error ) }</p>
                        <div className="mt-5 flex justify-center gap-2">
                            { status !== 404 ? <Button type="button" variant="pill-ghost" className="border border-(--rule)" onClick={ () => { void productQuery.refetch() } }>Retry</Button> : null }
                            <Button asChild variant="pill-ghost" className="bg-(--ink) text-(--paper) hover:bg-(--accent)">
                                <Link to="/inventory"><ArrowLeft size={ 15 } aria-hidden="true" />Back to products</Link>
                            </Button>
                        </div>
                    </div>
                ) : productQuery.data ? <ProductDetails product={ productQuery.data } /> : null }
            </div>
        </DashboardShell>
    )
}
