import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { Check, X } from '@/components/ui/hugeicons';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { useRecordCount } from '@/src/features/inventory/api/countSessions';
import type { CountSessionLineResponse } from '@/src/features/inventory/types/countSessions';
import { toastApiError } from '@/src/lib/api-error';

const recordSchema = z.object({
  countedQuantity: z
    .string()
    .trim()
    .min(1, 'Counted quantity is required')
    .refine(
      (value) => Number.isFinite(Number(value)) && Number(value) >= 0,
      'Counted quantity cannot be negative',
    ),
  notes: z.string(),
});

type RecordCountDialogProps = Readonly<{
  countId: string;
  line: CountSessionLineResponse;
  onOpenChange: (open: boolean) => void;
}>;

const inputClass =
  'h-11 rounded-[10px] border-(--rule) bg-(--card) px-3.5 text-sm placeholder:text-(--muted-2) focus-visible:border-(--ink) focus-visible:ring-(--ink)/10';

export function RecordCountDialog({ countId, line, onOpenChange }: RecordCountDialogProps) {
  const mutation = useRecordCount(countId);
  const form = useForm({
    defaultValues: {
      countedQuantity: line.countedQuantity === null ? '' : String(line.countedQuantity),
      notes: line.notes ?? '',
    },
    validators: { onSubmit: recordSchema },
    onSubmit: ({ value }) => {
      if (mutation.isPending) return;
      mutation.mutate(
        {
          lineId: line.id,
          body: {
            countedQuantity: Number(value.countedQuantity),
            notes: value.notes.trim() || undefined,
          },
        },
        {
          onSuccess: () => {
            toast.success('Physical count recorded', {
              description: `${line.productSku} has been updated.`,
            });
            onOpenChange(false);
          },
          onError: (error) =>
            toastApiError(
              error,
              'The physical count could not be recorded. Check your connection and try again.',
              {
                403: 'You do not have permission to record inventory counts. Ask an administrator for inventory:write access.',
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
        if (!open && !mutation.isPending) onOpenChange(false);
      }}
    >
      <DialogContent className="top-[16%] sm:max-w-lg">
        <div className="grid gap-1.5 pr-7">
          <DialogTitle className="font-display text-2xl font-normal">
            Record physical count
          </DialogTitle>
          <DialogDescription>
            {line.productName} · {line.productSku}. Expected quantity: {line.expectedQuantity}.
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
          <form.Field name="countedQuantity">
            {(field) => {
              const isInvalid = field.state.meta.errors.length > 0;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel>
                    Counted quantity <span className="text-(--accent)">*</span>
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
                    disabled={mutation.isPending}
                  />
                  {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
                </Field>
              );
            }}
          </form.Field>
          <form.Field name="notes">
            {(field) => (
              <Field>
                <FieldLabel>Notes</FieldLabel>
                <Textarea
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  className="min-h-20 resize-y rounded-[10px] border border-(--rule) bg-(--card)"
                  placeholder="Optional count note"
                  disabled={mutation.isPending}
                />
              </Field>
            )}
          </form.Field>
          <div className="flex justify-end gap-2 border-t border-(--rule-soft) pt-4">
            <Button
              type="button"
              variant="pill-ghost"
              onClick={() => onOpenChange(false)}
              disabled={mutation.isPending}
            >
              <X size={15} />
              Cancel
            </Button>
            <Button
              type="submit"
              variant="pill-ghost"
              className="bg-(--ink) text-(--paper) hover:bg-(--accent)"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <Spinner className="size-4 text-current" aria-label="Recording count" />
              ) : (
                <Check size={15} />
              )}
              {mutation.isPending ? 'Recording…' : 'Record count'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
