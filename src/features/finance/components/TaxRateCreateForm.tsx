import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { ArrowLeft, Plus } from '@/components/ui/hugeicons'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardEyebrow, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { useCreateTaxRate } from '@/src/features/finance/api/taxRates'
import { toastApiError } from '@/src/lib/api-error'

const taxRateSchema = z.object( {
    name: z.string().trim().min( 1, 'Tax rate name is required' ),
    code: z.string().trim().min( 1, 'Tax rate code is required' ),
    percentage: z.string().trim().min( 1, 'Percentage is required' ).refine( value => Number.isFinite( Number( value ) ) && Number( value ) > 0, 'Enter a percentage greater than zero' ),
    authority: z.string().trim().min( 1, 'Tax authority is required' ),
} )

type TaxRateFormValues = z.infer<typeof taxRateSchema>

const defaultValues: TaxRateFormValues = {
    name: '',
    code: '',
    percentage: '',
    authority: '',
}

const textInputClass = 'h-11 rounded-[10px] border-(--rule) bg-(--card) px-3.5 text-sm placeholder:text-(--muted-2) focus-visible:border-(--ink) focus-visible:ring-(--ink)/10'

export function TaxRateCreateForm () {
    const navigate = useNavigate()
    const createMutation = useCreateTaxRate()
    const isPending = createMutation.isPending

    const form = useForm( {
        defaultValues,
        validators: { onSubmit: taxRateSchema },
        onSubmit: ( { value } ) => {
            if ( isPending ) return
            createMutation.mutate( {
                name: value.name.trim(),
                code: value.code.trim(),
                percentage: Number( value.percentage ),
                authority: value.authority.trim(),
            }, {
                onSuccess: created => {
                    form.reset()
                    toast.success( 'Tax rate created', { description: `${ created.name } is ready to add to a tax group.` } )
                },
                onError: error => toastApiError( error, 'The tax rate could not be created. Check your connection and try again.', { 403: 'You do not have permission to create tax rates. Ask an administrator for tax:create access.' } ),
            } )
        },
    } )

    const returnToPreviousPage = () => {
        if ( window.history.length > 1 ) {
            window.history.back()
            return
        }

        void navigate( { to: '/dashboard' } )
    }

    return (
        <div className="w-full">
            <div className="mb-6">
                <Button type="button" variant="pill-ghost" size="sm" className="mb-5 -ml-2 text-(--ink-soft) hover:bg-(--paper-2)" onClick={ returnToPreviousPage }>
                    <ArrowLeft size={ 15 } />Back
                </Button>
                <h1 className="font-display text-[clamp(34px,4vw,48px)] font-light leading-tight tracking-[-.035em]">Add a tax rate</h1>
                <p className="mt-2 max-w-2xl text-sm text-(--ink-soft)">Create an organization tax rate that can be combined into a tax group.</p>
            </div>

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
                        <CardEyebrow>Rate setup</CardEyebrow>
                        <CardTitle>Tax rate details</CardTitle>
                        <CardDescription>Enter the rate and authority as they should appear in tax groups.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FieldGroup className="grid gap-5 sm:grid-cols-2">
                            <form.Field name="name">
                                { field => {
                                    const isInvalid = field.state.meta.errors.length > 0
                                    return (
                                        <Field data-invalid={ isInvalid }>
                                            <FieldLabel htmlFor={ field.name }>Name <span className="text-(--accent)">*</span></FieldLabel>
                                            <Input id={ field.name } name={ field.name } value={ field.state.value } onBlur={ field.handleBlur } onChange={ event => field.handleChange( event.target.value ) } aria-invalid={ isInvalid } className={ textInputClass } placeholder="State Sales Tax" disabled={ isPending } />
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
                                            <Input id={ field.name } name={ field.name } value={ field.state.value } onBlur={ field.handleBlur } onChange={ event => field.handleChange( event.target.value ) } aria-invalid={ isInvalid } className={ `${ textInputClass } font-mono` } placeholder="STATE-SALES" disabled={ isPending } />
                                            { isInvalid ? <FieldError errors={ field.state.meta.errors } /> : null }
                                        </Field>
                                    )
                                } }
                            </form.Field>
                            <form.Field name="percentage">
                                { field => {
                                    const isInvalid = field.state.meta.errors.length > 0
                                    return (
                                        <Field data-invalid={ isInvalid }>
                                            <FieldLabel htmlFor={ field.name }>Percentage <span className="text-(--accent)">*</span></FieldLabel>
                                            <div className="relative">
                                                <Input id={ field.name } name={ field.name } type="number" min="0" step="any" inputMode="decimal" value={ field.state.value } onBlur={ field.handleBlur } onChange={ event => field.handleChange( event.target.value ) } aria-invalid={ isInvalid } className={ `${ textInputClass } pr-10` } placeholder="6.5" disabled={ isPending } />
                                                <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-sm text-(--muted)" aria-hidden="true">%</span>
                                            </div>
                                            <FieldDescription>Enter a value greater than zero.</FieldDescription>
                                            { isInvalid ? <FieldError errors={ field.state.meta.errors } /> : null }
                                        </Field>
                                    )
                                } }
                            </form.Field>
                            <form.Field name="authority">
                                { field => {
                                    const isInvalid = field.state.meta.errors.length > 0
                                    return (
                                        <Field data-invalid={ isInvalid }>
                                            <FieldLabel htmlFor={ field.name }>Tax authority <span className="text-(--accent)">*</span></FieldLabel>
                                            <Input id={ field.name } name={ field.name } value={ field.state.value } onBlur={ field.handleBlur } onChange={ event => field.handleChange( event.target.value ) } aria-invalid={ isInvalid } className={ textInputClass } placeholder="State Revenue Department" disabled={ isPending } />
                                            { isInvalid ? <FieldError errors={ field.state.meta.errors } /> : null }
                                        </Field>
                                    )
                                } }
                            </form.Field>
                        </FieldGroup>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-2">
                    <Button type="button" variant="pill-ghost" className="border border-(--rule)" onClick={ returnToPreviousPage } disabled={ isPending }>
                        Cancel
                    </Button>
                    <Button type="submit" variant="pill-ghost" className="bg-(--ink) text-(--paper) hover:bg-(--accent)" disabled={ isPending }>
                        { isPending ? <Spinner className="size-4 text-current" aria-label="Creating tax rate" /> : <Plus size={ 15 } /> }
                        { isPending ? 'Creating…' : 'Create tax rate' }
                    </Button>
                </div>
            </form>
        </div>
    )
}
