import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { ArrowLeft, Plus, Search } from '@/components/ui/hugeicons'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Spinner } from '@/components/ui/spinner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DashboardShell } from '@/src/features/dashboard/components/DashboardShell'
import { useProducts } from '@/src/features/inventory/api/products'
import { useCreateStockMovement, useLotGenealogy, usePickingSuggestions, useReverseStockMovement, useStockLotBalances, useStockMovements, useStockOnHand } from '@/src/features/inventory/api/stockMovements'
import { useWarehouseLocations, useWarehouses } from '@/src/features/inventory/api/warehouses'
import type { StockMovementListParams, StockMovementResponse, StockMovementType } from '@/src/features/inventory/types/stockMovements'
import { stockMovementTypes } from '@/src/features/inventory/types/stockMovements'
import { getApiErrorMessage, toastApiError } from '@/src/lib/api-error'

const inputClass = 'h-10 rounded-[10px] border-(--rule) bg-(--card) text-sm'
const typeLabel = ( type: StockMovementType ) => type.replaceAll( '_', ' ' ).toLowerCase().replace( /^\w/, value => value.toUpperCase() )

export function StockMovementsPage () {
    const productsQuery = useProducts()
    const warehousesQuery = useWarehouses()
    const [ filters, setFilters ] = useState<StockMovementListParams>( {} )
    const [ selectedMovement, setSelectedMovement ] = useState<StockMovementResponse | null>( null )
    const movementsQuery = useStockMovements( filters )
    const reverseMutation = useReverseStockMovement()

    const products = useMemo( () => productsQuery.data ?? [], [ productsQuery.data ] )
    const warehouses = useMemo( () => warehousesQuery.data ?? [], [ warehousesQuery.data ] )
    const typeOptions = stockMovementTypes

    const reverse = () => {
        if ( !selectedMovement ) return
        reverseMutation.mutate( selectedMovement.id, {
            onSuccess: reversal => {
                toast.success( 'Movement reversed', { description: `Reversal movement ${ reversal.id } was added to the ledger.` } )
                setSelectedMovement( null )
            },
            onError: error => toastApiError( error, 'The movement could not be reversed. Check your connection and try again.', { 403: 'You do not have permission to reverse stock movements. Ask an administrator for inventory:write access.' } ),
        } )
    }

    return (
        <DashboardShell>
            <div className="w-full">
                <div className="mb-7 flex items-end justify-between gap-5 border-b border-(--rule) pb-6 max-sm:block">
                    <div>
                        <p className="mb-2 font-mono text-[10px] tracking-[0.14em] text-(--muted) uppercase">Inventory / Stock</p>
                        <h1 className="font-display text-[clamp(34px,4vw,48px)] font-light leading-tight tracking-[-.035em]">Stock movements</h1>
                        <p className="mt-2 max-w-2xl text-sm text-(--ink-soft)">Review the immutable movement ledger and record inventory changes.</p>
                    </div>
                    <CreateMovementSheet />
                </div>

                <StockAvailabilityPanel />

                <Card>
                    <CardHeader>
                        <CardTitle>Movement ledger</CardTitle>
                        <CardDescription>Filter movements by product, warehouse, type, date range, or lot.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
                            <Field>
                                <FieldLabel htmlFor="movement-product-filter">Product</FieldLabel>
                                <Select value={ filters.productId || '__all__' } onValueChange={ value => setFilters( previous => ( { ...previous, productId: value === '__all__' ? undefined : value } ) )}>
                                    <SelectTrigger id="movement-product-filter" className={ inputClass }><SelectValue placeholder="All products" /></SelectTrigger>
                                    <SelectContent><SelectItem value="__all__">All products</SelectItem>{ products.map( product => <SelectItem key={ product.id } value={ product.id }>{ product.sku } · { product.name }</SelectItem> ) }</SelectContent>
                                </Select>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="movement-warehouse-filter">Warehouse</FieldLabel>
                                <Select value={ filters.warehouseId || '__all__' } onValueChange={ value => setFilters( previous => ( { ...previous, warehouseId: value === '__all__' ? undefined : value } ) )}>
                                    <SelectTrigger id="movement-warehouse-filter" className={ inputClass }><SelectValue placeholder="All warehouses" /></SelectTrigger>
                                    <SelectContent><SelectItem value="__all__">All warehouses</SelectItem>{ warehouses.map( warehouse => <SelectItem key={ warehouse.id } value={ warehouse.id }>{ warehouse.name }</SelectItem> ) }</SelectContent>
                                </Select>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="movement-type-filter">Type</FieldLabel>
                                <Select value={ filters.type || '__all__' } onValueChange={ value => setFilters( previous => ( { ...previous, type: value === '__all__' ? undefined : value as StockMovementType } ) )}>
                                    <SelectTrigger id="movement-type-filter" className={ inputClass }><SelectValue placeholder="All types" /></SelectTrigger>
                                    <SelectContent><SelectItem value="__all__">All types</SelectItem>{ typeOptions.map( type => <SelectItem key={ type } value={ type }>{ typeLabel( type ) }</SelectItem> ) }</SelectContent>
                                </Select>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="movement-from-filter">From</FieldLabel>
                                <Input id="movement-from-filter" type="date" className={ inputClass } value={ filters.from ?? '' } onChange={ event => setFilters( previous => ( { ...previous, from: event.target.value || undefined } ) ) } />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="movement-to-filter">To</FieldLabel>
                                <Input id="movement-to-filter" type="date" className={ inputClass } value={ filters.to ?? '' } onChange={ event => setFilters( previous => ( { ...previous, to: event.target.value || undefined } ) ) } />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="movement-lot-filter">Lot number</FieldLabel>
                                <Input id="movement-lot-filter" className={ inputClass } value={ filters.lotNumber ?? '' } onChange={ event => setFilters( previous => ( { ...previous, lotNumber: event.target.value || undefined } ) ) } placeholder="All lots" />
                            </Field>
                        </div>

                        { movementsQuery.isPending ? (
                            <div className="flex items-center justify-center gap-2 p-8 text-sm text-(--muted)"><Spinner className="size-4 text-(--accent)" aria-label="Loading movements" />Loading movements…</div>
                        ) : movementsQuery.isError ? (
                            <div className="flex flex-col items-start gap-3 p-6" role="alert">
                                <p className="text-sm text-(--accent-deep)">{ getApiErrorMessage( movementsQuery.error, 'Stock movements could not be loaded. Check your connection and try again.', { 403: 'You do not have permission to view stock movements. Ask an administrator for inventory:read access.' } ) }</p>
                                <Button variant="pill-ghost" onClick={ () => { void movementsQuery.refetch() } }>Retry</Button>
                            </div>
                        ) : movementsQuery.data?.length ? (
                            <div className="overflow-x-auto">
                                <Table className="min-w-[1040px]">
                                    <TableHeader><TableRow><TableHead>Occurred</TableHead><TableHead>Type</TableHead><TableHead>Product</TableHead><TableHead>Warehouse</TableHead><TableHead>Quantity</TableHead><TableHead>Lot</TableHead><TableHead>Reference</TableHead><TableHead>Created by</TableHead><TableHead /></TableRow></TableHeader>
                                    <TableBody>{ movementsQuery.data.map( movement => (
                                        <TableRow key={ movement.id }>
                                            <TableCell>{ formatDate( movement.occurredAt ?? movement.createdAt ) }</TableCell>
                                            <TableCell>{ typeLabel( movement.type ) }</TableCell>
                                            <TableCell><span className="font-medium">{ movement.productName ?? movement.productId }</span>{ movement.productSku ? <span className="mt-0.5 block font-mono text-xs text-(--muted)">{ movement.productSku }</span> : null }</TableCell>
                                            <TableCell>{ movement.warehouseName ?? movement.warehouseId }</TableCell>
                                            <TableCell className="font-mono tabular-nums">{ movement.quantity }</TableCell>
                                            <TableCell>{ movement.lotNumber || '—' }</TableCell>
                                            <TableCell>{ movement.reference || '—' }</TableCell>
                                            <TableCell>{ movement.createdBy ?? '—' }</TableCell>
                                            <TableCell><Button type="button" size="sm" variant="pill-ghost" className="text-(--ink-soft)" onClick={ () => { setSelectedMovement( movement ); reverseMutation.reset() } }><ArrowLeft size={ 14 } aria-hidden="true" />Reverse</Button></TableCell>
                                        </TableRow>
                                    ) ) }</TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="px-5 py-14 text-center"><h2 className="font-display text-2xl">No movements found</h2><p className="mt-2 text-sm text-(--muted)">Change the filters or record a movement to begin the ledger.</p></div>
                        ) }
                    </CardContent>
                </Card>
            </div>

            <Sheet open={ Boolean( selectedMovement ) } onOpenChange={ open => { if ( !open && !reverseMutation.isPending ) setSelectedMovement( null ) } }>
                <SheetContent side="right" className="w-full sm:max-w-md">
                    <SheetHeader><SheetTitle>Reverse movement?</SheetTitle><SheetDescription>This will create a separate reversal record. The original movement remains unchanged.</SheetDescription></SheetHeader>
                    { selectedMovement ? <div className="px-6 text-sm"><p><strong>{ typeLabel( selectedMovement.type ) }</strong> · { selectedMovement.quantity }</p><p className="mt-1 text-(--muted)">{ selectedMovement.productName ?? selectedMovement.productId } · { selectedMovement.warehouseName ?? selectedMovement.warehouseId }</p></div> : null }
                    { reverseMutation.isError ? <p role="alert" className="px-6 text-sm text-(--accent-deep)">{ getApiErrorMessage( reverseMutation.error, 'The movement could not be reversed. Check your connection and try again.', { 403: 'You do not have permission to reverse stock movements. Ask an administrator for inventory:write access.' } ) }</p> : null }
                    <SheetFooter><Button type="button" variant="pill-ghost" className="border border-(--rule)" onClick={ () => setSelectedMovement( null ) } disabled={ reverseMutation.isPending }>Cancel</Button><Button type="button" variant="pill-ghost" onClick={ reverse } disabled={ reverseMutation.isPending }>{ reverseMutation.isPending ? <Spinner className="size-4" aria-label="Reversing movement" /> : <ArrowLeft size={ 15 } /> }Reverse movement</Button></SheetFooter>
                </SheetContent>
            </Sheet>
        </DashboardShell>
    )
}

function StockAvailabilityPanel () {
    const productsQuery = useProducts()
    const warehousesQuery = useWarehouses()
    const products = productsQuery.data ?? []
    const warehouses = warehousesQuery.data ?? []
    const [ productId, setProductId ] = useState( '' )
    const [ warehouseId, setWarehouseId ] = useState( '' )
    const [ lotFilter, setLotFilter ] = useState( '' )
    const [ genealogyLot, setGenealogyLot ] = useState( '' )
    const [ requestedQuantity, setRequestedQuantity ] = useState( '' )
    const onHandQuery = useStockOnHand( productId, warehouseId, lotFilter )
    const lotsQuery = useStockLotBalances( productId, warehouseId )
    const genealogyQuery = useLotGenealogy( genealogyLot )
    const pickingEnabled = Boolean( requestedQuantity.trim() ) && Number( requestedQuantity ) > 0
    const pickingQuery = usePickingSuggestions( productId, warehouseId, Number( requestedQuantity ), pickingEnabled )

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>Availability and lot traceability</CardTitle>
                <CardDescription>Check on-hand quantities, review lot history, and request server-ordered picking suggestions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <Field>
                        <FieldLabel htmlFor="availability-product">Product</FieldLabel>
                        <Select value={ productId || '__none__' } onValueChange={ value => setProductId( value === '__none__' ? '' : value ) }>
                            <SelectTrigger id="availability-product" className={ inputClass }><SelectValue placeholder="Select product" /></SelectTrigger>
                            <SelectContent><SelectItem value="__none__">Select product</SelectItem>{ products.map( product => <SelectItem key={ product.id } value={ product.id }>{ product.sku } · { product.name }</SelectItem> ) }</SelectContent>
                        </Select>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="availability-warehouse">Warehouse</FieldLabel>
                        <Select value={ warehouseId || '__none__' } onValueChange={ value => setWarehouseId( value === '__none__' ? '' : value ) }>
                            <SelectTrigger id="availability-warehouse" className={ inputClass }><SelectValue placeholder="Select warehouse" /></SelectTrigger>
                            <SelectContent><SelectItem value="__none__">Select warehouse</SelectItem>{ warehouses.map( warehouse => <SelectItem key={ warehouse.id } value={ warehouse.id }>{ warehouse.name }</SelectItem> ) }</SelectContent>
                        </Select>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="availability-lot">Optional lot filter</FieldLabel>
                        <Input id="availability-lot" className={ inputClass } value={ lotFilter } onChange={ event => setLotFilter( event.target.value ) } placeholder="All lots" disabled={ !( productId && warehouseId ) } />
                    </Field>
                    <div className="flex items-end">
                        <div className="w-full rounded-xl border border-(--rule) bg-(--paper-2) px-4 py-3">
                            <p className="text-xs text-(--muted)">On hand</p>
                            <p className="mt-1 font-mono text-xl tabular-nums">{ onHandQuery.isPending && productId && warehouseId ? '…' : onHandQuery.data?.quantity ?? ( productId && warehouseId ? '—' : 'Select product and warehouse' ) }</p>
                        </div>
                    </div>
                </div>
                { productsQuery.isError ? <p role="alert" className="text-sm text-(--accent-deep)">{ getApiErrorMessage( productsQuery.error, 'Products could not be loaded. Check your connection and try again.', { 403: 'You do not have permission to view inventory products. Ask an administrator for inventory:read access.' } ) }</p> : null }
                { warehousesQuery.isError ? <p role="alert" className="text-sm text-(--accent-deep)">{ getApiErrorMessage( warehousesQuery.error, 'Warehouses could not be loaded. Check your connection and try again.', { 403: 'You do not have permission to view warehouses. Ask an administrator for inventory:read access.' } ) }</p> : null }
                { onHandQuery.isError ? <p role="alert" className="text-sm text-(--accent-deep)">{ getApiErrorMessage( onHandQuery.error, 'On-hand quantity could not be loaded. Check your connection and try again.', { 403: 'You do not have permission to view stock availability. Ask an administrator for inventory:read access.' } ) }</p> : null }

                { productId && warehouseId ? (
                    <div>
                        <h3 className="mb-2 font-display text-lg">Lot balances</h3>
                        { lotsQuery.isPending ? <p className="text-sm text-(--muted)">Loading lot balances…</p> : lotsQuery.isError ? <p role="alert" className="text-sm text-(--accent-deep)">{ getApiErrorMessage( lotsQuery.error, 'Lot balances could not be loaded. Check your connection and try again.', { 403: 'You do not have permission to view lot balances. Ask an administrator for inventory:read access.' } ) }</p> : lotsQuery.data?.length ? (
                            <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Lot</TableHead><TableHead>Quantity</TableHead><TableHead>Expiry</TableHead><TableHead /></TableRow></TableHeader><TableBody>{ lotsQuery.data.map( lot => <TableRow key={ lot.lotNumber }><TableCell className="font-mono">{ lot.lotNumber }</TableCell><TableCell className="font-mono tabular-nums">{ lot.quantity }</TableCell><TableCell>{ lot.expiryDate ? formatDate( lot.expiryDate ) : '—' }</TableCell><TableCell><Button type="button" size="sm" variant="pill-ghost" onClick={ () => setGenealogyLot( lot.lotNumber ) }>View history</Button></TableCell></TableRow> ) }</TableBody></Table></div>
                        ) : <p className="text-sm text-(--muted)">No lot balances found for this product and warehouse.</p> }
                    </div>
                ) : null }

                <div className="grid gap-6 xl:grid-cols-2">
                    <div>
                        <Field>
                            <FieldLabel htmlFor="genealogy-lot">Lot genealogy</FieldLabel>
                            <div className="flex gap-2"><Input id="genealogy-lot" className={ inputClass } value={ genealogyLot } onChange={ event => setGenealogyLot( event.target.value ) } placeholder="Enter lot number" /><Button type="button" variant="pill-ghost" className="border border-(--rule)" onClick={ () => genealogyQuery.refetch() } disabled={ !genealogyLot.trim() }>Search</Button></div>
                        </Field>
                        { genealogyQuery.isFetching ? <p className="mt-2 text-sm text-(--muted)">Loading lot history…</p> : genealogyQuery.isError ? <p role="alert" className="mt-2 text-sm text-(--accent-deep)">{ getApiErrorMessage( genealogyQuery.error, 'Lot history could not be loaded. Check your connection and try again.', { 403: 'You do not have permission to view lot genealogy. Ask an administrator for inventory:read access.' } ) }</p> : genealogyQuery.data ? genealogyQuery.data.length ? <div className="mt-3 space-y-2">{ genealogyQuery.data.map( movement => <div key={ movement.id } className="rounded-lg border border-(--rule) px-3 py-2 text-sm"><span className="font-medium">{ typeLabel( movement.type ) }</span><span className="ml-2 font-mono">{ movement.quantity }</span><span className="ml-2 text-(--muted)">{ formatDate( movement.occurredAt ?? movement.createdAt ) }</span></div> ) }</div> : <p className="mt-2 text-sm text-(--muted)">No movements were returned for this lot.</p> : null }
                    </div>
                    <div>
                        <Field>
                            <FieldLabel htmlFor="picking-quantity">Picking suggestions</FieldLabel>
                            <div className="flex gap-2"><Input id="picking-quantity" className={ inputClass } type="number" min="0.001" step="any" value={ requestedQuantity } onChange={ event => setRequestedQuantity( event.target.value ) } placeholder="Requested quantity" /><Button type="button" variant="pill-ghost" className="border border-(--rule)" onClick={ () => pickingQuery.refetch() } disabled={ !( productId && warehouseId && pickingEnabled ) }><Search size={ 14 } />Suggest</Button></div>
                        </Field>
                        { pickingQuery.isFetching ? <p className="mt-2 text-sm text-(--muted)">Finding available lots…</p> : pickingQuery.isError ? <p role="alert" className="mt-2 text-sm text-(--accent-deep)">{ getApiErrorMessage( pickingQuery.error, 'Picking suggestions could not be loaded. Check your connection and try again.', { 403: 'You do not have permission to request picking suggestions. Ask an administrator for inventory:read access.' } ) }</p> : pickingQuery.data ? pickingQuery.data.length ? <div className="mt-3 space-y-2">{ pickingQuery.data.map( ( suggestion, index ) => <div key={ String( suggestion.lotNumber ?? suggestion.id ?? index ) } className="rounded-lg border border-(--rule) px-3 py-2 text-sm"><span className="font-medium">{ String( suggestion.lotNumber ?? suggestion.locationCode ?? `Suggestion ${ index + 1 }` ) }</span><span className="ml-2 font-mono tabular-nums">{ String( suggestion.quantity ?? suggestion.availableQuantity ?? '' ) }</span></div> ) }</div> : <p className="mt-2 text-sm text-(--muted)">No picking suggestions are available for that quantity.</p> : null }
                        { !( productId && warehouseId ) ? <p className="mt-2 text-sm text-(--muted)">Select a product and warehouse above to request suggestions.</p> : null }
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function CreateMovementSheet () {
    const [ open, setOpen ] = useState( false )
    const [ type, setType ] = useState<StockMovementType>( 'RECEIPT' )
    const [ productId, setProductId ] = useState( '' )
    const [ warehouseId, setWarehouseId ] = useState( '' )
    const [ transferToWarehouseId, setTransferToWarehouseId ] = useState( '' )
    const [ sourceLocationId, setSourceLocationId ] = useState( '' )
    const [ destinationLocationId, setDestinationLocationId ] = useState( '' )
    const [ quantity, setQuantity ] = useState( '' )
    const [ lotNumber, setLotNumber ] = useState( '' )
    const [ serialNumbers, setSerialNumbers ] = useState( '' )
    const [ unitCost, setUnitCost ] = useState( '' )
    const [ reference, setReference ] = useState( '' )
    const [ notes, setNotes ] = useState( '' )
    const [ occurredAt, setOccurredAt ] = useState( '' )
    const [ expiryDate, setExpiryDate ] = useState( '' )
    const [ validationError, setValidationError ] = useState<string | null>( null )
    const productsQuery = useProducts()
    const warehousesQuery = useWarehouses()
    const sourceLocationsQuery = useWarehouseLocations( warehouseId )
    const destinationLocationsQuery = useWarehouseLocations( type === 'TRANSFER' ? transferToWarehouseId : warehouseId )
    const mutation = useCreateStockMovement()

    const reset = () => {
        setType( 'RECEIPT' ); setProductId( '' ); setWarehouseId( '' ); setTransferToWarehouseId( '' )
        setSourceLocationId( '' ); setDestinationLocationId( '' ); setQuantity( '' ); setLotNumber( '' )
        setSerialNumbers( '' ); setUnitCost( '' ); setReference( '' ); setNotes( '' ); setOccurredAt( '' ); setExpiryDate( '' )
        setValidationError( null ); mutation.reset()
    }

    const submit = () => {
        const numericQuantity = Number( quantity )
        if ( !productId || !warehouseId || !quantity.trim() || !Number.isFinite( numericQuantity ) ) {
            setValidationError( 'Choose a product and warehouse, then enter a valid quantity.' )
            return
        }
        if ( type === 'TRANSFER' && ( !transferToWarehouseId || transferToWarehouseId === warehouseId ) ) {
            setValidationError( 'Choose a destination warehouse that differs from the source warehouse.' )
            return
        }
        const parsedUnitCost = unitCost.trim() ? Number( unitCost ) : undefined
        const parsedSerialNumbers = serialNumbers.split( ',' ).map( value => value.trim() ).filter( Boolean )
        if ( parsedUnitCost !== undefined && !Number.isFinite( parsedUnitCost ) ) {
            setValidationError( 'Enter a valid unit cost or leave the field empty.' )
            return
        }
        setValidationError( null )
        mutation.mutate( {
            type, productId, warehouseId, quantity: numericQuantity,
            transferToWarehouseId: type === 'TRANSFER' ? transferToWarehouseId : undefined,
            sourceLocationId: sourceLocationId || undefined,
            destinationLocationId: destinationLocationId || undefined,
            lotNumber: lotNumber.trim() || undefined,
            serialNumbers: parsedSerialNumbers.length ? parsedSerialNumbers : undefined,
            unitCost: parsedUnitCost,
            reference: reference.trim() || undefined,
            notes: notes.trim() || undefined,
            occurredAt: occurredAt ? new Date( occurredAt ).toISOString() : undefined,
            expiryDate: expiryDate || undefined,
        }, {
            onSuccess: movement => { toast.success( 'Movement recorded', { description: `${ typeLabel( movement.type ) } was added to the stock ledger.` } ); setOpen( false ); reset() },
            onError: error => toastApiError( error, 'The movement could not be recorded. Check your connection and try again.', { 403: 'You do not have permission to post stock movements. Ask an administrator for inventory:write access.' } ),
        } )
    }

    return (
        <Sheet open={ open } onOpenChange={ value => { if ( !mutation.isPending ) setOpen( value ) } }>
            <SheetTrigger asChild><Button type="button" variant="pill-ghost" className="mt-5 bg-(--ink) text-(--paper) hover:bg-(--accent) sm:mt-0"><Plus size={ 15 } aria-hidden="true" />Record movement</Button></SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-2xl">
                <SheetHeader><SheetTitle>Record stock movement</SheetTitle><SheetDescription>Post an immutable movement. Corrections are made by reversing a movement.</SheetDescription></SheetHeader>
                <div className="grid flex-1 gap-4 overflow-y-auto p-6 sm:grid-cols-2">
                    { validationError ? <p role="alert" className="sm:col-span-2 rounded-lg border border-(--accent)/25 bg-(--accent-soft) p-3 text-sm text-(--accent-deep)">{ validationError }</p> : null }
                    { mutation.isError ? <p role="alert" className="sm:col-span-2 rounded-lg border border-(--accent)/25 bg-(--accent-soft) p-3 text-sm text-(--accent-deep)">{ getApiErrorMessage( mutation.error, 'The movement could not be recorded. Check your connection and try again.', { 403: 'You do not have permission to post stock movements. Ask an administrator for inventory:write access.' } ) }</p> : null }
                    { productsQuery.isError ? <p role="alert" className="sm:col-span-2 text-sm text-(--accent-deep)">{ getApiErrorMessage( productsQuery.error, 'Products could not be loaded. Check your connection and try again.', { 403: 'You do not have permission to view inventory products. Ask an administrator for inventory:read access.' } ) }</p> : null }
                    { warehousesQuery.isError ? <p role="alert" className="sm:col-span-2 text-sm text-(--accent-deep)">{ getApiErrorMessage( warehousesQuery.error, 'Warehouses could not be loaded. Check your connection and try again.', { 403: 'You do not have permission to view warehouses. Ask an administrator for inventory:read access.' } ) }</p> : null }
                    <Field><FieldLabel htmlFor="movement-type">Movement type *</FieldLabel><Select value={ type } onValueChange={ value => { setType( value as StockMovementType ); setDestinationLocationId( '' ) } } disabled={ mutation.isPending }><SelectTrigger id="movement-type" className={ inputClass }><SelectValue /></SelectTrigger><SelectContent>{ stockMovementTypes.map( option => <SelectItem key={ option } value={ option }>{ typeLabel( option ) }</SelectItem> ) }</SelectContent></Select></Field>
                    <Field><FieldLabel htmlFor="movement-product">Product *</FieldLabel><Select value={ productId } onValueChange={ setProductId } disabled={ mutation.isPending }><SelectTrigger id="movement-product" className={ inputClass }><SelectValue placeholder="Select product" /></SelectTrigger><SelectContent>{ ( productsQuery.data ?? [] ).map( product => <SelectItem key={ product.id } value={ product.id }>{ product.sku } · { product.name }</SelectItem> ) }</SelectContent></Select></Field>
                    <Field><FieldLabel htmlFor="movement-warehouse">Warehouse *</FieldLabel><Select value={ warehouseId } onValueChange={ value => { setWarehouseId( value ); setSourceLocationId( '' ); setDestinationLocationId( '' ) } } disabled={ mutation.isPending }><SelectTrigger id="movement-warehouse" className={ inputClass }><SelectValue placeholder="Select warehouse" /></SelectTrigger><SelectContent>{ ( warehousesQuery.data ?? [] ).map( warehouse => <SelectItem key={ warehouse.id } value={ warehouse.id }>{ warehouse.name }</SelectItem> ) }</SelectContent></Select></Field>
                    { type === 'TRANSFER' ? <Field><FieldLabel htmlFor="movement-transfer-warehouse">Destination warehouse *</FieldLabel><Select value={ transferToWarehouseId } onValueChange={ value => { setTransferToWarehouseId( value ); setDestinationLocationId( '' ) } } disabled={ mutation.isPending }><SelectTrigger id="movement-transfer-warehouse" className={ inputClass }><SelectValue placeholder="Select destination" /></SelectTrigger><SelectContent>{ ( warehousesQuery.data ?? [] ).filter( warehouse => warehouse.id !== warehouseId ).map( warehouse => <SelectItem key={ warehouse.id } value={ warehouse.id }>{ warehouse.name }</SelectItem> ) }</SelectContent></Select></Field> : null }
                    <Field><FieldLabel htmlFor="movement-quantity">Quantity *</FieldLabel><Input id="movement-quantity" type="number" step="any" value={ quantity } onChange={ event => setQuantity( event.target.value ) } className={ inputClass } disabled={ mutation.isPending } required /></Field>
                    <Field><FieldLabel htmlFor="movement-source-location">Source location</FieldLabel><Select value={ sourceLocationId || '__none__' } onValueChange={ value => setSourceLocationId( value === '__none__' ? '' : value ) } disabled={ mutation.isPending || !warehouseId }><SelectTrigger id="movement-source-location" className={ inputClass }><SelectValue placeholder="No location" /></SelectTrigger><SelectContent><SelectItem value="__none__">No location</SelectItem>{ ( sourceLocationsQuery.data ?? [] ).map( location => <SelectItem key={ location.id } value={ location.id }>{ location.code } · { location.type }</SelectItem> ) }</SelectContent></Select></Field>
                    <Field><FieldLabel htmlFor="movement-destination-location">Destination location</FieldLabel><Select value={ destinationLocationId || '__none__' } onValueChange={ value => setDestinationLocationId( value === '__none__' ? '' : value ) } disabled={ mutation.isPending || !( type === 'TRANSFER' ? transferToWarehouseId : warehouseId ) }><SelectTrigger id="movement-destination-location" className={ inputClass }><SelectValue placeholder="No location" /></SelectTrigger><SelectContent><SelectItem value="__none__">No location</SelectItem>{ ( destinationLocationsQuery.data ?? [] ).map( location => <SelectItem key={ location.id } value={ location.id }>{ location.code } · { location.type }</SelectItem> ) }</SelectContent></Select></Field>
                    { sourceLocationsQuery.isError ? <p role="alert" className="text-sm text-(--accent-deep)">{ getApiErrorMessage( sourceLocationsQuery.error, 'Source locations could not be loaded. Check your connection and try again.', { 403: 'You do not have permission to view warehouse locations. Ask an administrator for inventory:read access.' } ) }</p> : null }
                    { destinationLocationsQuery.isError ? <p role="alert" className="text-sm text-(--accent-deep)">{ getApiErrorMessage( destinationLocationsQuery.error, 'Destination locations could not be loaded. Check your connection and try again.', { 403: 'You do not have permission to view warehouse locations. Ask an administrator for inventory:read access.' } ) }</p> : null }
                    <Field><FieldLabel htmlFor="movement-lot">Lot number</FieldLabel><Input id="movement-lot" value={ lotNumber } onChange={ event => setLotNumber( event.target.value ) } className={ inputClass } disabled={ mutation.isPending } /></Field>
                    <Field><FieldLabel htmlFor="movement-serials">Serial numbers</FieldLabel><Input id="movement-serials" value={ serialNumbers } onChange={ event => setSerialNumbers( event.target.value ) } className={ inputClass } placeholder="Comma-separated" disabled={ mutation.isPending } /></Field>
                    <Field><FieldLabel htmlFor="movement-unit-cost">Unit cost</FieldLabel><Input id="movement-unit-cost" type="number" step="any" value={ unitCost } onChange={ event => setUnitCost( event.target.value ) } className={ inputClass } disabled={ mutation.isPending } /></Field>
                    <Field><FieldLabel htmlFor="movement-reference">Reference</FieldLabel><Input id="movement-reference" value={ reference } onChange={ event => setReference( event.target.value ) } className={ inputClass } disabled={ mutation.isPending } /></Field>
                    <Field><FieldLabel htmlFor="movement-occurred-at">Occurred at</FieldLabel><Input id="movement-occurred-at" type="datetime-local" value={ occurredAt } onChange={ event => setOccurredAt( event.target.value ) } className={ inputClass } disabled={ mutation.isPending } /></Field>
                    <Field><FieldLabel htmlFor="movement-expiry">Expiry date</FieldLabel><Input id="movement-expiry" type="date" value={ expiryDate } onChange={ event => setExpiryDate( event.target.value ) } className={ inputClass } disabled={ mutation.isPending } /></Field>
                    <Field className="sm:col-span-2"><FieldLabel htmlFor="movement-notes">Notes</FieldLabel><Input id="movement-notes" value={ notes } onChange={ event => setNotes( event.target.value ) } className={ inputClass } disabled={ mutation.isPending } /></Field>
                </div>
                <SheetFooter><Button type="button" variant="pill-ghost" className="border border-(--rule)" onClick={ () => { reset(); setOpen( false ) } } disabled={ mutation.isPending }>Cancel</Button><Button type="button" variant="pill-ghost" onClick={ submit } disabled={ mutation.isPending }>{ mutation.isPending ? <Spinner className="size-4" aria-label="Posting movement" /> : <Plus size={ 15 } /> }Post movement</Button></SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

function formatDate ( value?: string | null ) {
    if ( !value ) return '—'
    const date = new Date( value )
    return Number.isNaN( date.getTime() ) ? value : date.toLocaleString()
}
