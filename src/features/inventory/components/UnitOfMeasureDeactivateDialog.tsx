import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Trash2 } from '@/components/ui/hugeicons'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Spinner } from '@/components/ui/spinner'
import { useDeactivateUnitOfMeasure } from '@/src/features/inventory/api/unitsOfMeasure'
import type { UnitOfMeasureResponse } from '@/src/features/inventory/types/unitsOfMeasure'
import { toastApiError } from '@/src/lib/api-error'

type UnitOfMeasureDeactivateDialogProps = Readonly<{
    unit: UnitOfMeasureResponse
}>

export function UnitOfMeasureDeactivateDialog ( { unit }: UnitOfMeasureDeactivateDialogProps ) {
    const navigate = useNavigate()
    const [ open, setOpen ] = useState( false )
    const mutation = useDeactivateUnitOfMeasure( unit.id )

    const deactivate = () => {
        mutation.mutate( undefined, {
            onSuccess: deactivated => {
                toast.success( 'Unit deactivated', { description: `${ deactivated.name } is no longer active.` } )
                navigate( { to: '/inventory/settings/uoms' } )
            },
            onError: error => toastApiError( error, 'The unit could not be deactivated. Check your connection and try again.', { 403: 'You do not have permission to deactivate units of measure. Ask an administrator for inventory:write access.' } ),
        } )
    }

    return (
        <>
            <Button type="button" variant="pill-ghost" className="text-(--accent-deep) hover:bg-(--accent-soft)" onClick={ () => { mutation.reset(); setOpen( true ) } }>
                <Trash2 size={ 15 } aria-hidden="true" />Deactivate
            </Button>
            <Dialog open={ open } onOpenChange={ nextOpen => { if ( !mutation.isPending ) setOpen( nextOpen ) } }>
                <DialogContent showCloseButton={ !mutation.isPending } className="top-[20%]">
                    <div className="grid gap-1.5 pr-7">
                        <DialogTitle className="font-display text-2xl font-normal">Deactivate unit?</DialogTitle>
                        <DialogDescription>
                            <span className="font-medium text-(--ink)">{ unit.name } ({ unit.code })</span> will be marked inactive and kept for reference in existing inventory records.
                        </DialogDescription>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="pill-ghost" className="border border-(--rule)" onClick={ () => setOpen( false ) } disabled={ mutation.isPending }>Cancel</Button>
                        <Button type="button" variant="pill-ghost" className="bg-(--accent) text-(--paper) hover:bg-(--accent-deep)" onClick={ deactivate } disabled={ mutation.isPending }>
                            { mutation.isPending ? <Spinner className="size-4 text-current" aria-label="Deactivating unit" /> : <Trash2 size={ 15 } aria-hidden="true" /> }
                            { mutation.isPending ? 'Deactivating…' : 'Deactivate unit' }
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
