import { toast } from 'sonner';
import { Trash2 } from '@/components/ui/hugeicons';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { useDeactivateTaxGroup } from '@/src/features/finance/api/taxGroups';
import type { TaxGroupResponse } from '@/src/features/finance/types/taxGroups';
import { toastApiError } from '@/src/lib/api-error';

type TaxGroupDeactivateDialogProps = Readonly<{
  group: TaxGroupResponse;
  onOpenChange: (open: boolean) => void;
}>;

export function TaxGroupDeactivateDialog({ group, onOpenChange }: TaxGroupDeactivateDialogProps) {
  const mutation = useDeactivateTaxGroup();

  const deactivate = () => {
    mutation.mutate(group.id, {
      onSuccess: () => {
        toast.success('Tax group deactivated', {
          description: `${group.name} is no longer available for new workflows.`,
        });
        onOpenChange(false);
      },
      onError: (error) =>
        toastApiError(
          error,
          'The tax group could not be deactivated. Check your connection and try again.',
          {
            403: 'You do not have permission to deactivate tax groups. Ask an administrator for tax:delete access.',
          },
        ),
    });
  };

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !mutation.isPending) onOpenChange(false);
      }}
    >
      <DialogContent className="top-[20%]">
        <div className="grid gap-1.5 pr-7">
          <DialogTitle className="font-display text-2xl font-normal">
            Deactivate tax group?
          </DialogTitle>
          <DialogDescription>
            <span className="font-medium text-(--ink)">
              {group.name} ({group.code})
            </span>{' '}
            will be set inactive and removed from active workflows and tax-group selectors.
            Historical references in products and transactions will remain available.
          </DialogDescription>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="pill-ghost"
            className="border border-(--rule)"
            onClick={() => onOpenChange(false)}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="pill-ghost"
            className="bg-(--accent) text-(--paper) hover:bg-(--accent-deep)"
            onClick={deactivate}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <Spinner className="size-4 text-current" aria-label="Deactivating tax group" />
            ) : (
              <Trash2 size={15} />
            )}
            {mutation.isPending ? 'Deactivating…' : 'Deactivate group'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
