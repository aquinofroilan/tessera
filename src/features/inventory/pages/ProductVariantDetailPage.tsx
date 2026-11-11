import { Link } from '@tanstack/react-router'
import { formatDistanceToNow } from 'date-fns'
import type { ReactNode } from 'react'
import { ArrowLeft, Tag } from '@/components/ui/hugeicons'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { DashboardShell } from '@/src/features/dashboard/components/DashboardShell'
import { ProductVariantEditSheet } from '@/src/features/inventory/components/ProductVariantEditSheet'
import { ProductVariantDeactivateDialog } from '@/src/features/inventory/components/ProductVariantDeactivateDialog'
import { useProductVariant } from '@/src/features/inventory/api/productVariants'
import { useProduct } from '@/src/features/inventory/api/products'
import { formatVariantAttribute } from '@/src/features/inventory/utils/formatVariantAttribute'
import { getApiErrorMessage, getApiErrorStatus } from '@/src/lib/api-error'

type ProductVariantDetailPageProps = Readonly<{
    productId: string
    variantId: string
}>

export function ProductVariantDetailPage ( { productId, variantId }: ProductVariantDetailPageProps ) {
    const variantQuery = useProductVariant( productId, variantId )
    const productQuery = useProduct( productId )
    const status = getApiErrorStatus( variantQuery.error )
    const productName = productQuery.data?.name ?? 'Product'
    let variantContent: ReactNode = null

    if ( variantQuery.isPending ) {
        variantContent = (
            <div className="flex min-h-64 items-center justify-center gap-2 text-sm text-(--muted)" aria-live="polite">
                <Spinner className="size-4 text-(--accent)" aria-label="Loading variant" />
                <span>Loading variant…</span>
            </div>
        )
    } else if ( variantQuery.isError ) {
        variantContent = (
            <div className="mx-auto max-w-xl py-12 text-center">
                <h1 className="font-display text-3xl font-light">{ status === 404 ? 'Variant not found' : 'Could not load variant' }</h1>
                <p className="mt-2 text-sm text-(--muted)">{ status === 404 ? 'This variant may have been removed or may no longer be available.' : getApiErrorMessage( variantQuery.error, 'Variant details could not be loaded. Check your connection and try again.' ) }</p>
                <div className="mt-5 flex justify-center gap-2">
                    { status !== 404 ? <Button type="button" variant="pill-ghost" className="border border-(--rule)" onClick={ () => { void variantQuery.refetch() } }>Retry</Button> : null }
                    <Button asChild variant="pill-ghost" className="bg-(--ink) text-(--paper) hover:bg-(--accent)">
                        <Link to="/inventory/item/$uuid" params={ { uuid: productId } }><ArrowLeft size={ 15 } aria-hidden="true" />Back to product</Link>
                    </Button>
                </div>
            </div>
        )
    } else if ( variantQuery.data ) {
        variantContent = (
            <>
                <div className="mb-7 flex items-end justify-between gap-5 border-b border-(--rule) pb-6 max-sm:block">
                    <div className="min-w-0">
                        <Button asChild variant="pill-ghost" size="sm" className="mb-4 -ml-2 text-(--ink-soft) hover:bg-(--paper-2)">
                            <Link to="/inventory/item/$uuid" params={ { uuid: productId } }><ArrowLeft size={ 15 } aria-hidden="true" />{ productName }</Link>
                        </Button>
                        <p className="font-mono text-sm text-(--ink-soft)">{ variantQuery.data.code }</p>
                        <h1 className="mt-1 break-words font-display text-[clamp(34px,4vw,48px)] font-light leading-tight tracking-[-0.03em]">{ variantQuery.data.name }</h1>
                    </div>
                    <div className="mt-5 flex shrink-0 items-center gap-2 sm:mt-0">
                        <ProductVariantEditSheet productId={ productId } variant={ variantQuery.data } />
                        { variantQuery.data.isActive ? <ProductVariantDeactivateDialog productId={ productId } variantId={ variantId } variantName={ variantQuery.data.name } /> : null }
                        <span className={ `inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${ variantQuery.data.isActive ? 'bg-(--moss-soft) text-(--moss)' : 'bg-(--paper-2) text-(--muted)' }` }>{ variantQuery.data.isActive ? 'Active' : 'Inactive' }</span>
                    </div>
                </div>

                <Card>
                    <CardContent className="p-5 sm:p-6">
                        <div className="mb-4 flex items-center gap-2">
                            <Tag size={ 16 } className="text-(--accent)" aria-hidden="true" />
                            <h2 className="font-display text-xl font-light">Variant details</h2>
                        </div>
                        <dl>
                            <DetailItem label="Code" value={ variantQuery.data.code } />
                            <DetailItem label="Name" value={ variantQuery.data.name } />
                            <DetailItem label="SKU suffix" value={ variantQuery.data.skuSuffix || '—' } />
                            <DetailItem label="Attributes" value={ Object.entries( variantQuery.data.attributes ?? {} ).map( ( [ key, value ] ) => `${ key }: ${ formatVariantAttribute( value ) }` ).join( ', ' ) || '—' } />
                            <DetailItem label="Variant ID" value={ variantQuery.data.id } />
                            <DetailItem label="Organization ID" value={ variantQuery.data.organizationId } />
                            <DetailItem label="Product" value={ productQuery.isError ? 'Product details unavailable' : productName } />
                            <DetailItem label="Created" value={ formatRecordDate( variantQuery.data.createdAt ) } />
                            <DetailItem label="Last updated" value={ formatRecordDate( variantQuery.data.updatedAt ) } />
                        </dl>
                    </CardContent>
                </Card>
            </>
        )
    }

    return (
        <DashboardShell>
            <div className="w-full">
                { variantContent }
            </div>
        </DashboardShell>
    )
}

function formatRecordDate ( value: string | null ): ReactNode {
    if ( !value ) return '—'
    const date = new Date( value )
    if ( Number.isNaN( date.getTime() ) ) return '—'

    return (
        <span className="grid gap-0.5">
            <time dateTime={ date.toISOString() } title={ date.toLocaleString() }>{ formatDistanceToNow( date, { addSuffix: true } ) }</time>
            <span className="text-xs text-(--muted)">{ date.toLocaleString() }</span>
        </span>
    )
}

function DetailItem ( { label, value }: Readonly<{ label: string, value: ReactNode }> ) {
    return (
        <div className="grid gap-1 border-b border-(--rule) py-3 last:border-b-0 sm:grid-cols-[150px_1fr] sm:gap-4">
            <dt className="text-xs font-medium text-(--muted)">{ label }</dt>
            <dd className="min-w-0 break-words text-sm text-(--ink)">{ value }</dd>
        </div>
    )
}
