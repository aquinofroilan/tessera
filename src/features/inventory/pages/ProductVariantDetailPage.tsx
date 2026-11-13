import { formatDistanceToNow } from 'date-fns'
import type { ReactNode } from 'react'
import { Tag } from '@/components/ui/hugeicons'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { DashboardShell } from '@/src/features/dashboard/components/DashboardShell'
import { ProductVariantEditSheet } from '@/src/features/inventory/components/ProductVariantEditSheet'
import { ProductVariantDeactivateDialog } from '@/src/features/inventory/components/ProductVariantDeactivateDialog'
import { useProductVariant } from '@/src/features/inventory/api/productVariants'
import { useProduct } from '@/src/features/inventory/api/products'
import type { ProductVariantResponse } from '@/src/features/inventory/types/productVariants'
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
    let content: ReactNode = null

    if ( variantQuery.isPending ) {
        content = (
            <div className="flex min-h-64 items-center justify-center gap-2 text-sm text-(--muted)" aria-live="polite">
                <Spinner className="size-4 text-(--accent)" aria-label="Loading variant" />
                <span>Loading variant…</span>
            </div>
        )
    } else if ( variantQuery.isError ) {
        content = <VariantErrorState status={ status } error={ variantQuery.error } onRetry={ () => { void variantQuery.refetch() } } />
    } else if ( variantQuery.data ) {
        content = <VariantDetails productId={ productId } variant={ variantQuery.data } productName={ productName } productUnavailable={ productQuery.isError } />
    }

    return (
        <DashboardShell>
            <div className="w-full">
                { content }
            </div>
        </DashboardShell>
    )
}

type VariantErrorStateProps = Readonly<{
    status: number | undefined
    error: unknown
    onRetry: () => void
}>

function VariantErrorState ( { status, error, onRetry }: VariantErrorStateProps ) {
    const isNotFound = status === 404
    let title = 'Could not load variant'
    let description = getApiErrorMessage( error, 'Variant details could not be loaded. Check your connection and try again.' )

    if ( isNotFound ) {
        title = 'Variant not found'
        description = 'This variant may have been removed or may no longer be available.'
    }

    return (
        <div className="mx-auto max-w-xl py-12 text-center">
            <h1 className="font-display text-3xl font-light">{ title }</h1>
            <p className="mt-2 text-sm text-(--muted)">{ description }</p>
            { !isNotFound ? (
                <div className="mt-5 flex justify-center gap-2">
                    <Button type="button" variant="pill-ghost" className="border border-(--rule)" onClick={ onRetry }>Retry</Button>
                </div>
            ) : null }
        </div>
    )
}

type VariantDetailsProps = Readonly<{
    productId: string
    variant: ProductVariantResponse
    productName: string
    productUnavailable: boolean
}>

function VariantDetails ( { productId, variant, productName, productUnavailable }: VariantDetailsProps ) {
    let statusClassName = 'bg-(--paper-2) text-(--muted)'
    let statusLabel = 'Inactive'
    let productDetail = productName

    if ( variant.isActive ) {
        statusClassName = 'bg-(--moss-soft) text-(--moss)'
        statusLabel = 'Active'
    }

    if ( productUnavailable ) {
        productDetail = 'Product details unavailable'
    }

    return (
        <>
            <div className="mb-7 flex items-end justify-between gap-5 border-b border-(--rule) pb-6 max-sm:block">
                <div className="min-w-0">
                    <p className="font-mono text-sm text-(--ink-soft)">{ variant.code }</p>
                    <h1 className="mt-1 break-words font-display text-[clamp(34px,4vw,48px)] font-light leading-tight tracking-[-0.03em]">{ variant.name }</h1>
                </div>
                <div className="mt-5 flex shrink-0 items-center gap-2 sm:mt-0">
                    <ProductVariantEditSheet productId={ productId } variant={ variant } />
                    { variant.isActive && <ProductVariantDeactivateDialog productId={ productId } variantId={ variant.id } variantName={ variant.name } /> }
                    <span className={ `inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${ statusClassName }` }>{ statusLabel }</span>
                </div>
            </div>

            <Card>
                <CardContent className="p-5 sm:p-6">
                    <div className="mb-4 flex items-center gap-2">
                        <Tag size={ 16 } className="text-(--accent)" aria-hidden="true" />
                        <h2 className="font-display text-xl font-light">Variant details</h2>
                    </div>
                    <dl>
                        <DetailItem label="Code" value={ variant.code } />
                        <DetailItem label="Name" value={ variant.name } />
                        <DetailItem label="SKU suffix" value={ variant.skuSuffix || '—' } />
                        <DetailItem label="Attributes" value={ Object.entries( variant.attributes ?? {} ).map( ( [ key, value ] ) => `${ key }: ${ formatVariantAttribute( value ) }` ).join( ', ' ) || '—' } />
                        <DetailItem label="Variant ID" value={ variant.id } />
                        <DetailItem label="Organization ID" value={ variant.organizationId } />
                        <DetailItem label="Product" value={ productDetail } />
                        <DetailItem label="Created" value={ formatRecordDate( variant.createdAt ) } />
                        <DetailItem label="Last updated" value={ formatRecordDate( variant.updatedAt ) } />
                    </dl>
                </CardContent>
            </Card>
        </>
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
