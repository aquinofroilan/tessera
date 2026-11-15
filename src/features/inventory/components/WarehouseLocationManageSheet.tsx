import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import { Pencil, Trash2 } from '@/components/ui/hugeicons'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Spinner } from '@/components/ui/spinner'
import { Switch } from '@/components/ui/switch'
import { useDeactivateWarehouseLocation, useUpdateWarehouseLocation, useWarehouseLocation } from '@/src/features/inventory/api/warehouses'
import type { WarehouseLocationResponse, WarehouseLocationType } from '@/src/features/inventory/types/warehouses'
import { getApiErrorMessage, toastApiError } from '@/src/lib/api-error'

type WarehouseLocationManageSheetProps = Readonly<{
    locationId: string
    locations: readonly WarehouseLocationResponse[]
}>

const locationTypes: readonly WarehouseLocationType[] = [ 'ZONE', 'AISLE', 'RACK', 'SHELF', 'BIN' ]
const inputClass = 'h-11 rounded-[10px] border-(--rule) bg-(--card) px-3.5 text-sm placeholder:text-(--muted-2) focus-visible:border-(--ink) focus-visible:ring-(--ink)/10'

export function WarehouseLocationManageSheet ( { locationId, locations }: WarehouseLocationManageSheetProps ) {
    const [ open, setOpen ] = useState( false )
    const [ editing, setEditing ] = useState( false )
    const [ confirmDeactivate, setConfirmDeactivate ] = useState( false )
    const [ code, setCode ] = useState( '' )
    const [ type, setType ] = useState<WarehouseLocationType>( 'BIN' )
    const [ parentLocationId, setParentLocationId ] = useState( '' )
    const [ barcode, setBarcode ] = useState( '' )
    const [ isActive, setIsActive ] = useState( true )
    const locationQuery = useWarehouseLocation( locationId, open )
    const location = locationQuery.data
    const updateMutation = useUpdateWarehouseLocation( locationId )
    const deactivateMutation = useDeactivateWarehouseLocation( locationId )
    const isPending = updateMutation.isPending || deactivateMutation.isPending

    const descendants = useMemo( () => {
        const result = new Set<string>()
        let changed = true
        while ( changed ) {
            changed = false
            for ( const candidate of locations ) {
                if ( candidate.parentLocationId && ( candidate.parentLocationId === locationId || result.has( candidate.parentLocationId ) ) && !result.has( candidate.id ) ) {
                    result.add( candidate.id )
                    changed = true
                }
            }
        }
        return result
    }, [ locationId, locations ] )

    useEffect( () => {
        if ( !location ) return
        setCode( location.code )
        setType( location.type )
        setParentLocationId( location.parentLocationId ?? '' )
        setBarcode( location.barcode ?? '' )
        setIsActive( location.isActive )
    }, [ location ] )

    const startEditing = () => {
        if ( !location ) return
        setCode( location.code )
        setType( location.type )
        setParentLocationId( location.parentLocationId ?? '' )
        setBarcode( location.barcode ?? '' )
        setIsActive( location.isActive )
        updateMutation.reset()
        setEditing( true )
    }

    const save = () => {
        if ( !code.trim() ) {
            toast.error( 'Location code is required' )
            return
        }
        if ( parentLocationId === locationId || descendants.has( parentLocationId ) ) {
            toast.error( 'Choose a parent outside this location hierarchy' )
            return
        }

        updateMutation.mutate( {
            code: code.trim(),
            parentLocationId: parentLocationId || null,
            type,
            barcode: barcode.trim() || undefined,
            isActive,
        }, {
            onSuccess: updated => {
                toast.success( 'Location updated', { description: `${ updated.code } has been saved.` } )
                setEditing( false )
            },
            onError: error => toastApiError( error, 'Location changes could not be saved. Check your connection and try again.', { 403: 'You do not have permission to update warehouse locations. Ask an administrator for inventory:write access.' } ),
        } )
    }

    const deactivate = () => {
        deactivateMutation.mutate( undefined, {
            onSuccess: updated => {
                toast.success( 'Location deactivated', { description: `${ updated.code } is no longer active.` } )
                setConfirmDeactivate( false )
                setOpen( false )
            },
            onError: error => toastApiError( error, 'The location could not be deactivated. Deactivate or reparent its active children first.', { 403: 'You do not have permission to deactivate warehouse locations. Ask an administrator for inventory:write access.' } ),
        } )
    }

    return (
        <>
            <Button type="button" size="sm" variant="pill-ghost" className="border border-(--rule)" onClick={ () => { setEditing( false ); setOpen( true ) } }>
                Manage
            </Button>
            <Sheet open={ open } onOpenChange={ nextOpen => { if ( !isPending ) setOpen( nextOpen ) } }>
                <SheetContent side="right" className="overflow-y-auto p-0 data-[side=right]:max-w-xl">
                    <SheetHeader>
                        <SheetTitle>{ editing ? 'Edit location' : location?.code ?? 'Location details' }</SheetTitle>
                        <SheetDescription>{ editing ? 'Update this location. Parent changes must stay within this warehouse.' : 'Review this storage location and its current status.' }</SheetDescription>
                    </SheetHeader>
                    { locationQuery.isPending ? (
                        <div className="flex flex-1 items-center justify-center gap-2 p-8 text-sm text-(--muted)"><Spinner className="size-4 text-(--accent)" aria-label="Loading location" />Loading location…</div>
                    ) : locationQuery.isError || !location ? (
                        <div className="flex-1 space-y-3 p-6">
                            <p role="alert" className="text-sm text-(--accent-deep)">{ getApiErrorMessage( locationQuery.error, 'Location details could not be loaded. Check your connection and try again.', { 403: 'You do not have permission to view warehouse locations. Ask an administrator for inventory:read access.', 404: 'This location could not be found in this warehouse.' } ) }</p>
                            <Button type="button" variant="pill-ghost" className="border border-(--rule)" onClick={ () => { void locationQuery.refetch() } }>Retry</Button>
                        </div>
                    ) : editing ? (
                        <div className="flex-1 space-y-5 p-6">
                            { updateMutation.isError ? <p role="alert" className="rounded-lg border border-(--accent)/25 bg-(--accent-soft) p-3 text-sm text-(--accent-deep)">{ getApiErrorMessage( updateMutation.error, 'Location changes could not be saved. Check your connection and try again.', { 403: 'You do not have permission to update warehouse locations. Ask an administrator for inventory:write access.' } ) }</p> : null }
                            <Field>
                                <FieldLabel htmlFor="location-edit-code">Code</FieldLabel>
                                <Input id="location-edit-code" value={ code } onChange={ event => setCode( event.target.value ) } className={ inputClass } disabled={ isPending } required />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="location-edit-type">Type</FieldLabel>
                                <Select value={ type } onValueChange={ value => setType( value as WarehouseLocationType ) } disabled={ isPending }>
                                    <SelectTrigger id="location-edit-type" className={ inputClass }><SelectValue /></SelectTrigger>
                                    <SelectContent>{ locationTypes.map( option => <SelectItem key={ option } value={ option }>{ option }</SelectItem> ) }</SelectContent>
                                </Select>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="location-edit-parent">Parent location</FieldLabel>
                                <Select value={ parentLocationId || '__none__' } onValueChange={ value => setParentLocationId( value === '__none__' ? '' : value ) } disabled={ isPending }>
                                    <SelectTrigger id="location-edit-parent" className={ inputClass }><SelectValue placeholder="No parent" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="__none__">No parent</SelectItem>
                                        { locations.filter( candidate => candidate.id !== locationId && !descendants.has( candidate.id ) ).map( candidate => <SelectItem key={ candidate.id } value={ candidate.id }>{ candidate.code } · { candidate.type }{ candidate.isActive ? '' : ' · inactive' }</SelectItem> ) }
                                    </SelectContent>
                                </Select>
                                <FieldDescription>Locations in another warehouse and descendants are excluded.</FieldDescription>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="location-edit-barcode">Barcode</FieldLabel>
                                <Input id="location-edit-barcode" value={ barcode } onChange={ event => setBarcode( event.target.value ) } className={ inputClass } disabled={ isPending } />
                                <FieldDescription>Leave blank to keep the current barcode; the API treats a null barcode as unchanged.</FieldDescription>
                            </Field>
                            <div className="flex items-center justify-between gap-4 rounded-xl border border-(--rule) bg-(--paper) p-3.5">
                                <div className="grid gap-0.5">
                                    <FieldLabel htmlFor="location-edit-active" className="cursor-pointer">Active</FieldLabel>
                                    <FieldDescription>Inactive locations remain visible when inactive locations are included.</FieldDescription>
                                </div>
                                <Switch id="location-edit-active" checked={ isActive } onCheckedChange={ setIsActive } disabled={ isPending } aria-label="Location is active" />
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 space-y-5 p-6">
                            <div className="flex items-center justify-between gap-4 rounded-xl border border-(--rule) bg-(--paper-2) p-4">
                                <div><p className="font-mono text-xs text-(--muted)">Location status</p><p className="mt-1 font-medium">{ location.isActive ? 'Active' : 'Inactive' }</p></div>
                                <span className={ `rounded-full px-2.5 py-1 text-xs font-medium ${ location.isActive ? 'bg-(--moss-soft) text-(--moss)' : 'bg-(--paper) text-(--muted)' }` }>{ location.isActive ? 'Active' : 'Inactive' }</span>
                            </div>
                            <dl className="divide-y divide-(--rule)">
                                <LocationDetail label="Code">{ location.code }</LocationDetail>
                                <LocationDetail label="Type">{ location.type }</LocationDetail>
                                <LocationDetail label="Parent">{ locations.find( candidate => candidate.id === location.parentLocationId )?.code ?? '—' }</LocationDetail>
                                <LocationDetail label="Barcode">{ location.barcode || '—' }</LocationDetail>
                                <LocationDetail label="Location ID">{ location.id }</LocationDetail>
                            </dl>
                            <div className="flex flex-wrap gap-2">
                                <Button type="button" variant="pill-ghost" className="bg-(--ink) text-(--paper) hover:bg-(--accent)" onClick={ startEditing }><Pencil size={ 15 } aria-hidden="true" />Edit location</Button>
                                { location.isActive ? <Button type="button" variant="pill-ghost" className="text-(--accent-deep) hover:bg-(--accent-soft)" onClick={ () => { deactivateMutation.reset(); setConfirmDeactivate( true ) } }><Trash2 size={ 15 } aria-hidden="true" />Deactivate location</Button> : null }
                            </div>
                        </div>
                    ) }
                    { editing && location ? (
                        <SheetFooter className="border-t border-(--rule-soft)">
                            <Button type="button" variant="pill-ghost" className="border border-(--rule)" onClick={ () => { setEditing( false ); updateMutation.reset() } } disabled={ isPending }>Cancel</Button>
                            <Button type="button" variant="pill-ghost" className="bg-(--ink) text-(--paper) hover:bg-(--accent)" onClick={ save } disabled={ isPending }>
                                { updateMutation.isPending ? <Spinner className="size-4 text-current" aria-label="Saving location" /> : <Pencil size={ 15 } aria-hidden="true" /> }
                                { updateMutation.isPending ? 'Saving…' : 'Save changes' }
                            </Button>
                        </SheetFooter>
                    ) : null }
                </SheetContent>
            </Sheet>
            <Dialog open={ confirmDeactivate } onOpenChange={ value => { if ( !deactivateMutation.isPending ) setConfirmDeactivate( value ) } }>
                <DialogContent className="top-[20%]">
                    <div className="grid gap-1.5 pr-7">
                        <DialogTitle className="font-display text-2xl font-normal">Deactivate location?</DialogTitle>
                        <DialogDescription>{ location?.code } will be marked inactive and kept for reference. Active child locations must be deactivated or reparented first.</DialogDescription>
                    </div>
                    { deactivateMutation.isError ? <p role="alert" className="text-sm text-(--accent-deep)">{ getApiErrorMessage( deactivateMutation.error, 'The location could not be deactivated. Deactivate or reparent its active children first.', { 403: 'You do not have permission to deactivate warehouse locations. Ask an administrator for inventory:write access.' } ) }</p> : null }
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="pill-ghost" className="border border-(--rule)" onClick={ () => setConfirmDeactivate( false ) } disabled={ deactivateMutation.isPending }>Cancel</Button>
                        <Button type="button" variant="pill-ghost" className="bg-(--accent) text-(--paper) hover:bg-(--accent-deep)" onClick={ deactivate } disabled={ deactivateMutation.isPending }>
                            { deactivateMutation.isPending ? <Spinner className="size-4 text-current" aria-label="Deactivating location" /> : <Trash2 size={ 15 } aria-hidden="true" /> }
                            { deactivateMutation.isPending ? 'Deactivating…' : 'Deactivate location' }
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

function LocationDetail ( { label, children }: Readonly<{ label: string, children: ReactNode }> ) {
    return <div className="grid gap-1 py-3 sm:grid-cols-[140px_1fr] sm:gap-4"><dt className="text-xs text-(--muted)">{ label }</dt><dd className="break-all text-sm text-(--ink)">{ children }</dd></div>
}
