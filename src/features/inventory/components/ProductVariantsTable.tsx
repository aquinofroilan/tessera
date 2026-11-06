import { Link } from '@tanstack/react-router'
import { Spinner } from '@/components/ui/spinner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ProductVariantCreateSheet } from '@/src/features/inventory/components/ProductVariantCreateSheet'
import { useProductVariants } from '@/src/features/inventory/api/productVariants'

function getErrorMessage ( error: unknown ) {
    if ( typeof error === 'object' && error !== null && 'response' in error ) {
        const response = error.response
        if ( typeof response === 'object' && response !== null && 'status' in response && response.status === 403 ) {
            return 'You do not have permission to view product variants. Ask an administrator for inventory:read access.'
        }
        if ( typeof response === 'object' && response !== null && 'data' in response ) {
            const data = response.data
            if ( typeof data === 'object' && data !== null && 'message' in data && typeof data.message === 'string' ) {
                return data.message
            }
        }
    }
    return 'Product variants could not be loaded. Check your connection and try again.'
}

export function ProductVariantsTable ( { productId }: { productId: string } ) {
    const variantsQuery = useProductVariants( productId )

    return (
        <section aria-labelledby="product-variants-heading" className="mt-4 overflow-hidden rounded-2xl border border-(--rule) bg-(--paper)">
            <div className="flex items-end justify-between gap-4 border-b border-(--rule) px-5 py-4 sm:px-6">
                <div className="flex w-full min-w-0 items-center justify-between gap-2">
                    <h2 id="product-variants-heading" className="font-display text-xl font-light">Variants</h2>
                    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                        <ProductVariantCreateSheet productId={ productId } />
                        { variantsQuery.data ? <span className="whitespace-nowrap font-mono text-xs text-(--muted)">{ variantsQuery.data.length } total</span> : null }
                    </div>
                </div>
            </div>

            { variantsQuery.isPending ? (
                <div className="flex items-center justify-center gap-2 p-8 text-sm text-(--muted)" aria-live="polite">
                    <Spinner className="size-4 text-(--accent)" aria-label="Loading variants" />
                    <span>Loading variants…</span>
                </div>
            ) : variantsQuery.isError ? (
                <div className="flex flex-col items-start gap-3 p-5 sm:p-6" role="alert">
                    <p className="text-sm text-(--accent-deep)">{ getErrorMessage( variantsQuery.error ) }</p>
                    <button type="button" onClick={ () => { void variantsQuery.refetch() } } className="rounded-sm text-sm font-medium text-(--ink) underline underline-offset-4 hover:text-(--accent) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ink)">Retry</button>
                </div>
            ) : variantsQuery.data?.length ? (
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead>Code</TableHead>
                            <TableHead>Variant</TableHead>
                            <TableHead>SKU suffix</TableHead>
                            <TableHead>Attributes</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        { variantsQuery.data.map( variant => {
                            const attributes = Object.entries( variant.attributes ?? {} )
                            return (
                                <TableRow key={ variant.id }>
                                    <TableCell className="font-mono text-xs text-(--ink-soft)">{ variant.code }</TableCell>
                                    <TableCell className="font-medium">
                                        <Link
                                            to="/inventory/item/$uuid/variant/$variantUuid"
                                            params={ { uuid: productId, variantUuid: variant.id } }
                                            aria-label={ `View ${ variant.name } variant details` }
                                            className="rounded-sm text-(--ink) underline decoration-transparent underline-offset-4 transition-colors hover:text-(--accent) hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ink)"
                                        >
                                            { variant.name }
                                        </Link>
                                    </TableCell>
                                    <TableCell className="font-mono text-xs text-(--ink-soft)">{ variant.skuSuffix || '—' }</TableCell>
                                    <TableCell>
                                        { attributes.length ? (
                                            <div className="flex flex-wrap gap-1.5">
                                                { attributes.map( ( [ key, value ] ) => <span key={ key } className="rounded-full bg-(--paper-2) px-2 py-0.5 text-[11px] text-(--ink-soft)">{ key }: { value }</span> ) }
                                            </div>
                                        ) : <span className="text-(--muted)">—</span> }
                                    </TableCell>
                                    <TableCell>
                                        <span className={ `inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${ variant.isActive ? 'bg-(--moss-soft) text-(--moss)' : 'bg-(--paper-2) text-(--muted)' }` }>{ variant.isActive ? 'Active' : 'Inactive' }</span>
                                    </TableCell>
                                </TableRow>
                            )
                        } ) }
                    </TableBody>
                </Table>
            ) : (
                <div className="p-6 text-sm text-(--muted)">No variants have been created for this product yet.</div>
            ) }
        </section>
    )
}
