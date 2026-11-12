import { useForm } from '@tanstack/react-form'
import { useNavigate, Link } from '@tanstack/react-router'
import { z } from 'zod'
import { toast } from 'sonner'
import { Plus } from '@/components/ui/hugeicons'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { TaxRateCombobox } from '@/src/features/finance/components/TaxRateCombobox'
import { useCreateTaxGroup } from '@/src/features/finance/api/taxGroups'
import { useTaxRates } from '@/src/features/finance/api/taxRates'
import { getApiErrorMessage } from '@/src/lib/api-error'

const taxGroupSchema = z.object( {
    name: z.string().trim().min( 1, 'Tax group name is required' ),
    code: z.string().trim().min( 1, 'Tax group code is required' ),
    taxRateIds: z.array( z.uuid( 'Choose valid tax rates' ) ).min( 1, 'Select at least one tax rate' ),
} )

type TaxGroupFormValues = z.infer<typeof taxGroupSchema>

const defaultValues: TaxGroupFormValues = {
    name: '',
    code: '',
    taxRateIds: [],
}

const textInputClass = 'h-11 rounded-[10px] border-(--rule) bg-(--card) px-3.5 text-sm placeholder:text-(--muted-2) focus-visible:border-(--ink) focus-visible:ring-(--ink)/10'

function getCreateErrorMessage ( error: unknown ) {
    return getApiErrorMessage( error, 'The tax group could not be created. Check your connection and try again.', {
        403: 'You do not have permission to create tax groups. Ask an administrator for tax:create access.',
    } )
}

function getTaxRatesErrorMessage ( error: unknown ) {
    return getApiErrorMessage( error, 'Tax rates could not be loaded. Check your connection and try again.', {
        403: 'You do not have permission to read tax rates. Ask an administrator for tax:read access.',
    } )
}

export function TaxGroupCreateForm () {
    const navigate = useNavigate()
    const createMutation = useCreateTaxGroup()
    const taxRatesQuery = useTaxRates( { activeOnly: true } )
    const isPending = createMutation.isPending
    const taxRates = taxRatesQuery.data ?? []

    const form = useForm( {
        defaultValues,
        validators: { onSubmit: taxGroupSchema },
        onSubmit: ( { value } ) => {
            if ( isPending || taxRatesQuery.isPending || taxRatesQuery.isError || !taxRates.length ) return

            createMutation.mutate( {
                name: value.name.trim(),
                code: value.code.trim(),
                taxRateIds: value.taxRateIds,
            }, {
                onSuccess: createdGroup => {
                    toast.success( 'Tax group created', { description: `${ createdGroup.name } is ready to use.` } )
                    void navigate( { to: '/finance/tax/groups' } )
                },
            } )
        },
    } )

    return (
        <div className="w-full">
            <div className="mb-6">
                <h1 className="font-display text-[clamp(34px,4vw,48px)] font-light leading-tight tracking-[-.035em]">Create a tax group</h1>
                <p className="mt-2 max-w-2xl text-sm text-(--ink-soft)">Combine organization tax rates into a group for products and transactions.</p>
            </div>

            { createMutation.isError ? (
                <div className="mb-5 rounded-xl border border-(--accent)/25 bg-(--accent-soft) p-4 text-sm text-(--accent-deep)" role="alert">
                    { getCreateErrorMessage( createMutation.error ) }
                </div>
            ) : null }

            <form
                onSubmit={ event => {
                    event.preventDefault()
                    event.stopPropagation()
                    void form.handleSubmit()
                } }
                className="grid w-full gap-5"
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Group details</CardTitle>
                        <CardDescription>Give this group a clear name and code.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FieldGroup className="grid gap-5 sm:grid-cols-2">
                            <form.Field name="name">
                                { field => {
                                    const isInvalid = field.state.meta.errors.length > 0
                                    return (
                                        <Field data-invalid={ isInvalid }>
                                            <FieldLabel htmlFor={ field.name }>Name <span className="text-(--accent)">*</span></FieldLabel>
                                            <Input id={ field.name } name={ field.name } value={ field.state.value } onBlur={ field.handleBlur } onChange={ event => field.handleChange( event.target.value ) } aria-invalid={ isInvalid } className={ textInputClass } placeholder="Standard VAT" disabled={ isPending } />
                                            { isInvalid ? <FieldError errors={ field.state.meta.errors } /> : null }
                                        </Field>
                                    )
                                } }
                            </form.Field>
                            <form.Field name="code">
                                { field => {
                                    const isInvalid = field.state.meta.errors.length > 0
                                    return (
                                        <Field data-invalid={ isInvalid }>
                                            <FieldLabel htmlFor={ field.name }>Code <span className="text-(--accent)">*</span></FieldLabel>
                                            <Input id={ field.name } name={ field.name } value={ field.state.value } onBlur={ field.handleBlur } onChange={ event => field.handleChange( event.target.value ) } aria-invalid={ isInvalid } className={ `${ textInputClass } font-mono` } placeholder="VAT-STD" disabled={ isPending } />
                                            { isInvalid ? <FieldError errors={ field.state.meta.errors } /> : null }
                                        </Field>
                                    )
                                } }
                            </form.Field>
                        </FieldGroup>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Tax rates</CardTitle>
                        <CardDescription>Select one or more active tax rates from this organization.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        { taxRatesQuery.isPending ? (
                            <div className="flex items-center gap-2 py-5 text-sm text-(--muted)" aria-live="polite">
                                <Spinner className="size-4 text-(--accent)" aria-label="Loading tax rates" />
                                <span>Loading tax rates…</span>
                            </div>
                        ) : taxRatesQuery.isError ? (
                            <div className="flex flex-col items-start gap-3 rounded-lg border border-(--accent)/20 bg-(--accent-soft)/50 p-4" role="alert">
                                <p className="text-sm text-(--accent-deep)">{ getTaxRatesErrorMessage( taxRatesQuery.error ) }</p>
                                <Button type="button" variant="pill-ghost" className="border border-(--rule)" onClick={ () => { void taxRatesQuery.refetch() } }>Retry</Button>
                            </div>
                        ) : taxRates.length === 0 ? (
                            <div className="grid justify-items-start gap-3">
                                <FieldDescription>No active tax rates are configured for this organization. Add a tax rate before creating a group.</FieldDescription>
                                <Button asChild type="button" variant="pill-ghost" className="border border-(--rule)">
                                    <Link to="/finance/tax/rates/new"><Plus size={ 15 } />Create a tax rate</Link>
                                </Button>
                            </div>
                        ) : (
                            <form.Field name="taxRateIds">
                                { field => {
                                    const isInvalid = field.state.meta.errors.length > 0
                                    return (
                                        <Field data-invalid={ isInvalid }>
                                            <FieldSet aria-invalid={ isInvalid }>
                                                <FieldLegend variant="label">Select tax rates <span className="text-(--accent)">*</span></FieldLegend>
                                                <TaxRateCombobox
                                                    id={ field.name }
                                                    value={ field.state.value }
                                                    rates={ taxRates }
                                                    onBlur={ field.handleBlur }
                                                    onValueChange={ field.handleChange }
                                                    disabled={ isPending }
                                                    invalid={ isInvalid }
                                                />
                                                <FieldDescription>Choose at least one tax rate. Combined rate is calculated by the server.</FieldDescription>
                                            </FieldSet>
                                            { isInvalid ? <FieldError errors={ field.state.meta.errors } /> : null }
                                        </Field>
                                    )
                                } }
                            </form.Field>
                        ) }
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-2">
                    <Button type="button" variant="pill-ghost" className="border border-(--rule)" onClick={ () => { void navigate( { to: '/finance/tax/groups' } ) } } disabled={ isPending }>
                        Cancel
                    </Button>
                    <Button type="submit" variant="pill-ghost" className="bg-(--ink) text-(--paper) hover:bg-(--accent)" disabled={ isPending || taxRatesQuery.isPending || taxRatesQuery.isError || !taxRates.length }>
                        { isPending ? <Spinner className="size-4 text-current" aria-label="Creating tax group" /> : <Plus size={ 15 } /> }
                        { isPending ? 'Creating…' : 'Create tax group' }
                    </Button>
                </div>
            </form>
        </div>
    )
}
