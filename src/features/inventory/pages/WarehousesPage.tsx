import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Plus, Search } from '@/components/ui/hugeicons'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DashboardShell } from '@/src/features/dashboard/components/DashboardShell'
import { useWarehouses } from '@/src/features/inventory/api/warehouses'
import type { WarehouseListPageProps, WarehouseResponse } from '@/src/features/inventory/types/warehouses'
import { toastApiError } from '@/src/lib/api-error'

const inputClass = 'h-10 rounded-[10px] border-(--rule) bg-(--card) text-sm placeholder:text-(--muted-2) focus-visible:border-(--ink) focus-visible:ring-(--ink)/10'

function getWarehouseAddress ( warehouse: WarehouseResponse ) {
    return [ warehouse.addressLine, warehouse.city, warehouse.country ].filter( Boolean ).join( ', ' ) || '—'
}

export function WarehousesPage ( { searchParams, updateSearchParams, clearSearchParams }: WarehouseListPageProps ) {
    const { search = '', activeFilter = 'true' } = searchParams
    const [ searchInput, setSearchInput ] = useState( search )
    const searchTimer = useRef<number | null>( null )
    const warehousesQuery = useWarehouses( { search: search.trim() || undefined, isActive: activeFilter === 'true' } )

    useEffect( () => {
        setSearchInput( search )
    }, [ search ] )

    useEffect( () => () => {
        if ( searchTimer.current !== null ) window.clearTimeout( searchTimer.current )
    }, [] )

    useEffect( () => {
        const toastId = 'inventory-warehouses-fetch-error'

        if ( warehousesQuery.isError ) {
            toastApiError( warehousesQuery.error, 'Warehouses could not be loaded. Check your connection and try again.', { 403: 'You do not have permission to view warehouses. Ask an administrator for inventory:read access.' }, {
                id: toastId,
                action: { label: 'Retry', onClick: () => { void warehousesQuery.refetch() } },
            } )
        } else {
            toast.dismiss( toastId )
        }
    }, [ warehousesQuery.error, warehousesQuery.isError, warehousesQuery.refetch ] )

    const handleSearchChange = ( value: string ) => {
        setSearchInput( value )
        if ( searchTimer.current !== null ) window.clearTimeout( searchTimer.current )
        searchTimer.current = window.setTimeout( () => updateSearchParams( { search: value || undefined } ), 300 )
    }

    const clearFilters = () => {
        if ( searchTimer.current !== null ) window.clearTimeout( searchTimer.current )
        setSearchInput( '' )
        clearSearchParams()
    }

    const filtered = Boolean( search.trim() || activeFilter !== 'true' )
    const warehouses = [ ...( warehousesQuery.data ?? [] ) ].sort( ( first, second ) => first.name.localeCompare( second.name ) )

    const renderWarehouseContent = () => {
        if ( warehousesQuery.isPending ) {
            return (
                <div className="flex items-center justify-center gap-2 p-8 text-sm text-(--muted)" aria-live="polite">
                    <Spinner className="size-4 text-(--accent)" aria-label="Loading warehouses" />
                    <span>Loading warehouses…</span>
                </div>
            )
        }

        if ( warehousesQuery.isError && !warehousesQuery.data ) {
            return <div className="p-8 text-center text-sm text-(--muted)">Warehouse data is unavailable. Use the retry action in the notification to try again.</div>
        }

        if ( warehouses.length ) {
            return (
                <div className="w-full overflow-x-auto">
                    <Table className="min-w-[760px]">
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead>Warehouse</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Negative stock</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            { warehouses.map( warehouse => (
                                <TableRow key={ warehouse.id }>
                                    <TableCell>
                                        <Link to="/inventory/warehouses/$warehouseId" params={ { warehouseId: warehouse.id } } className="block w-fit font-medium text-(--ink) underline decoration-transparent underline-offset-4 hover:text-(--accent) hover:decoration-current focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ink)">
                                            { warehouse.name }
                                        </Link>
                                        <span className="mt-0.5 block font-mono text-xs text-(--muted)">{ warehouse.code }</span>
                                    </TableCell>
                                    <TableCell className="max-w-[42ch] truncate text-(--ink-soft)">{ getWarehouseAddress( warehouse ) }</TableCell>
                                    <TableCell className="text-(--ink-soft)">{ warehouse.allowNegativeStock ? 'Allowed' : 'Blocked' }</TableCell>
                                    <TableCell>
                                        <span className={ `inline-flex whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium ${ warehouse.isActive ? 'bg-(--moss-soft) text-(--moss)' : 'bg-(--paper-2) text-(--muted)' }` }>{ warehouse.isActive ? 'Active' : 'Inactive' }</span>
                                    </TableCell>
                                </TableRow>
                            ) ) }
                        </TableBody>
                    </Table>
                </div>
            )
        }

        return (
            <div className="px-5 py-14 text-center">
                <h2 className="font-display text-2xl">{ filtered ? 'No warehouses match these filters' : 'No warehouses yet' }</h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-(--muted)">{ filtered ? 'Try a different search or switch the status filter.' : 'Add a warehouse to start organizing storage locations.' }</p>
                { filtered ? (
                    <Button type="button" variant="pill-ghost" className="mt-5 border border-(--rule)" onClick={ clearFilters }>Clear filters</Button>
                ) : (
                    <Button asChild variant="pill-ghost" className="mt-5 bg-(--ink) text-(--paper) hover:bg-(--accent)">
                        <Link to="/inventory/warehouses/new"><Plus size={ 15 } aria-hidden="true" />Add warehouse</Link>
                    </Button>
                ) }
            </div>
        )
    }

    return (
        <DashboardShell>
            <div className="w-full">
                <header className="mb-7 flex items-end justify-between gap-6 border-b border-(--rule) pb-6 max-sm:block">
                    <div>
                        <h1 className="font-display text-[clamp(36px,4vw,48px)] font-light leading-none tracking-[-0.03em]">Warehouses</h1>
                        <p className="mt-2.5 text-[15px] text-(--ink-soft)">Manage storage facilities and their inventory locations.</p>
                    </div>
                    <Button asChild variant="pill-ghost" size="sm" className="mt-5 bg-(--ink) text-(--paper) hover:bg-(--accent) sm:mt-0">
                        <Link to="/inventory/warehouses/new"><Plus size={ 15 } aria-hidden="true" />Add warehouse</Link>
                    </Button>
                </header>

                <div className="mb-5 grid gap-3 sm:grid-cols-[minmax(220px,1fr)_180px]">
                    <div className="grid gap-1.5">
                        <label htmlFor="inventory-warehouse-search" className="text-xs font-medium text-(--ink-soft)">Search warehouses</label>
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-(--muted)" aria-hidden="true" />
                            <Input id="inventory-warehouse-search" value={ searchInput } onChange={ event => handleSearchChange( event.target.value ) } className={ `${ inputClass } pl-9` } placeholder="Search code or name" />
                        </div>
                    </div>
                    <div className="grid gap-1.5">
                        <label htmlFor="inventory-warehouse-status" className="text-xs font-medium text-(--ink-soft)">Status</label>
                        <Select value={ activeFilter } onValueChange={ value => updateSearchParams( { activeFilter: value === 'false' ? 'false' : 'true' } ) }>
                            <SelectTrigger id="inventory-warehouse-status" className={ inputClass }><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">Active</SelectItem>
                                <SelectItem value="false">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Card className="overflow-hidden">
                    <CardContent className="p-0">{ renderWarehouseContent() }</CardContent>
                </Card>
            </div>
        </DashboardShell>
    )
}
