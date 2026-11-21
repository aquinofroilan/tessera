import { toast } from 'sonner';
import { Trash2 } from '@/components/ui/hugeicons';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { useDeleteReorderRule } from '@/src/features/inventory/api/reorderRules';
import type { ReorderRuleResponse } from '@/src/features/inventory/types/reorderRules';
import { toastApiError } from '@/src/lib/api-error';

type ReorderRuleDeleteDialogProps = Readonly<{
  rule: ReorderRuleResponse;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
}>;

export function ReorderRuleDeleteDialog({
  rule,
  onOpenChange,
  onDeleted,
}: ReorderRuleDeleteDialogProps) {
  const mutation = useDeleteReorderRule();

  const deleteRule = () => {
    mutation.mutate(rule.id, {
      onSuccess: () => {
        toast.success('Reorder rule deleted', {
          description: 'The reorder thresholds have been removed.',
        });
        onOpenChange(false);
        onDeleted?.();
      },
      onError: (error) =>
        toastApiError(
          error,
          'The reorder rule could not be deleted. Check your connection and try again.',
          {
            403: 'You do not have permission to delete reorder rules. Ask an administrator for inventory:write access.',
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
      <DialogContent className="top-[20%] sm:max-w-md">
        <div className="grid gap-1.5 pr-7">
          <DialogTitle className="font-display text-2xl font-normal">
            Delete reorder rule?
          </DialogTitle>
          <DialogDescription>
            This permanently removes the reorder thresholds for this product and warehouse.
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
            onClick={deleteRule}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <Spinner className="size-4 text-current" aria-label="Deleting reorder rule" />
            ) : (
              <Trash2 size={15} />
            )}
            {mutation.isPending ? 'Deleting…' : 'Delete rule'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
