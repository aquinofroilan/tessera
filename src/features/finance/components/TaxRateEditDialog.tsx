import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { Check, X } from '@/components/ui/hugeicons'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { useUpdateTaxRate } from '@/src/features/finance/api/taxRates'
import type { TaxRateResponse } from '@/src/features/finance/types/taxRates'
import { toastApiError } from '@/src/lib/api-error'

const taxRateSchema = z.object( {
    name: z.string().trim().min( 1, 'Tax rate name is required' ),
    percentage: z.string().trim().min( 1, 'Percentage is required' ).refine( value => Number.isFinite( Number( value ) ) && Number( value ) > 0, 'Enter a percentage greater than zero' ),
    authority: z.string().trim().min( 1, 'Tax authority is required' ),
} )

type TaxRateEditDialogProps = Readonly<{
    rate: TaxRateResponse
    onOpenChange: ( open: boolean ) => void
}>

const inputClass = 'h-11 rounded-[10px] border-(--rule) bg-(--card) px-3.5 text-sm placeholder:text-(--muted-2) focus-visible:border-(--ink) focus-visible:ring-(--ink)/10'

export function TaxRateEditDialog ( { rate, onOpenChange }: TaxRateEditDialogProps ) {
    const updateMutation = useUpdateTaxRate()
    const isPending = updateMutation.isPending
    const form = useForm( {
        defaultValues: {
            name: rate.name,
            percentage: String( rate.percentage ),
            authority: rate.authority,
        },
        validators: { onSubmit: taxRateSchema },
        onSubmit: ( { value } ) => {
            if ( isPending ) return
            updateMutation.mutate( {
                id: rate.id,
                body: {
                    name: value.name.trim(),
                    percentage: Number( value.percentage ),
                    authority: value.authority.trim(),
                },
            }, {
                onSuccess: updated => {
                    toast.success( 'Tax rate updated', { description: `${ updated.name } has been saved.` } )
                    onOpenChange( false )
                },
                onError: error => toastApiError( error, 'The tax rate could not be updated. Check your connection and try again.', { 403: 'You do not have permission to update tax rates. Ask an administrator for tax:create access.' } ),
            } )
        },
    } )

    return (
        <Dialog open onOpenChange={ open => { if ( !open && !isPending ) onOpenChange( false ) } }>
            <DialogContent className="top-[12%] max-h-[80dvh] overflow-y-auto duration-200 sm:max-w-xl">
                <div className="grid gap-1.5 pr-7">
                    <DialogTitle className="font-display text-2xl font-normal">Edit tax rate</DialogTitle>
                    <DialogDescription>Update the rate details. Its code remains fixed after creation.</DialogDescription>
                </div>
                <form onSubmit={ event => { event.preventDefault(); event.stopPropagation(); void form.handleSubmit() } } className="grid gap-5">
                    <FieldGroup className="grid gap-4">
                        <form.Field name="name">
                            { field => {
                                const isInvalid = field.state.meta.errors.length > 0
                                return (
                                    <Field data-invalid={ isInvalid }>
                                        <FieldLabel htmlFor={ `tax-rate-${ rate.id }-name` }>Name <span className="text-(--accent)">*</span></FieldLabel>
                                        <Input id={ `tax-rate-${ rate.id }-name` } name={ field.name } value={ field.state.value } onBlur={ field.handleBlur } onChange={ event => field.handleChange( event.target.value ) } aria-invalid={ isInvalid } className={ inputClass } disabled={ isPending } />
                                        { isInvalid ? <FieldError errors={ field.state.meta.errors } /> : null }
                                    </Field>
                                )
                            } }
                        </form.Field>
                        <Field>
                            <FieldLabel htmlFor={ `tax-rate-${ rate.id }-code` }>Code</FieldLabel>
                            <Input id={ `tax-rate-${ rate.id }-code` } value={ rate.code } readOnly aria-readonly="true" className={ `${ inputClass } font-mono` } />
                            <FieldDescription>Tax rate codes cannot be changed.</FieldDescription>
                        </Field>
                        <form.Field name="percentage">
                            { field => {
                                const isInvalid = field.state.meta.errors.length > 0
                                return (
                                    <Field data-invalid={ isInvalid }>
                                        <FieldLabel htmlFor={ `tax-rate-${ rate.id }-percentage` }>Percentage <span className="text-(--accent)">*</span></FieldLabel>
                                        <div className="relative">
                                            <Input id={ `tax-rate-${ rate.id }-percentage` } name={ field.name } type="number" min="0" step="any" inputMode="decimal" value={ field.state.value } onBlur={ field.handleBlur } onChange={ event => field.handleChange( event.target.value ) } aria-invalid={ isInvalid } className={ `${ inputClass } pr-10` } disabled={ isPending } />
                                            <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-sm text-(--muted)" aria-hidden="true">%</span>
                                        </div>
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
                                        <FieldLabel htmlFor={ `tax-rate-${ rate.id }-authority` }>Tax authority <span className="text-(--accent)">*</span></FieldLabel>
                                        <Input id={ `tax-rate-${ rate.id }-authority` } name={ field.name } value={ field.state.value } onBlur={ field.handleBlur } onChange={ event => field.handleChange( event.target.value ) } aria-invalid={ isInvalid } className={ inputClass } disabled={ isPending } />
                                        { isInvalid ? <FieldError errors={ field.state.meta.errors } /> : null }
                                    </Field>
                                )
                            } }
                        </form.Field>
                    </FieldGroup>
                    <div className="flex justify-end gap-2 border-t border-(--rule-soft) pt-4">
                        <Button type="button" variant="pill-ghost" onClick={ () => onOpenChange( false ) } disabled={ isPending }><X size={ 15 } />Cancel</Button>
                        <Button type="submit" variant="pill-ghost" className="bg-(--ink) text-(--paper) hover:bg-(--accent)" disabled={ isPending }>
                            { isPending ? <Spinner className="size-4 text-current" aria-label="Saving tax rate" /> : <Check size={ 15 } /> }
                            { isPending ? 'Saving…' : 'Save changes' }
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
