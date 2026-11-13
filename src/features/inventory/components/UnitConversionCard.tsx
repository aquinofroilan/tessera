import { useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import { Link } from '@tanstack/react-router'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { useConvertUnitOfMeasure, useUnitsOfMeasure } from '@/src/features/inventory/api/unitsOfMeasure'
import type { UnitConversionRequest } from '@/src/features/inventory/types/unitsOfMeasure'
import { toastApiError } from '@/src/lib/api-error'

const conversionSchema = z.object( {
    quantity: z.string().trim().min( 1, 'Enter a quantity.' ),
    fromUomId: z.string().min( 1, 'Choose the source unit.' ),
    toUomId: z.string().min( 1, 'Choose the destination unit.' ),
} ).superRefine( ( values, context ) => {
    if ( !Number.isFinite( Number( values.quantity ) ) ) {
        context.addIssue( { code: 'custom', path: [ 'quantity' ], message: 'Enter a valid number.' } )
    }
} )

type UnitConversionFormValues = z.infer<typeof conversionSchema>

const initialValues: UnitConversionFormValues = {
    quantity: '1',
    fromUomId: '',
    toUomId: '',
}

const inputClass = 'h-11 rounded-[10px] border-(--rule) bg-(--card) px-3.5 text-sm placeholder:text-(--muted-2) focus-visible:border-(--ink) focus-visible:ring-(--ink)/10'
const fieldClass = 'gap-1.5 text-xs font-medium text-(--ink-soft)'

export function UnitConversionCard () {
    const unitsQuery = useUnitsOfMeasure( { activeOnly: true } )
    const convertMutation = useConvertUnitOfMeasure()
    const isPending = convertMutation.isPending

    useEffect( () => {
        const toastId = 'unit-conversion-units-error'

        if ( unitsQuery.isError ) {
            toastApiError( unitsQuery.error, 'Units of measure could not be loaded. Check your connection and try again.', { 403: 'You do not have permission to view units of measure. Ask an administrator for inventory:read access.' }, {
                id: toastId,
                action: { label: 'Retry', onClick: () => { void unitsQuery.refetch() } },
            } )
        } else {
            toast.dismiss( toastId )
        }
    }, [ unitsQuery.error, unitsQuery.isError, unitsQuery.refetch ] )

    const form = useForm( {
        defaultValues: initialValues,
        validators: { onSubmit: conversionSchema },
        onSubmit: ( { value } ) => {
            const request: UnitConversionRequest = {
                quantity: Number( value.quantity ),
                fromUomId: value.fromUomId,
                toUomId: value.toUomId,
            }

            convertMutation.mutate( request, {
                onError: error => toastApiError( error, 'The quantity could not be converted. Check your connection and try again.', { 403: 'You do not have permission to convert units. Ask an administrator for inventory:read access.' } ),
            } )
        },
    } )
    const convertedFrom = unitsQuery.data?.find( unit => unit.id === convertMutation.data?.fromUomId )
    const convertedTo = unitsQuery.data?.find( unit => unit.id === convertMutation.data?.toUomId )

    return (
        <Card>
            <CardHeader>
                <CardTitle>Convert a quantity</CardTitle>
                <CardDescription>Convert between active units of measure in this organization.</CardDescription>
            </CardHeader>
            <CardContent>
                { unitsQuery.isError ? (
                    <p className="text-sm text-(--muted)">Units are unavailable. Retry from the notification.</p>
                ) : unitsQuery.isPending ? (
                    <div className="flex items-center gap-2 py-3 text-sm text-(--muted)" aria-live="polite">
                        <Spinner className="size-4 text-(--accent)" aria-label="Loading units of measure" />
                        <span>Loading units…</span>
                    </div>
                ) : !unitsQuery.data?.length ? (
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm text-(--muted)">Add an active unit before converting quantities.</p>
                        <Button asChild variant="pill-ghost" className="bg-(--ink) text-(--paper) hover:bg-(--accent)">
                            <Link to="/inventory/settings/uoms/new">Add unit</Link>
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={ event => { event.preventDefault(); event.stopPropagation(); void form.handleSubmit() } } className="grid gap-4">
                        <FieldGroup className="grid gap-4 sm:grid-cols-2 xl:grid-cols-[minmax(120px,0.7fr)_minmax(180px,1fr)_minmax(180px,1fr)_auto] xl:items-end">
                            <form.Field name="quantity">
                                { field => {
                                    const isInvalid = field.state.meta.errors.length > 0
                                    return (
                                        <Field data-invalid={ isInvalid } className={ fieldClass }>
                                            <FieldLabel htmlFor={ field.name }>Quantity</FieldLabel>
                                            <Input id={ field.name } name={ field.name } type="number" inputMode="decimal" step="any" value={ field.state.value } onBlur={ field.handleBlur } onChange={ event => { convertMutation.reset(); field.handleChange( event.target.value ) } } aria-invalid={ isInvalid } className={ inputClass } disabled={ isPending } />
                                            { isInvalid ? <FieldError errors={ field.state.meta.errors } /> : null }
                                        </Field>
                                    )
                                } }
                            </form.Field>

                            <form.Field name="fromUomId">
                                { field => {
                                    const isInvalid = field.state.meta.errors.length > 0
                                    return (
                                        <Field data-invalid={ isInvalid } className={ fieldClass }>
                                            <FieldLabel htmlFor="uom-convert-from">From unit</FieldLabel>
                                            <Select value={ field.state.value || '__none__' } onValueChange={ value => { convertMutation.reset(); field.handleChange( value === '__none__' ? '' : value ) } } disabled={ isPending }>
                                                <SelectTrigger id="uom-convert-from" className={ inputClass } aria-label="From unit">
                                                    <SelectValue placeholder="Select source unit" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="__none__" disabled>Select source unit</SelectItem>
                                                    { unitsQuery.data.map( unit => <SelectItem key={ unit.id } value={ unit.id }>{ unit.name } · { unit.code }</SelectItem> ) }
                                                </SelectContent>
                                            </Select>
                                            { isInvalid ? <FieldError errors={ field.state.meta.errors } /> : null }
                                        </Field>
                                    )
                                } }
                            </form.Field>

                            <form.Field name="toUomId">
                                { field => {
                                    const isInvalid = field.state.meta.errors.length > 0
                                    return (
                                        <Field data-invalid={ isInvalid } className={ fieldClass }>
                                            <FieldLabel htmlFor="uom-convert-to">To unit</FieldLabel>
                                            <Select value={ field.state.value || '__none__' } onValueChange={ value => { convertMutation.reset(); field.handleChange( value === '__none__' ? '' : value ) } } disabled={ isPending }>
                                                <SelectTrigger id="uom-convert-to" className={ inputClass } aria-label="To unit">
                                                    <SelectValue placeholder="Select destination unit" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="__none__" disabled>Select destination unit</SelectItem>
                                                    { unitsQuery.data.map( unit => <SelectItem key={ unit.id } value={ unit.id }>{ unit.name } · { unit.code }</SelectItem> ) }
                                                </SelectContent>
                                            </Select>
                                            { isInvalid ? <FieldError errors={ field.state.meta.errors } /> : null }
                                        </Field>
                                    )
                                } }
                            </form.Field>

                            <Button type="submit" variant="pill-ghost" className="bg-(--ink) text-(--paper) hover:bg-(--accent) sm:col-span-2 xl:col-span-1" disabled={ isPending }>
                                { isPending ? <Spinner className="size-4 text-current" aria-label="Converting quantity" /> : null }
                                { isPending ? 'Converting…' : 'Convert' }
                            </Button>
                        </FieldGroup>

                        { convertMutation.data ? (
                            <p className="rounded-lg border border-(--rule) bg-(--paper-2) px-4 py-3 text-sm text-(--ink-soft)" aria-live="polite">
                                { convertMutation.variables?.quantity } { convertedFrom?.name ?? 'Source unit' } equals <strong className="font-semibold text-(--ink)">{ convertMutation.data.converted } { convertedTo?.name ?? 'destination unit' }</strong>
                            </p>
                        ) : null }
                    </form>
                ) }
            </CardContent>
        </Card>
    )
}
