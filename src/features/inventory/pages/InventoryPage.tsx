import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { toast } from 'sonner'
import { PackagePlus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DashboardShell } from '@/src/features/dashboard/components/DashboardShell'
import { useProducts } from '@/src/features/inventory/api/products'
import type { ProductResponse } from '@/src/features/inventory/types/products'

const inputClass = 'h-10 rounded-[10px] border-(--rule) bg-(--card) text-sm placeholder:text-(--muted-2) focus-visible:border-(--ink) focus-visible:ring-(--ink)/10'

function formatPrice ( product: ProductResponse ) {
    const amount = Number( product.listPrice )
    const currency = product.priceCurrency?.trim()

    if ( !currency ) return amount.toLocaleString( undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 } )

    try {
        return new Intl.NumberFormat( undefined, { style: 'currency', currency } ).format( amount )
    } catch {
        return `${ currency } ${ amount.toLocaleString( undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 } ) }`
    }
}

function getProductsErrorMessage ( error: unknown ) {
    if ( typeof error === 'object' && error !== null && 'response' in error ) {
        const response = error.response
        if ( typeof response === 'object' && response !== null && 'status' in response && response.status === 403 ) {
            return 'You do not have permission to view inventory products. Ask an administrator for inventory:read access.'
        }
        if ( typeof response === 'object' && response !== null && 'data' in response ) {
            const data = response.data
            if ( typeof data === 'object' && data !== null && 'message' in data && typeof data.message === 'string' ) {
                return data.message
            }
        }
    }
    return 'Products could not be loaded. Check your connection and try again.'
}

function getTrackingLabels ( product: ProductResponse ) {
    const labels = []
    if ( product.isLotTracked ) labels.push( 'Lots' )
    if ( product.isSerialized ) labels.push( 'Serial' )
    if ( product.hasExpiry ) labels.push( 'Expiry' )
    return labels
}

export const InventoryPage = () => {
    const [ search, setSearch ] = useState( '' )
    const [ debouncedSearch, setDebouncedSearch ] = useState( '' )
    const [ category, setCategory ] = useState( '' )
    const [ activeFilter, setActiveFilter ] = useState( 'true' )

    useEffect( () => {
        const timeout = window.setTimeout( () => setDebouncedSearch( search.trim() ), 300 )
        return () => window.clearTimeout( timeout )
    }, [ search ] )

    const { data: products, isPending, isError, error, refetch } = useProducts( {
        search: debouncedSearch || undefined,
        category: category.trim() || undefined,
        isActive: activeFilter === 'true',
    } )

    useEffect( () => {
        const toastId = 'inventory-products-fetch-error'

        if ( isError ) {
            toast.error( 'Could not load products', {
                id: toastId,
                description: getProductsErrorMessage( error ),
                action: {
                    label: 'Retry',
                    onClick: () => { void refetch() },
                },
            } )
        } else {
            toast.dismiss( toastId )
        }
    }, [ error, isError, refetch ] )

    const clearFilters = () => {
        setSearch( '' )
        setDebouncedSearch( '' )
        setCategory( '' )
        setActiveFilter( 'true' )
    }

    const filtered = Boolean( search.trim() || category.trim() || activeFilter !== 'true' )

    return (
        <DashboardShell>
            <div className="w-full">
                <div className="mb-7 flex items-end justify-between gap-6 border-b border-(--rule) pb-6 max-sm:block">
                    <div>
                        <p className="mb-3 font-mono text-[10px] tracking-[0.14em] text-(--muted) uppercase">Inventory</p>
                        <h1 className="font-display text-[clamp(36px,4vw,48px)] font-light leading-none tracking-[-0.03em]">Products</h1>
                        <p className="mt-2.5 text-[15px] text-(--ink-soft)">Manage the product records used across your inventory and sales workflows.</p>
                    </div>
                    <Button asChild variant="pill-ghost" size="sm" className="mt-[18px] inline-flex items-center gap-1.5 rounded-lg bg-(--ink) px-3 py-2 text-[13px] font-medium text-(--paper) transition-colors hover:bg-(--accent) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ink) sm:mt-0">
                        <Link to="/inventory/products/new"><PackagePlus size={16} aria-hidden="true" />Add product</Link>
                    </Button>
                </div>

                <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(220px,1fr)_minmax(180px,0.7fr)_180px]">
                    <label className="grid gap-1.5 text-xs font-medium text-(--ink-soft)">
                        Search products
                        <span className="relative">
                            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-(--muted)" aria-hidden="true" />
                            <Input value={ search } onChange={ event => setSearch( event.target.value ) } className={ `${ inputClass } pl-9` } placeholder="Search products" aria-label="Search products" />
                        </span>
                    </label>

                    <label className="grid gap-1.5 text-xs font-medium text-(--ink-soft)">
                        Category
                        <Input value={ category } onChange={ event => setCategory( event.target.value ) } className={ inputClass } placeholder="All categories" aria-label="Filter by category" />
                    </label>

                    <label className="grid gap-1.5 text-xs font-medium text-(--ink-soft)">
                        Status
                        <Select value={ activeFilter } onValueChange={ value => setActiveFilter( value ?? 'true' ) }>
                            <SelectTrigger className="h-10 rounded-[10px] border-(--rule) bg-(--card) text-sm" aria-label="Filter by product status">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">Active</SelectItem>
                                <SelectItem value="false">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </label>
                </div>

                <Card className="overflow-hidden">
                    <CardContent className="p-0">
                        { isError ? null : isPending ? (
                            <div className="p-8 text-center text-sm text-(--muted)" role="status" aria-live="polite">Loading products…</div>
                        ) : products?.length ? (
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead>SKU</TableHead>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead className="text-right">List price</TableHead>
                                        <TableHead>Tracking</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    { products.map( product => {
                                        const trackingLabels = getTrackingLabels( product )
                                        return (
                                            <TableRow key={ product.id }>
                                                <TableCell className="font-mono text-xs text-(--ink-soft)">{ product.sku }</TableCell>
                                                <TableCell>
                                                    <span className="block font-medium">{ product.name }</span>
                                                    { product.description ? <span className="mt-0.5 block max-w-[42ch] truncate text-xs text-(--muted)">{ product.description }</span> : null }
                                                </TableCell>
                                                <TableCell className="text-(--ink-soft)">{ product.category || '—' }</TableCell>
                                                <TableCell className="text-right font-medium">{ formatPrice( product ) }</TableCell>
                                                <TableCell>
                                                    { trackingLabels.length ? (
                                                        <div className="flex flex-wrap gap-1.5">
                                                            { trackingLabels.map( label => <span key={ label } className="rounded-full bg-(--paper-2) px-2 py-0.5 text-[11px] text-(--ink-soft)">{ label }</span> ) }
                                                        </div>
                                                    ) : <span className="text-(--muted)">None</span> }
                                                </TableCell>
                                                <TableCell>
                                                    <span className={ `inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${ product.isActive ? 'bg-(--moss-soft) text-(--moss)' : 'bg-(--paper-2) text-(--muted)' }` }>{ product.isActive ? 'Active' : 'Inactive' }</span>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    } ) }
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="px-5 py-14 text-center">
                                <div className="mx-auto mb-4 grid size-11 place-items-center rounded-xl bg-(--paper-2) text-(--ink)">
                                    <PackagePlus size={20} aria-hidden="true" />
                                </div>
                                <h2 className="font-display text-2xl">{ filtered ? 'No products match these filters' : 'No products yet' }</h2>
                                <p className="mx-auto mt-2 max-w-md text-sm text-(--muted)">{ filtered ? 'Try a different search or clear the filters to see more products.' : 'Add your first product to start building the inventory catalog.' }</p>
                                { filtered ? (
                                    <Button type="button" variant="pill-ghost" className="mt-5 border border-(--rule)" onClick={ clearFilters }>Clear filters</Button>
                                ) : (
                                    <Button asChild variant="pill-ghost" className="mt-5 bg-(--ink) text-(--paper) hover:bg-(--accent)">
                                        <Link to="/inventory/products/new"><PackagePlus size={16} aria-hidden="true" />Add product</Link>
                                    </Button>
                                ) }
                            </div>
                        ) }
                    </CardContent>
                </Card>
            </div>
        </DashboardShell>
    )
}
