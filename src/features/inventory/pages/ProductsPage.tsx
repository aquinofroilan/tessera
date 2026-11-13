import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { toast } from 'sonner'
import { PackagePlus, Pencil, Search } from '@/components/ui/hugeicons'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DashboardShell } from '@/src/features/dashboard/components/DashboardShell'
import { useProductCategories } from '@/src/features/inventory/api/productCategories'
import { useProducts } from '@/src/features/inventory/api/products'
import type { ProductCatalogPageProps } from '@/src/features/inventory/types/inventory'
import type { ProductResponse } from '@/src/features/inventory/types/products'
import { formatPrice } from '@/src/features/inventory/utils/formatPrice'
import { toastApiError } from '@/src/lib/api-error'

const inputClass = 'h-10 rounded-[10px] border-(--rule) bg-(--card) text-sm placeholder:text-(--muted-2) focus-visible:border-(--ink) focus-visible:ring-(--ink)/10'

function getTrackingLabels ( product: ProductResponse ) {
    const labels = []
    if ( product.isLotTracked ) labels.push( 'Lots' )
    if ( product.isSerialized ) labels.push( 'Serial' )
    if ( product.hasExpiry ) labels.push( 'Expiry' )
    return labels
}

export const ProductsPage = ( { searchParams, updateSearchParams, clearSearchParams }: ProductCatalogPageProps ) => {
    const { search = '', categoryId = '', activeFilter = 'true' } = searchParams
    const [ searchInput, setSearchInput ] = useState( search )
    const searchNavigationTimer = useRef<number | null>( null )

    useEffect( () => {
        setSearchInput( search )
    }, [ search ] )

    useEffect( () => () => {
        if ( searchNavigationTimer.current !== null ) window.clearTimeout( searchNavigationTimer.current )
    }, [] )

    const handleSearchChange = ( value: string ) => {
        setSearchInput( value )
        if ( searchNavigationTimer.current !== null ) window.clearTimeout( searchNavigationTimer.current )
        searchNavigationTimer.current = window.setTimeout( () => {
            updateSearchParams( { search: value || undefined } )
        }, 300 )
    }

    const categoriesQuery = useProductCategories( { activeOnly: false } )
    const { data: products, isPending, isError, error, refetch } = useProducts( {
        search: search.trim() || undefined,
        categoryId: categoryId || undefined,
        isActive: activeFilter === 'true',
    } )

    useEffect( () => {
        const toastId = 'inventory-products-fetch-error'

        if ( isError ) {
            toastApiError( error, 'Products could not be loaded. Check your connection and try again.', { 403: 'You do not have permission to view inventory products. Ask an administrator for inventory:read access.' }, {
                id: toastId,
                action: { label: 'Retry', onClick: () => { void refetch() } },
            } )
        } else {
            toast.dismiss( toastId )
        }
    }, [ error, isError, refetch ] )

    useEffect( () => {
        const toastId = 'inventory-product-categories-fetch-error'

        if ( categoriesQuery.isError ) {
            toastApiError( categoriesQuery.error, 'Category names and filters are unavailable. Check your connection and try again.', {}, {
                id: toastId,
                action: { label: 'Retry', onClick: () => { void categoriesQuery.refetch() } },
            } )
        } else {
            toast.dismiss( toastId )
        }
    }, [ categoriesQuery.isError, categoriesQuery.refetch ] )

    const clearFilters = () => {
        if ( searchNavigationTimer.current !== null ) window.clearTimeout( searchNavigationTimer.current )
        setSearchInput( '' )
        clearSearchParams()
    }

    const filtered = Boolean( search.trim() || categoryId || activeFilter !== 'true' )
    const categoryNames = new Map( ( categoriesQuery.data ?? [] ).map( category => [ category.id, category.name ] ) )

    const renderProductContent = () => {
        if ( isError ) return null

        if ( isPending ) {
            return (
                <div className="flex items-center justify-center gap-2 p-8 text-sm text-(--muted)" aria-live="polite">
                    <Spinner className="size-4 text-(--accent)" aria-label="Loading products" />
                    <span>Loading products…</span>
                </div>
            )
        }

        if ( products?.length ) {
            return (
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead>SKU</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">List price</TableHead>
                            <TableHead>Tracking</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-12 text-right"><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        { products.map( product => {
                            const trackingLabels = getTrackingLabels( product )
                            return (
                                <TableRow key={ product.id }>
                                    <TableCell className="font-mono text-xs text-(--ink-soft)">{ product.sku }</TableCell>
                                    <TableCell>
                                        <Link
                                            to="/inventory/item/$uuid"
                                            params={ { uuid: product.id } }
                                            aria-label={ `View product ${ product.name }` }
                                            className="block w-fit rounded-sm font-medium text-(--ink) underline decoration-transparent underline-offset-4 transition-colors hover:text-(--accent) hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ink)"
                                        >
                                            { product.name }
                                        </Link>
                                        { product.description ? <span className="mt-0.5 block max-w-[42ch] truncate text-xs text-(--muted)">{ product.description }</span> : null }
                                    </TableCell>
                                    <TableCell className="text-(--ink-soft)">{ product.categoryId ? categoryNames.get( product.categoryId ) ?? 'Category unavailable' : '—' }</TableCell>
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
                                    <TableCell className="text-right">
                                        <Button asChild type="button" variant="pill-ghost" size="icon" className="size-8 rounded-lg" aria-label={ `Open ${ product.name } product details` }>
                                            <Link to="/inventory/item/$uuid" params={ { uuid: product.id } } title={ `Open ${ product.name } product details` }>
                                                <Pencil size={ 15 } aria-hidden="true" />
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )
                        } ) }
                    </TableBody>
                </Table>
            )
        }

        return (
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
        )
    }

    return (
        <DashboardShell>
            <div className="w-full">
                <div className="mb-7 flex items-end justify-between gap-6 border-b border-(--rule) pb-6 max-sm:block">
                    <div>
                        <h1 className="font-display text-[clamp(36px,4vw,48px)] font-light leading-none tracking-[-0.03em]">Products</h1>
                        <p className="mt-2.5 text-[15px] text-(--ink-soft)">Manage the product records used across your inventory and sales workflows.</p>
                    </div>
                    <Button asChild variant="pill-ghost" size="sm" className="mt-[18px] inline-flex items-center gap-1.5 rounded-lg bg-(--ink) px-3 py-2 text-[13px] font-medium text-(--paper) transition-colors hover:bg-(--accent) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ink) sm:mt-0">
                        <Link to="/inventory/products/new"><PackagePlus size={16} aria-hidden="true" />Add product</Link>
                    </Button>
                </div>

                <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(220px,1fr)_minmax(180px,0.7fr)_180px]">
                    <div className="grid gap-1.5">
                        <label htmlFor="inventory-product-search" className="text-xs font-medium text-(--ink-soft)">Search products</label>
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-(--muted)" aria-hidden="true" />
                            <Input id="inventory-product-search" value={ searchInput } onChange={ event => handleSearchChange( event.target.value ) } className={ `${ inputClass } pl-9` } placeholder="Search products" />
                        </div>
                    </div>

                    <div className="grid gap-1.5">
                        <label htmlFor="inventory-category-filter" className="text-xs font-medium text-(--ink-soft)">Category</label>
                        <Select value={ categoryId || '__all__' } onValueChange={ value => updateSearchParams( { categoryId: !value || value === '__all__' ? undefined : value } ) } disabled={ categoriesQuery.isPending || categoriesQuery.isError }>
                            <SelectTrigger id="inventory-category-filter" className="h-10 rounded-[10px] border-(--rule) bg-(--card) text-sm">
                                <SelectValue placeholder={ categoriesQuery.isPending ? 'Loading categories…' : 'All categories' } />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="__all__">All categories</SelectItem>
                                { categoriesQuery.data?.map( category => <SelectItem key={ category.id } value={ category.id }>{ category.name }{ category.isActive ? '' : ' (Inactive)' }</SelectItem> ) }
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-1.5">
                        <label htmlFor="inventory-status-filter" className="text-xs font-medium text-(--ink-soft)">Status</label>
                        <Select value={ activeFilter } onValueChange={ value => updateSearchParams( { activeFilter: value === 'false' ? 'false' : 'true' } ) }>
                            <SelectTrigger id="inventory-status-filter" className="h-10 rounded-[10px] border-(--rule) bg-(--card) text-sm">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">Active</SelectItem>
                                <SelectItem value="false">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Card className="overflow-hidden">
                    <CardContent className="p-0">
                        { renderProductContent() }
                    </CardContent>
                </Card>
            </div>
        </DashboardShell>
    )
}
