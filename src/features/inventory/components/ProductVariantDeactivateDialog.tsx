import { useState } from 'react'
import { toast } from 'sonner'
import { Trash2 } from '@/components/ui/hugeicons'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Spinner } from '@/components/ui/spinner'
import { useDeactivateProductVariant } from '@/src/features/inventory/api/productVariants'
import { toastApiError } from '@/src/lib/api-error'

type ProductVariantDeactivateDialogProps = Readonly<{
    productId: string
    variantId: string
    variantName: string
}>

export function ProductVariantDeactivateDialog ( { productId, variantId, variantName }: ProductVariantDeactivateDialogProps ) {
    const [ open, setOpen ] = useState( false )
    const mutation = useDeactivateProductVariant( productId, variantId )

    const deactivate = () => {
        mutation.mutate( undefined, {
            onSuccess: variant => {
                toast.success( 'Variant deactivated', { description: `${ variant.name } is no longer active.` } )
                setOpen( false )
            },
            onError: error => toastApiError( error, 'The variant could not be deactivated. Check your connection and try again.', { 403: 'You do not have permission to deactivate product variants. Ask an administrator for inventory:write access.' } ),
        } )
    }

    return (
        <>
            <Button type="button" variant="pill-ghost" size="sm" className="mt-5 rounded-lg text-(--accent-deep) hover:bg-(--accent-soft) sm:mt-0" onClick={ () => { mutation.reset(); setOpen( true ) } }>
                <Trash2 size={ 15 } aria-hidden="true" />Deactivate variant
            </Button>
            <Dialog open={ open } onOpenChange={ nextOpen => { if ( !mutation.isPending ) setOpen( nextOpen ) } }>
                <DialogContent showCloseButton={ !mutation.isPending } className="top-[20%]">
                    <div className="grid gap-1.5 pr-7">
                        <DialogTitle className="font-display text-2xl font-normal">Deactivate variant?</DialogTitle>
                        <DialogDescription>
                            <span className="font-medium text-(--ink)">{ variantName }</span> will be marked inactive. You can still view it, but it will no longer be available in active inventory workflows.
                        </DialogDescription>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="pill-ghost" className="border border-(--rule)" onClick={ () => setOpen( false ) } disabled={ mutation.isPending }>Cancel</Button>
                        <Button type="button" variant="pill-ghost" className="bg-(--accent) text-(--paper) hover:bg-(--accent-deep)" onClick={ deactivate } disabled={ mutation.isPending }>
                            { mutation.isPending ? <Spinner className="size-4 text-current" aria-label="Deactivating variant" /> : <Trash2 size={ 15 } aria-hidden="true" /> }
                            { mutation.isPending ? 'Deactivating…' : 'Deactivate variant' }
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
