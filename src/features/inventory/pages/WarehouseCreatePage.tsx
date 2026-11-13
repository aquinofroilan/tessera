import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { toast } from 'sonner'
import { Plus } from '@/components/ui/hugeicons'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardEyebrow, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { DashboardShell } from '@/src/features/dashboard/components/DashboardShell'
import { useCreateWarehouse } from '@/src/features/inventory/api/warehouses'
import { toastApiError } from '@/src/lib/api-error'

const warehouseSchema = z.object( {
    code: z.string().trim().min( 1, 'Warehouse code is required.' ),
    name: z.string().trim().min( 1, 'Warehouse name is required.' ),
    description: z.string(),
    addressLine: z.string(),
    city: z.string(),
    country: z.string(),
    allowNegativeStock: z.boolean(),
} )

type WarehouseFormValues = z.infer<typeof warehouseSchema>

const defaultValues: WarehouseFormValues = {
    code: '',
    name: '',
    description: '',
    addressLine: '',
    city: '',
    country: '',
    allowNegativeStock: false,
}

const inputClass = 'h-11 rounded-[10px] border-(--rule) bg-(--card) px-3.5 text-sm placeholder:text-(--muted-2) focus-visible:border-(--ink) focus-visible:ring-(--ink)/10'
const fieldClass = 'gap-1.5 text-xs font-medium text-(--ink-soft)'

export function WarehouseCreatePage () {
    const navigate = useNavigate()
    const createMutation = useCreateWarehouse()

    const form = useForm( {
        defaultValues,
        validators: { onSubmit: warehouseSchema },
        onSubmit: ( { value } ) => {
            createMutation.mutate( {
                code: value.code.trim(),
                name: value.name.trim(),
                description: value.description.trim() || undefined,
                addressLine: value.addressLine.trim() || undefined,
                city: value.city.trim() || undefined,
                country: value.country.trim() || undefined,
                allowNegativeStock: value.allowNegativeStock,
            }, {
                onSuccess: warehouse => {
                    toast.success( 'Warehouse created', { description: `${ warehouse.name } is ready to use.` } )
                    void navigate( { to: '/inventory/warehouses/$warehouseId', params: { warehouseId: warehouse.id } } )
                },
                onError: error => toastApiError( error, 'The warehouse could not be created. Check your connection and try again.', { 403: 'You do not have permission to create warehouses. Ask an administrator for inventory:write access.' } ),
            } )
        },
    } )

    const isPending = createMutation.isPending

    return (
        <DashboardShell>
            <div className="w-full max-w-4xl">
                <header className="mb-7 border-b border-(--rule) pb-6">
                    <h1 className="font-display text-[clamp(36px,4vw,48px)] font-light leading-none tracking-[-0.03em]">Add a warehouse</h1>
                    <p className="mt-2.5 max-w-2xl text-[15px] text-(--ink-soft)">Set up a facility and define whether it can hold stock below zero.</p>
                </header>

                <Card>
                    <CardHeader>
                        <CardEyebrow>Warehouse setup</CardEyebrow>
                        <CardTitle>Facility details</CardTitle>
                        <CardDescription>Warehouse codes are used to identify facilities across inventory workflows.</CardDescription>
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
                                                <Input id={ field.name } name={ field.name } value={ field.state.value } onBlur={ field.handleBlur } onChange={ event => field.handleChange( event.target.value ) } aria-invalid={ isInvalid } className={ `${ inputClass } font-mono` } placeholder="MAIN" required disabled={ isPending } />
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
                                                <Input id={ field.name } name={ field.name } value={ field.state.value } onBlur={ field.handleBlur } onChange={ event => field.handleChange( event.target.value ) } aria-invalid={ isInvalid } className={ inputClass } placeholder="Main Warehouse" required disabled={ isPending } />
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
                                        <Textarea id={ field.name } name={ field.name } value={ field.state.value } onBlur={ field.handleBlur } onChange={ event => field.handleChange( event.target.value ) } className="min-h-24 resize-y rounded-[10px] border border-(--rule) bg-(--card) px-3.5 py-3 text-sm placeholder:text-(--muted-2) focus-visible:border-(--ink) focus-visible:ring-(--ink)/10" placeholder="Primary storage facility" disabled={ isPending } />
                                    </Field>
                                ) }
                            </form.Field>

                            <FieldGroup className="grid gap-5 sm:grid-cols-3">
                                <form.Field name="addressLine">
                                    { field => (
                                        <Field className={ fieldClass }>
                                            <FieldLabel htmlFor={ field.name }>Address line</FieldLabel>
                                            <Input id={ field.name } name={ field.name } value={ field.state.value } onBlur={ field.handleBlur } onChange={ event => field.handleChange( event.target.value ) } className={ inputClass } placeholder="100 Example Street" disabled={ isPending } />
                                        </Field>
                                    ) }
                                </form.Field>
                                <form.Field name="city">
                                    { field => (
                                        <Field className={ fieldClass }>
                                            <FieldLabel htmlFor={ field.name }>City</FieldLabel>
                                            <Input id={ field.name } name={ field.name } value={ field.state.value } onBlur={ field.handleBlur } onChange={ event => field.handleChange( event.target.value ) } className={ inputClass } placeholder="Manila" disabled={ isPending } />
                                        </Field>
                                    ) }
                                </form.Field>
                                <form.Field name="country">
                                    { field => (
                                        <Field className={ fieldClass }>
                                            <FieldLabel htmlFor={ field.name }>Country</FieldLabel>
                                            <Input id={ field.name } name={ field.name } value={ field.state.value } onBlur={ field.handleBlur } onChange={ event => field.handleChange( event.target.value ) } className={ inputClass } placeholder="PH" disabled={ isPending } />
                                        </Field>
                                    ) }
                                </form.Field>
                            </FieldGroup>

                            <form.Field name="allowNegativeStock">
                                { field => (
                                    <div className="flex items-center justify-between gap-4 rounded-xl border border-(--rule) bg-(--paper) p-3.5">
                                        <div className="grid gap-0.5">
                                            <FieldLabel htmlFor="warehouse-allow-negative" className="cursor-pointer">Allow negative stock</FieldLabel>
                                            <FieldDescription>Allow stock transactions that take this warehouse below zero.</FieldDescription>
                                        </div>
                                        <Switch id="warehouse-allow-negative" checked={ field.state.value } onCheckedChange={ field.handleChange } disabled={ isPending } aria-label="Allow negative stock" />
                                    </div>
                                ) }
                            </form.Field>

                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="pill-ghost" className="border border-(--rule)" onClick={ () => { void navigate( { to: '/inventory/warehouses' } ) } } disabled={ isPending }>Cancel</Button>
                                <Button type="submit" variant="pill-ghost" className="bg-(--ink) text-(--paper) hover:bg-(--accent)" disabled={ isPending }>
                                    { isPending ? <Spinner className="size-4 text-current" aria-label="Creating warehouse" /> : <Plus size={ 15 } aria-hidden="true" /> }
                                    { isPending ? 'Creating…' : 'Create warehouse' }
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </DashboardShell>
    )
}
