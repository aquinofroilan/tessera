import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { Check, X } from '@/components/ui/hugeicons';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { useUpdateReorderRule } from '@/src/features/inventory/api/reorderRules';
import type { ReorderRuleResponse } from '@/src/features/inventory/types/reorderRules';
import { toastApiError } from '@/src/lib/api-error';

const thresholdSchema = z.object({
  reorderPoint: z
    .string()
    .trim()
    .min(1, 'Reorder point is required')
    .refine(
      (value) => Number.isFinite(Number(value)) && Number(value) >= 0,
      'Reorder point must be zero or greater',
    ),
  safetyStock: z
    .string()
    .trim()
    .refine(
      (value) => value === '' || (Number.isFinite(Number(value)) && Number(value) >= 0),
      'Safety stock must be zero or greater',
    ),
});

type ReorderRuleEditDialogProps = Readonly<{
  rule: ReorderRuleResponse;
  onOpenChange: (open: boolean) => void;
}>;

const inputClass =
  'h-11 rounded-[10px] border-(--rule) bg-(--card) px-3.5 text-sm placeholder:text-(--muted-2) focus-visible:border-(--ink) focus-visible:ring-(--ink)/10';

export function ReorderRuleEditDialog({ rule, onOpenChange }: ReorderRuleEditDialogProps) {
  const updateMutation = useUpdateReorderRule(rule.id);

  const form = useForm({
    defaultValues: {
      reorderPoint: String(rule.reorderPoint),
      safetyStock: String(rule.safetyStock),
    },
    validators: { onSubmit: thresholdSchema },
    onSubmit: ({ value }) => {
      if (updateMutation.isPending) return;

      updateMutation.mutate(
        {
          reorderPoint: Number(value.reorderPoint),
          safetyStock: value.safetyStock.trim() === '' ? 0 : Number(value.safetyStock),
        },
        {
          onSuccess: (updated) => {
            toast.success('Reorder rule updated', {
              description: `Thresholds saved at ${updated.reorderPoint} / ${updated.safetyStock}.`,
            });
            onOpenChange(false);
          },
          onError: (error) =>
            toastApiError(
              error,
              'The reorder rule could not be updated. Check your connection and try again.',
              {
                403: 'You do not have permission to update reorder rules. Ask an administrator for inventory:write access.',
              },
            ),
        },
      );
    },
  });

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !updateMutation.isPending) onOpenChange(false);
      }}
    >
      <DialogContent className="top-[16%] sm:max-w-lg">
        <div className="grid gap-1.5 pr-7">
          <DialogTitle className="font-display text-2xl font-normal">Edit reorder rule</DialogTitle>
          <DialogDescription>
            Update the reorder point and safety stock thresholds.
          </DialogDescription>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void form.handleSubmit();
          }}
          className="grid gap-5"
        >
          <FieldGroup className="grid gap-4 sm:grid-cols-2">
            <form.Field name="reorderPoint">
              {(field) => {
                const isInvalid = field.state.meta.errors.length > 0;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel>
                      Reorder point <span className="text-(--accent)">*</span>
                    </FieldLabel>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      inputMode="numeric"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                      aria-invalid={isInvalid}
                      className={inputClass}
                      disabled={updateMutation.isPending}
                    />
                    {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
                  </Field>
                );
              }}
            </form.Field>
            <form.Field name="safetyStock">
              {(field) => {
                const isInvalid = field.state.meta.errors.length > 0;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel>Safety stock</FieldLabel>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      inputMode="numeric"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                      aria-invalid={isInvalid}
                      className={inputClass}
                      disabled={updateMutation.isPending}
                    />
                    {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>
          <div className="flex justify-end gap-2 border-t border-(--rule-soft) pt-4">
            <Button
              type="button"
              variant="pill-ghost"
              onClick={() => onOpenChange(false)}
              disabled={updateMutation.isPending}
            >
              <X size={15} />
              Cancel
            </Button>
            <Button
              type="submit"
              variant="pill-ghost"
              className="bg-(--ink) text-(--paper) hover:bg-(--accent)"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <Spinner className="size-4 text-current" aria-label="Saving reorder rule" />
              ) : (
                <Check size={15} />
              )}
              {updateMutation.isPending ? 'Saving…' : 'Save changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
