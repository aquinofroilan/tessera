import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { Plus } from '@/components/ui/hugeicons'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { useCreateWarehouseLocation } from '@/src/features/inventory/api/warehouses'
import type { WarehouseLocationResponse, WarehouseLocationType } from '@/src/features/inventory/types/warehouses'
import { toastApiError } from '@/src/lib/api-error'

type WarehouseLocationCreateFormProps = Readonly<{
    warehouseId: string
    locations: WarehouseLocationResponse[]
}>

const locationTypes = [ 'ZONE', 'AISLE', 'RACK', 'SHELF', 'BIN' ] as const

const locationSchema = z.object( {
    code: z.string().trim().min( 1, 'Location code is required.' ),
    type: z.enum( locationTypes ),
    barcode: z.string(),
    parentLocationId: z.string(),
} )

type LocationFormValues = z.infer<typeof locationSchema>

const inputClass = 'h-10 rounded-[10px] border-(--rule) bg-(--card) text-sm placeholder:text-(--muted-2) focus-visible:border-(--ink) focus-visible:ring-(--ink)/10'
const defaultValues: LocationFormValues = { code: '', type: 'BIN', barcode: '', parentLocationId: '' }

export function WarehouseLocationCreateForm ( { warehouseId, locations }: WarehouseLocationCreateFormProps ) {
    const mutation = useCreateWarehouseLocation()

    const form = useForm( {
        defaultValues,
        validators: { onSubmit: locationSchema },
        onSubmit: ( { value } ) => {
            mutation.mutate( {
                warehouseId,
                code: value.code.trim(),
                type: value.type,
                barcode: value.barcode.trim() || undefined,
                parentLocationId: value.parentLocationId || null,
            }, {
                onSuccess: created => {
                    toast.success( 'Location created', { description: `${ created.code } has been added to this warehouse.` } )
                    form.reset()
                },
                onError: error => toastApiError( error, 'The location could not be created. Check your connection and try again.', { 403: 'You do not have permission to create warehouse locations. Ask an administrator for inventory:write access.' } ),
            } )
        },
    } )

    return (
        <form onSubmit={ event => { event.preventDefault(); event.stopPropagation(); void form.handleSubmit() } } className="grid gap-4 border-b border-(--rule) p-5 sm:p-6">
            <FieldGroup className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <form.Field name="code">
                    { field => {
                        const isInvalid = field.state.meta.errors.length > 0
                        return (
                            <Field data-invalid={ isInvalid }>
                                <FieldLabel htmlFor="warehouse-location-code">Location code <span className="text-(--accent)">*</span></FieldLabel>
                                <Input id="warehouse-location-code" name={ field.name } value={ field.state.value } onBlur={ field.handleBlur } onChange={ event => field.handleChange( event.target.value ) } aria-invalid={ isInvalid } className={ inputClass } placeholder="A-01-01" required disabled={ mutation.isPending } />
                                { isInvalid ? <FieldError errors={ field.state.meta.errors } /> : null }
                            </Field>
                        )
                    } }
                </form.Field>

                <form.Field name="type">
                    { field => (
                        <Field>
                            <FieldLabel htmlFor="warehouse-location-type">Location type <span className="text-(--accent)">*</span></FieldLabel>
                            <Select value={ field.state.value } onValueChange={ value => field.handleChange( value as WarehouseLocationType ) } disabled={ mutation.isPending }>
                                <SelectTrigger id="warehouse-location-type" className={ inputClass }><SelectValue /></SelectTrigger>
                                <SelectContent>{ locationTypes.map( type => <SelectItem key={ type } value={ type }>{ type }</SelectItem> ) }</SelectContent>
                            </Select>
                            <FieldDescription>Choose one of the location types supported by Inventory.</FieldDescription>
                        </Field>
                    ) }
                </form.Field>

                <form.Field name="parentLocationId">
                    { field => (
                        <Field>
                            <FieldLabel htmlFor="warehouse-location-parent">Parent location</FieldLabel>
                            <Select value={ field.state.value || '__none__' } onValueChange={ value => field.handleChange( value === '__none__' ? '' : value ) } disabled={ mutation.isPending }>
                                <SelectTrigger id="warehouse-location-parent" className={ inputClass }><SelectValue placeholder="No parent" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="__none__">No parent</SelectItem>
                                    { locations.map( location => <SelectItem key={ location.id } value={ location.id }>{ location.code } · { location.type }</SelectItem> ) }
                                </SelectContent>
                            </Select>
                            <FieldDescription>Choose an existing location in this warehouse, if applicable.</FieldDescription>
                        </Field>
                    ) }
                </form.Field>

                <form.Field name="barcode">
                    { field => (
                        <Field>
                            <FieldLabel htmlFor="warehouse-location-barcode">Barcode</FieldLabel>
                            <Input id="warehouse-location-barcode" name={ field.name } value={ field.state.value } onBlur={ field.handleBlur } onChange={ event => field.handleChange( event.target.value ) } className={ inputClass } placeholder="Optional" disabled={ mutation.isPending } />
                        </Field>
                    ) }
                </form.Field>
            </FieldGroup>
            <div className="flex justify-end">
                <Button type="submit" variant="pill-ghost" size="sm" className="bg-(--ink) text-(--paper) hover:bg-(--accent)" disabled={ mutation.isPending }>
                    { mutation.isPending ? <Spinner className="size-4 text-current" aria-label="Creating location" /> : <Plus size={ 15 } aria-hidden="true" /> }
                    { mutation.isPending ? 'Adding…' : 'Add location' }
                </Button>
            </div>
        </form>
    )
}
