import { toast } from 'sonner'
import { Trash2 } from '@/components/ui/hugeicons'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Spinner } from '@/components/ui/spinner'
import { useDeactivateTaxRate } from '@/src/features/finance/api/taxRates'
import type { TaxRateResponse } from '@/src/features/finance/types/taxRates'
import { getApiErrorMessage } from '@/src/lib/api-error'

type TaxRateDeactivateDialogProps = Readonly<{
    rate: TaxRateResponse
    onOpenChange: ( open: boolean ) => void
}>

export function TaxRateDeactivateDialog ( { rate, onOpenChange }: TaxRateDeactivateDialogProps ) {
    const mutation = useDeactivateTaxRate()

    const deactivate = () => {
        mutation.mutate( rate.id, {
            onSuccess: () => {
                toast.success( 'Tax rate deactivated', { description: `${ rate.name } is no longer available for new tax groups.` } )
                onOpenChange( false )
            },
            onError: error => toast.error( 'Could not deactivate tax rate', { description: getApiErrorMessage( error, 'The tax rate could not be deactivated. Check your connection and try again.', { 403: 'You do not have permission to deactivate tax rates. Ask an administrator for tax:delete access.' } ) } ),
        } )
    }

    return (
        <Dialog open onOpenChange={ open => { if ( !open && !mutation.isPending ) onOpenChange( false ) } }>
            <DialogContent className="top-[20%]">
                <div className="grid gap-1.5 pr-7">
                    <DialogTitle className="font-display text-2xl font-normal">Deactivate tax rate?</DialogTitle>
                    <DialogDescription>
                        <span className="font-medium text-(--ink)">{ rate.name }</span> will no longer be available for new tax groups. Existing records remain available for reference.
                    </DialogDescription>
                </div>
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="pill-ghost" className="border border-(--rule)" onClick={ () => onOpenChange( false ) } disabled={ mutation.isPending }>Cancel</Button>
                    <Button type="button" variant="pill-ghost" className="bg-(--accent) text-(--paper) hover:bg-(--accent-deep)" onClick={ deactivate } disabled={ mutation.isPending }>
                        { mutation.isPending ? <Spinner className="size-4 text-current" aria-label="Deactivating tax rate" /> : <Trash2 size={ 15 } /> }
                        { mutation.isPending ? 'Deactivating…' : 'Deactivate rate' }
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
