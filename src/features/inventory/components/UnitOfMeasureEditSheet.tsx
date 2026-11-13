import { useEffect, useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Spinner } from '@/components/ui/spinner'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useUnitsOfMeasure, useUpdateUnitOfMeasure } from '@/src/features/inventory/api/unitsOfMeasure'
import type { UnitOfMeasureResponse } from '@/src/features/inventory/types/unitsOfMeasure'
import { toastApiError } from '@/src/lib/api-error'

type UnitOfMeasureEditSheetProps = Readonly<{
    unit: UnitOfMeasureResponse
}>

const unitSchema = z.object( {
    name: z.string().trim().min( 1, 'Unit name is required.' ),
    description: z.string(),
    baseUomId: z.string(),
    conversionFactor: z.string(),
    isActive: z.boolean(),
} ).superRefine( ( values, context ) => {
    if ( !values.baseUomId ) return

    const factor = Number( values.conversionFactor )
    if ( !Number.isFinite( factor ) || factor <= 0 ) {
        context.addIssue( { code: 'custom', path: [ 'conversionFactor' ], message: 'Enter a conversion factor greater than zero.' } )
    }
} )

type UnitFormValues = z.infer<typeof unitSchema>

const inputClass = 'h-11 rounded-[10px] border-(--rule) bg-(--card) px-3.5 text-sm placeholder:text-(--muted-2) focus-visible:border-(--ink) focus-visible:ring-(--ink)/10'
const fieldClass = 'gap-1.5 text-xs font-medium text-(--ink-soft)'

function getDescendantUnitIds ( unitId: string, units: UnitOfMeasureResponse[] ) {
    const descendants = new Set<string>()
    const pendingIds = [ unitId ]

    while ( pendingIds.length ) {
        const baseId = pendingIds.shift()
        if ( !baseId ) continue

        for ( const unit of units ) {
            if ( unit.baseUomId === baseId && !descendants.has( unit.id ) ) {
                descendants.add( unit.id )
                pendingIds.push( unit.id )
            }
        }
    }

    return descendants
}

export function UnitOfMeasureEditSheet ( { unit }: UnitOfMeasureEditSheetProps ) {
    const [ open, setOpen ] = useState( false )
    const [ selectedBaseUomId, setSelectedBaseUomId ] = useState( unit.baseUomId ?? '' )
    const unitsQuery = useUnitsOfMeasure( { activeOnly: false } )
    const updateMutation = useUpdateUnitOfMeasure( unit.id )
    const isPending = updateMutation.isPending

    useEffect( () => {
        const toastId = `uom-edit-base-units-error-${ unit.id }`

        if ( unitsQuery.isError ) {
            toastApiError( unitsQuery.error, 'Units of measure could not be loaded. Check your connection and try again.', { 403: 'You do not have permission to view units of measure. Ask an administrator for inventory:read access.' }, {
                id: toastId,
                action: { label: 'Retry', onClick: () => { void unitsQuery.refetch() } },
            } )
        } else {
            toast.dismiss( toastId )
        }
    }, [ unit.id, unitsQuery.error, unitsQuery.isError, unitsQuery.refetch ] )

    const descendants = getDescendantUnitIds( unit.id, unitsQuery.data ?? [] )
    const baseUnitOptions = ( unitsQuery.data ?? [] ).filter( option => option.id !== unit.id && !descendants.has( option.id ) )

    const form = useForm( {
        defaultValues: {
            name: unit.name,
            description: unit.description ?? '',
            baseUomId: unit.baseUomId ?? '',
            conversionFactor: String( unit.conversionFactor ),
            isActive: unit.isActive,
        },
        validators: { onSubmit: unitSchema },
        onSubmit: ( { value } ) => {
            updateMutation.mutate( {
                name: value.name.trim(),
                description: value.description.trim() || null,
                baseUomId: value.baseUomId || null,
                conversionFactor: value.baseUomId ? Number( value.conversionFactor ) : 1,
                isActive: value.isActive,
            }, {
                onSuccess: updated => {
                    toast.success( 'Unit updated', { description: `${ updated.name } has been saved.` } )
                    setOpen( false )
                },
                onError: error => toastApiError( error, 'Unit changes could not be saved. Check your connection and try again.', { 403: 'You do not have permission to update units of measure. Ask an administrator for inventory:write access.' } ),
            } )
        },
    } )

    const openEditor = () => {
        form.reset()
        form.setFieldValue( 'name', unit.name )
        form.setFieldValue( 'description', unit.description ?? '' )
        form.setFieldValue( 'baseUomId', unit.baseUomId ?? '' )
        form.setFieldValue( 'conversionFactor', String( unit.conversionFactor ) )
        form.setFieldValue( 'isActive', unit.isActive )
        setSelectedBaseUomId( unit.baseUomId ?? '' )
        updateMutation.reset()
        setOpen( true )
    }

    return (
        <>
            <Button type="button" variant="pill-ghost" className="bg-(--ink) text-(--paper) hover:bg-(--accent)" onClick={ openEditor }>
                Edit unit
            </Button>
            <Sheet open={ open } onOpenChange={ nextOpen => { if ( !isPending ) setOpen( nextOpen ) } }>
                <SheetContent side="right" className="overflow-y-auto p-0 data-[side=right]:max-w-2xl" aria-describedby="uom-edit-description">
                    <form onSubmit={ event => { event.preventDefault(); event.stopPropagation(); void form.handleSubmit() } } className="flex min-h-full flex-col">
                        <SheetHeader>
                            <SheetTitle>Edit unit of measure</SheetTitle>
                            <SheetDescription id="uom-edit-description">Update the definition for { unit.name }.</SheetDescription>
                        </SheetHeader>

                        <div className="flex-1 space-y-5 p-6">
                            <Field className={ fieldClass }>
                                <FieldLabel htmlFor="uom-edit-code">Code</FieldLabel>
                                <Input id="uom-edit-code" value={ unit.code } className={ inputClass } disabled readOnly />
                                <FieldDescription>The code is set when the unit is created.</FieldDescription>
                            </Field>

                            <form.Field name="name">
                                { field => {
                                    const isInvalid = field.state.meta.errors.length > 0
                                    return (
                                        <Field data-invalid={ isInvalid } className={ fieldClass }>
                                            <FieldLabel htmlFor="uom-edit-name">Name <span className="text-(--accent)">*</span></FieldLabel>
                                            <Input id="uom-edit-name" name={ field.name } value={ field.state.value } onBlur={ field.handleBlur } onChange={ event => field.handleChange( event.target.value ) } aria-invalid={ isInvalid } className={ inputClass } required disabled={ isPending } />
                                            { isInvalid ? <FieldError errors={ field.state.meta.errors } /> : null }
                                        </Field>
                                    )
                                } }
                            </form.Field>

                            <form.Field name="description">
                                { field => (
                                    <Field className={ fieldClass }>
                                        <FieldLabel htmlFor="uom-edit-description-field">Description</FieldLabel>
                                        <Textarea id="uom-edit-description-field" name={ field.name } value={ field.state.value } onBlur={ field.handleBlur } onChange={ event => field.handleChange( event.target.value ) } className="min-h-24 resize-y rounded-[10px] border border-(--rule) bg-(--card) px-3.5 py-3 text-sm placeholder:text-(--muted-2) focus-visible:border-(--ink) focus-visible:ring-(--ink)/10" disabled={ isPending } />
                                    </Field>
                                ) }
                            </form.Field>

                            <FieldGroup className="grid gap-5 sm:grid-cols-2">
                                <form.Field name="baseUomId">
                                    { field => (
                                        <Field className={ fieldClass }>
                                            <FieldLabel htmlFor="uom-edit-base-unit">Base unit</FieldLabel>
                                            <Select value={ field.state.value || '__none__' } onValueChange={ value => {
                                                const baseUomId = value === '__none__' ? '' : value
                                                field.handleChange( baseUomId )
                                                setSelectedBaseUomId( baseUomId )
                                            } } disabled={ isPending || unitsQuery.isPending || unitsQuery.isError }>
                                                <SelectTrigger id="uom-edit-base-unit" className={ inputClass } aria-label="Base unit">
                                                    <SelectValue placeholder={ unitsQuery.isPending ? 'Loading units…' : 'Select a base unit' } />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="__none__">No base unit</SelectItem>
                                                    { baseUnitOptions.map( option => <SelectItem key={ option.id } value={ option.id }>{ option.name } · { option.code }{ option.isActive ? '' : ' (Inactive)' }</SelectItem> ) }
                                                </SelectContent>
                                            </Select>
                                            <FieldDescription>Selecting a base unit defines a conversion relationship.</FieldDescription>
                                        </Field>
                                    ) }
                                </form.Field>
                                <form.Field name="conversionFactor">
                                    { field => {
                                        const isInvalid = field.state.meta.errors.length > 0
                                        const hasBaseUnit = Boolean( selectedBaseUomId )
                                        return (
                                            <Field data-invalid={ isInvalid } className={ fieldClass }>
                                                <FieldLabel htmlFor="uom-edit-factor">Conversion factor</FieldLabel>
                                                <Input id="uom-edit-factor" name={ field.name } type="number" inputMode="decimal" min="0" step="any" value={ hasBaseUnit ? field.state.value : '1' } onBlur={ field.handleBlur } onChange={ event => field.handleChange( event.target.value ) } aria-invalid={ isInvalid } className={ inputClass } disabled={ isPending || !hasBaseUnit } />
                                                <FieldDescription>How many base units are in one of this unit.</FieldDescription>
                                                { isInvalid ? <FieldError errors={ field.state.meta.errors } /> : null }
                                            </Field>
                                        )
                                    } }
                                </form.Field>
                            </FieldGroup>

                            <form.Field name="isActive">
                                { field => (
                                    <div className="flex items-center justify-between gap-4 rounded-xl border border-(--rule) bg-(--paper) p-3.5">
                                        <div className="grid gap-0.5">
                                            <FieldLabel htmlFor="uom-edit-active" className="cursor-pointer">Enable unit</FieldLabel>
                                            <FieldDescription>{ field.state.value ? 'Available for inventory use.' : 'Inactive units remain visible in existing records.' }</FieldDescription>
                                        </div>
                                        <Switch id="uom-edit-active" checked={ field.state.value } onCheckedChange={ field.handleChange } disabled={ isPending } aria-label="Enable unit of measure" />
                                    </div>
                                ) }
                            </form.Field>
                        </div>

                        <SheetFooter className="border-t border-(--rule-soft)">
                            <Button type="button" variant="pill-ghost" className="border border-(--rule)" onClick={ () => setOpen( false ) } disabled={ isPending }>Cancel</Button>
                            <Button type="submit" variant="pill-ghost" className="bg-(--ink) text-(--paper) hover:bg-(--accent)" disabled={ isPending }>
                                { isPending ? <Spinner className="size-4 text-current" aria-label="Saving unit" /> : null }
                                { isPending ? 'Saving…' : 'Save changes' }
                            </Button>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </Sheet>
        </>
    )
}
