import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { Pencil } from '@/components/ui/hugeicons'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Spinner } from '@/components/ui/spinner'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useUpdateWarehouse } from '@/src/features/inventory/api/warehouses'
import type { WarehouseResponse } from '@/src/features/inventory/types/warehouses'
import { toastApiError } from '@/src/lib/api-error'

type WarehouseEditSheetProps = Readonly<{
    warehouse: WarehouseResponse
}>

const warehouseSchema = z.object( {
    name: z.string().trim().min( 1, 'Warehouse name is required.' ),
    description: z.string(),
    addressLine: z.string(),
    city: z.string(),
    country: z.string(),
    allowNegativeStock: z.boolean(),
} )

type WarehouseFormValues = z.infer<typeof warehouseSchema>

const inputClass = 'h-11 rounded-[10px] border-(--rule) bg-(--card) px-3.5 text-sm placeholder:text-(--muted-2) focus-visible:border-(--ink) focus-visible:ring-(--ink)/10'
const fieldClass = 'gap-1.5 text-xs font-medium text-(--ink-soft)'

export function WarehouseEditSheet ( { warehouse }: WarehouseEditSheetProps ) {
    const [ open, setOpen ] = useState( false )
    const updateMutation = useUpdateWarehouse( warehouse.id )

    const form = useForm( {
        defaultValues: {
            name: warehouse.name,
            description: warehouse.description ?? '',
            addressLine: warehouse.addressLine ?? '',
            city: warehouse.city ?? '',
            country: warehouse.country ?? '',
            allowNegativeStock: warehouse.allowNegativeStock,
        },
        validators: { onSubmit: warehouseSchema },
        onSubmit: ( { value } ) => {
            updateMutation.mutate( {
                name: value.name.trim(),
                description: value.description.trim() || null,
                addressLine: value.addressLine.trim() || null,
                city: value.city.trim() || null,
                country: value.country.trim() || null,
                allowNegativeStock: value.allowNegativeStock,
            }, {
                onSuccess: updated => {
                    toast.success( 'Warehouse updated', { description: `${ updated.name } has been saved.` } )
                    setOpen( false )
                },
                onError: error => toastApiError( error, 'Warehouse changes could not be saved. Check your connection and try again.', { 403: 'You do not have permission to update warehouses. Ask an administrator for inventory:write access.' } ),
            } )
        },
    } )

    const openEditor = () => {
        form.reset()
        form.setFieldValue( 'name', warehouse.name )
        form.setFieldValue( 'description', warehouse.description ?? '' )
        form.setFieldValue( 'addressLine', warehouse.addressLine ?? '' )
        form.setFieldValue( 'city', warehouse.city ?? '' )
        form.setFieldValue( 'country', warehouse.country ?? '' )
        form.setFieldValue( 'allowNegativeStock', warehouse.allowNegativeStock )
        updateMutation.reset()
        setOpen( true )
    }

    const isPending = updateMutation.isPending

    return (
        <>
            <Button type="button" variant="pill-ghost" className="bg-(--ink) text-(--paper) hover:bg-(--accent)" onClick={ openEditor }>
                <Pencil size={ 15 } aria-hidden="true" />Edit warehouse
            </Button>
            <Sheet open={ open } onOpenChange={ nextOpen => { if ( !isPending ) setOpen( nextOpen ) } }>
                <SheetContent side="right" className="overflow-y-auto p-0 data-[side=right]:max-w-2xl" aria-describedby="warehouse-edit-description">
                    <form onSubmit={ event => { event.preventDefault(); event.stopPropagation(); void form.handleSubmit() } } className="flex min-h-full flex-col">
                        <SheetHeader>
                            <SheetTitle>Edit warehouse</SheetTitle>
                            <SheetDescription id="warehouse-edit-description">Update details for { warehouse.name }.</SheetDescription>
                        </SheetHeader>
                        <div className="flex-1 space-y-5 p-6">
                            <Field className={ fieldClass }>
                                <FieldLabel htmlFor="warehouse-edit-code">Code</FieldLabel>
                                <Input id="warehouse-edit-code" value={ warehouse.code } className={ `${ inputClass } font-mono` } disabled readOnly />
                                <FieldDescription>The code is set when the warehouse is created.</FieldDescription>
                            </Field>

                            <form.Field name="name">
                                { field => {
                                    const isInvalid = field.state.meta.errors.length > 0
                                    return (
                                        <Field data-invalid={ isInvalid } className={ fieldClass }>
                                            <FieldLabel htmlFor="warehouse-edit-name">Name <span className="text-(--accent)">*</span></FieldLabel>
                                            <Input id="warehouse-edit-name" name={ field.name } value={ field.state.value } onBlur={ field.handleBlur } onChange={ event => field.handleChange( event.target.value ) } aria-invalid={ isInvalid } className={ inputClass } required disabled={ isPending } />
                                            { isInvalid ? <FieldError errors={ field.state.meta.errors } /> : null }
                                        </Field>
                                    )
                                } }
                            </form.Field>

                            <form.Field name="description">
                                { field => (
                                    <Field className={ fieldClass }>
                                        <FieldLabel htmlFor="warehouse-edit-description-field">Description</FieldLabel>
                                        <Textarea id="warehouse-edit-description-field" name={ field.name } value={ field.state.value } onBlur={ field.handleBlur } onChange={ event => field.handleChange( event.target.value ) } className="min-h-24 resize-y rounded-[10px] border border-(--rule) bg-(--card) px-3.5 py-3 text-sm placeholder:text-(--muted-2) focus-visible:border-(--ink) focus-visible:ring-(--ink)/10" disabled={ isPending } />
                                    </Field>
                                ) }
                            </form.Field>

                            <FieldGroup className="grid gap-5 sm:grid-cols-2">
                                <form.Field name="addressLine">
                                    { field => (
                                        <Field className={ fieldClass }>
                                            <FieldLabel htmlFor="warehouse-edit-address">Address line</FieldLabel>
                                            <Input id="warehouse-edit-address" name={ field.name } value={ field.state.value } onBlur={ field.handleBlur } onChange={ event => field.handleChange( event.target.value ) } className={ inputClass } disabled={ isPending } />
                                        </Field>
                                    ) }
                                </form.Field>
                                <form.Field name="city">
                                    { field => (
                                        <Field className={ fieldClass }>
                                            <FieldLabel htmlFor="warehouse-edit-city">City</FieldLabel>
                                            <Input id="warehouse-edit-city" name={ field.name } value={ field.state.value } onBlur={ field.handleBlur } onChange={ event => field.handleChange( event.target.value ) } className={ inputClass } disabled={ isPending } />
                                        </Field>
                                    ) }
                                </form.Field>
                                <form.Field name="country">
                                    { field => (
                                        <Field className={ fieldClass }>
                                            <FieldLabel htmlFor="warehouse-edit-country">Country</FieldLabel>
                                            <Input id="warehouse-edit-country" name={ field.name } value={ field.state.value } onBlur={ field.handleBlur } onChange={ event => field.handleChange( event.target.value ) } className={ inputClass } placeholder="PH" disabled={ isPending } />
                                        </Field>
                                    ) }
                                </form.Field>
                            </FieldGroup>

                            <form.Field name="allowNegativeStock">
                                { field => (
                                    <div className="flex items-center justify-between gap-4 rounded-xl border border-(--rule) bg-(--paper) p-3.5">
                                        <div className="grid gap-0.5">
                                            <FieldLabel htmlFor="warehouse-edit-allow-negative" className="cursor-pointer">Allow negative stock</FieldLabel>
                                            <FieldDescription>Allow stock transactions that take this warehouse below zero.</FieldDescription>
                                        </div>
                                        <Switch id="warehouse-edit-allow-negative" checked={ field.state.value } onCheckedChange={ field.handleChange } disabled={ isPending } aria-label="Allow negative stock" />
                                    </div>
                                ) }
                            </form.Field>
                        </div>
                        <div className="flex justify-end gap-2 border-t border-(--rule-soft) p-6">
                            <Button type="button" variant="pill-ghost" className="border border-(--rule)" onClick={ () => setOpen( false ) } disabled={ isPending }>Cancel</Button>
                            <Button type="submit" variant="pill-ghost" className="bg-(--ink) text-(--paper) hover:bg-(--accent)" disabled={ isPending }>
                                { isPending ? <Spinner className="size-4 text-current" aria-label="Saving warehouse" /> : <Pencil size={ 15 } aria-hidden="true" /> }
                                { isPending ? 'Saving…' : 'Save changes' }
                            </Button>
                        </div>
                    </form>
                </SheetContent>
            </Sheet>
        </>
    )
}
