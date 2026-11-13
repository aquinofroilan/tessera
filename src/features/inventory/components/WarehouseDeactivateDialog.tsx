import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Trash2 } from '@/components/ui/hugeicons'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Spinner } from '@/components/ui/spinner'
import { useDeactivateWarehouse } from '@/src/features/inventory/api/warehouses'
import type { WarehouseResponse } from '@/src/features/inventory/types/warehouses'
import { toastApiError } from '@/src/lib/api-error'

type WarehouseDeactivateDialogProps = Readonly<{
    warehouse: WarehouseResponse
}>

export function WarehouseDeactivateDialog ( { warehouse }: WarehouseDeactivateDialogProps ) {
    const navigate = useNavigate()
    const [ open, setOpen ] = useState( false )
    const mutation = useDeactivateWarehouse( warehouse.id )

    const deactivate = () => {
        mutation.mutate( undefined, {
            onSuccess: deactivated => {
                toast.success( 'Warehouse deactivated', { description: `${ deactivated.name } is no longer active.` } )
                void navigate( { to: '/inventory/warehouses', search: { activeFilter: 'false' } } )
            },
            onError: error => toastApiError( error, 'The warehouse could not be deactivated. Check your connection and try again.', { 403: 'You do not have permission to deactivate warehouses. Ask an administrator for inventory:write access.' } ),
        } )
    }

    return (
        <>
            <Button type="button" variant="pill-ghost" className="text-(--accent-deep) hover:bg-(--accent-soft)" onClick={ () => { mutation.reset(); setOpen( true ) } }>
                <Trash2 size={ 15 } aria-hidden="true" />Deactivate
            </Button>
            <Dialog open={ open } onOpenChange={ nextOpen => { if ( !mutation.isPending ) setOpen( nextOpen ) } }>
                <DialogContent className="top-[20%]">
                    <div className="grid gap-1.5 pr-7">
                        <DialogTitle className="font-display text-2xl font-normal">Deactivate warehouse?</DialogTitle>
                        <DialogDescription>
                            <span className="font-medium text-(--ink)">{ warehouse.name } ({ warehouse.code })</span> will be marked inactive and remain available for reference.
                        </DialogDescription>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="pill-ghost" className="border border-(--rule)" onClick={ () => setOpen( false ) } disabled={ mutation.isPending }>Cancel</Button>
                        <Button type="button" variant="pill-ghost" className="bg-(--accent) text-(--paper) hover:bg-(--accent-deep)" onClick={ deactivate } disabled={ mutation.isPending }>
                            { mutation.isPending ? <Spinner className="size-4 text-current" aria-label="Deactivating warehouse" /> : <Trash2 size={ 15 } aria-hidden="true" /> }
                            { mutation.isPending ? 'Deactivating…' : 'Deactivate warehouse' }
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
