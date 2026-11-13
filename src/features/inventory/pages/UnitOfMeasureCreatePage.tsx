import { useEffect, useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardEyebrow, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { DashboardShell } from '@/src/features/dashboard/components/DashboardShell'
import { useCreateUnitOfMeasure, useUnitsOfMeasure } from '@/src/features/inventory/api/unitsOfMeasure'
import { toastApiError } from '@/src/lib/api-error'

const unitSchema = z.object( {
    code: z.string().trim().min( 1, 'Unit code is required.' ),
    name: z.string().trim().min( 1, 'Unit name is required.' ),
    description: z.string(),
    baseUomId: z.string(),
    conversionFactor: z.string(),
} ).superRefine( ( values, context ) => {
    if ( !values.baseUomId ) return

    const factor = Number( values.conversionFactor )
    if ( !Number.isFinite( factor ) || factor <= 0 ) {
        context.addIssue( { code: 'custom', path: [ 'conversionFactor' ], message: 'Enter a conversion factor greater than zero.' } )
    }
} )

type UnitFormValues = z.infer<typeof unitSchema>

const initialValues: UnitFormValues = {
    code: '',
    name: '',
    description: '',
    baseUomId: '',
    conversionFactor: '1',
}

const inputClass = 'h-11 rounded-[10px] border-(--rule) bg-(--card) px-3.5 text-sm placeholder:text-(--muted-2) focus-visible:border-(--ink) focus-visible:ring-(--ink)/10'
const fieldClass = 'gap-1.5 text-xs font-medium text-(--ink-soft)'

export function UnitOfMeasureCreatePage () {
    const [ selectedBaseUomId, setSelectedBaseUomId ] = useState( '' )
    const navigate = useNavigate()
    const createMutation = useCreateUnitOfMeasure()
    const unitsQuery = useUnitsOfMeasure( { activeOnly: true } )
    const isPending = createMutation.isPending

    useEffect( () => {
        const toastId = 'uom-create-base-units-error'

        if ( unitsQuery.isError ) {
            toastApiError( unitsQuery.error, 'Base units could not be loaded. Check your connection and try again.', { 403: 'You do not have permission to view units of measure. Ask an administrator for inventory:read access.' }, {
                id: toastId,
                action: { label: 'Retry', onClick: () => { void unitsQuery.refetch() } },
            } )
        } else {
            toast.dismiss( toastId )
        }
    }, [ unitsQuery.error, unitsQuery.isError, unitsQuery.refetch ] )

    const form = useForm( {
        defaultValues: initialValues,
        validators: { onSubmit: unitSchema },
        onSubmit: ( { value } ) => {
            const body = {
                code: value.code.trim(),
                name: value.name.trim(),
                description: value.description.trim() || undefined,
                baseUomId: value.baseUomId || null,
                ...( value.baseUomId ? { conversionFactor: Number( value.conversionFactor ) } : {} ),
            }

            createMutation.mutate( body, {
                onSuccess: created => {
                    toast.success( 'Unit created', { description: `${ created.name } is ready to use.` } )
                    navigate( { to: '/inventory/settings/uoms/$uomId', params: { uomId: created.id } } )
                },
                onError: error => toastApiError( error, 'The unit could not be created. Check your connection and try again.', { 403: 'You do not have permission to create units of measure. Ask an administrator for inventory:write access.' } ),
            } )
        },
    } )

    return (
        <DashboardShell>
            <div className="w-full max-w-3xl">
                <header className="mb-7 border-b border-(--rule) pb-6">
                    <h1 className="font-display text-[clamp(36px,4vw,48px)] font-light leading-none tracking-[-0.03em]">Add a unit of measure</h1>
                    <p className="mt-2.5 max-w-2xl text-[15px] text-(--ink-soft)">Define a unit or set its conversion to an existing base unit.</p>
                </header>

                <Card>
                    <CardHeader>
                        <CardEyebrow>Unit setup</CardEyebrow>
                        <CardTitle>Unit details</CardTitle>
                        <CardDescription>Codes and names identify this unit throughout inventory.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={ event => { event.preventDefault(); event.stopPropagation(); void form.handleSubmit() } } className="grid gap-5">
                            <FieldGroup className="grid gap-5 sm:grid-cols-2">
                                <form.Field name="code">
                                    { field => {
                                        const isInvalid = field.state.meta.errors.length > 0
                                        return (
                                            <Field data-invalid={ isInvalid } className={ fieldClass }>
                                                <FieldLabel htmlFor={ field.name }>Code <span className="text-(--accent)">*</span></FieldLabel>
                                                <Input id={ field.name } name={ field.name } value={ field.state.value } onBlur={ field.handleBlur } onChange={ event => field.handleChange( event.target.value ) } aria-invalid={ isInvalid } className={ inputClass } placeholder="BOX" required disabled={ isPending } />
                                                { isInvalid ? <FieldError errors={ field.state.meta.errors } /> : null }
                                            </Field>
                                        )
                                    } }
                                </form.Field>
                                <form.Field name="name">
                                    { field => {
                                        const isInvalid = field.state.meta.errors.length > 0
                                        return (
                                            <Field data-invalid={ isInvalid } className={ fieldClass }>
                                                <FieldLabel htmlFor={ field.name }>Name <span className="text-(--accent)">*</span></FieldLabel>
                                                <Input id={ field.name } name={ field.name } value={ field.state.value } onBlur={ field.handleBlur } onChange={ event => field.handleChange( event.target.value ) } aria-invalid={ isInvalid } className={ inputClass } placeholder="Box" required disabled={ isPending } />
                                                { isInvalid ? <FieldError errors={ field.state.meta.errors } /> : null }
                                            </Field>
                                        )
                                    } }
                                </form.Field>
                            </FieldGroup>

                            <form.Field name="description">
                                { field => (
                                    <Field className={ fieldClass }>
                                        <FieldLabel htmlFor={ field.name }>Description</FieldLabel>
                                        <Textarea id={ field.name } name={ field.name } value={ field.state.value } onBlur={ field.handleBlur } onChange={ event => field.handleChange( event.target.value ) } className="min-h-24 resize-y rounded-[10px] border border-(--rule) bg-(--card) px-3.5 py-3 text-sm placeholder:text-(--muted-2) focus-visible:border-(--ink) focus-visible:ring-(--ink)/10" placeholder="Optional description" disabled={ isPending } />
                                    </Field>
                                ) }
                            </form.Field>

                            <FieldGroup className="grid gap-5 sm:grid-cols-2">
                                <form.Field name="baseUomId">
                                    { field => (
                                        <Field className={ fieldClass }>
                                            <FieldLabel htmlFor="uom-base-unit">Base unit</FieldLabel>
                                            <Select value={ field.state.value || '__none__' } onValueChange={ value => {
                                                const baseUomId = value === '__none__' ? '' : value
                                                field.handleChange( baseUomId )
                                                setSelectedBaseUomId( baseUomId )
                                            } } disabled={ isPending || unitsQuery.isPending || unitsQuery.isError }>
                                                <SelectTrigger id="uom-base-unit" className={ inputClass } aria-label="Base unit">
                                                    <SelectValue placeholder={ unitsQuery.isPending ? 'Loading units…' : 'Select a base unit' } />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="__none__">No base unit</SelectItem>
                                                    { ( unitsQuery.data ?? [] ).map( unit => <SelectItem key={ unit.id } value={ unit.id }>{ unit.name } · { unit.code }</SelectItem> ) }
                                                </SelectContent>
                                            </Select>
                                            <FieldDescription>Leave empty to create a base unit.</FieldDescription>
                                        </Field>
                                    ) }
                                </form.Field>
                                <form.Field name="conversionFactor">
                                    { field => {
                                        const isInvalid = field.state.meta.errors.length > 0
                                        const hasBaseUnit = Boolean( selectedBaseUomId )
                                        return (
                                            <Field data-invalid={ isInvalid } className={ fieldClass }>
                                                <FieldLabel htmlFor={ field.name }>Conversion factor</FieldLabel>
                                                <Input id={ field.name } name={ field.name } type="number" inputMode="decimal" min="0" step="any" value={ hasBaseUnit ? field.state.value : '1' } onBlur={ field.handleBlur } onChange={ event => field.handleChange( event.target.value ) } aria-invalid={ isInvalid } className={ inputClass } disabled={ isPending || !hasBaseUnit } />
                                                <FieldDescription>How many base units are in one of this unit.</FieldDescription>
                                                { isInvalid ? <FieldError errors={ field.state.meta.errors } /> : null }
                                            </Field>
                                        )
                                    } }
                                </form.Field>
                            </FieldGroup>

                            <div className="flex justify-end">
                                <Button type="submit" variant="pill-ghost" className="bg-(--ink) text-(--paper) hover:bg-(--accent)" disabled={ isPending }>
                                    { isPending ? <Spinner className="size-4 text-current" aria-label="Creating unit" /> : null }
                                    { isPending ? 'Creating…' : 'Create unit' }
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </DashboardShell>
    )
}
