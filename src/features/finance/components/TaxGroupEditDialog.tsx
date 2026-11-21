import { useEffect } from 'react';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { Check, X } from '@/components/ui/hugeicons';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { TaxRateCombobox } from '@/src/features/finance/components/TaxRateCombobox';
import { useUpdateTaxGroup } from '@/src/features/finance/api/taxGroups';
import { useTaxRates } from '@/src/features/finance/api/taxRates';
import type { TaxGroupResponse } from '@/src/features/finance/types/taxGroups';
import { toastApiError } from '@/src/lib/api-error';

const taxGroupSchema = z.object({
  name: z.string().trim().min(1, 'Tax group name is required'),
  taxRateIds: z.array(z.uuid('Choose valid tax rates')).min(1, 'Select at least one tax rate'),
});

type TaxGroupEditDialogProps = Readonly<{
  group: TaxGroupResponse;
  onOpenChange: (open: boolean) => void;
}>;

const inputClass =
  'h-11 rounded-[10px] border-(--rule) bg-(--card) px-3.5 text-sm placeholder:text-(--muted-2) focus-visible:border-(--ink) focus-visible:ring-(--ink)/10';

export function TaxGroupEditDialog({ group, onOpenChange }: TaxGroupEditDialogProps) {
  const updateMutation = useUpdateTaxGroup();
  const taxRatesQuery = useTaxRates({ activeOnly: null });
  const isPending = updateMutation.isPending;
  const taxRates = taxRatesQuery.data ?? [];
  const {
    error: taxRatesError,
    isError: taxRatesIsError,
    refetch: refetchTaxRates,
  } = taxRatesQuery;

  useEffect(() => {
    const toastId = `tax-group-edit-rates-error-${group.id}`;

    if (taxRatesIsError) {
      toastApiError(
        taxRatesError,
        'Tax rates could not be loaded. Check your connection and try again.',
        {
          403: 'You do not have permission to read tax rates. Ask an administrator for tax:read access.',
        },
        {
          id: toastId,
          action: {
            label: 'Retry',
            onClick: () => {
              void refetchTaxRates();
            },
          },
        },
      );
    } else {
      toast.dismiss(toastId);
    }
  }, [group.id, taxRatesError, taxRatesIsError, refetchTaxRates]);

  const form = useForm({
    defaultValues: {
      name: group.name,
      taxRateIds: group.taxRates.map((rate) => rate.id),
    },
    validators: { onSubmit: taxGroupSchema },
    onSubmit: ({ value }) => {
      if (isPending || taxRatesQuery.isPending || taxRatesQuery.isError || !taxRates.length) {
        return;
      }

      updateMutation.mutate(
        {
          id: group.id,
          body: {
            name: value.name.trim(),
            taxRateIds: value.taxRateIds,
          },
        },
        {
          onSuccess: (updated) => {
            toast.success('Tax group updated', {
              description: `${updated.name} has been saved.`,
            });
            onOpenChange(false);
          },
          onError: (error) =>
            toastApiError(
              error,
              'The tax group could not be updated. Check your connection and try again.',
              {
                403: 'You do not have permission to update tax groups. Ask an administrator for tax:create access.',
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
        if (!open && !isPending) onOpenChange(false);
      }}
    >
      <DialogContent className="top-[12%] max-h-[80dvh] overflow-y-auto duration-200 sm:max-w-xl">
        <div className="grid gap-1.5 pr-7">
          <DialogTitle className="font-display text-2xl font-normal">Edit tax group</DialogTitle>
          <DialogDescription>
            Update the group name and component tax rates. Its code remains fixed.
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
          <FieldGroup className="grid gap-4">
            <form.Field name="name">
              {(field) => {
                const isInvalid = field.state.meta.errors.length > 0;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={`tax-group-${group.id}-name`}>
                      Name <span className="text-(--accent)">*</span>
                    </FieldLabel>
                    <Input
                      id={`tax-group-${group.id}-name`}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                      aria-invalid={isInvalid}
                      className={inputClass}
                      disabled={isPending}
                    />
                    {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
                  </Field>
                );
              }}
            </form.Field>
            <Field>
              <FieldLabel htmlFor={`tax-group-${group.id}-code`}>Code</FieldLabel>
              <Input
                id={`tax-group-${group.id}-code`}
                value={group.code}
                readOnly
                aria-readonly="true"
                className={`${inputClass} font-mono`}
              />
              <FieldDescription>Tax group codes cannot be changed.</FieldDescription>
            </Field>
            <form.Field name="taxRateIds">
              {(field) => {
                const isInvalid = field.state.meta.errors.length > 0;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldSet aria-invalid={isInvalid}>
                      <FieldLegend variant="label">
                        Select tax rates <span className="text-(--accent)">*</span>
                      </FieldLegend>
                      {taxRatesQuery.isPending ? (
                        <div
                          className="flex items-center gap-2 py-3 text-sm text-(--muted)"
                          aria-live="polite"
                        >
                          <Spinner
                            className="size-4 text-(--accent)"
                            aria-label="Loading tax rates"
                          />
                          <span>Loading tax rates…</span>
                        </div>
                      ) : taxRatesQuery.isError ? (
                        <p className="text-sm text-(--muted)">
                          Tax rates are unavailable. Retry from the notification.
                        </p>
                      ) : taxRates.length === 0 ? (
                        <FieldDescription>
                          No tax rates are configured for this organization.
                        </FieldDescription>
                      ) : (
                        <TaxRateCombobox
                          id={field.name}
                          value={field.state.value}
                          rates={taxRates}
                          onBlur={field.handleBlur}
                          onValueChange={field.handleChange}
                          disabled={isPending}
                          invalid={isInvalid}
                        />
                      )}
                      <FieldDescription>
                        Choose at least one tax rate. Combined rate is calculated by the server.
                      </FieldDescription>
                    </FieldSet>
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
              disabled={isPending}
            >
              <X size={15} />
              Cancel
            </Button>
            <Button
              type="submit"
              variant="pill-ghost"
              className="bg-(--ink) text-(--paper) hover:bg-(--accent)"
              disabled={
                isPending || taxRatesQuery.isPending || taxRatesQuery.isError || !taxRates.length
              }
            >
              {isPending ? (
                <Spinner className="size-4 text-current" aria-label="Saving tax group" />
              ) : (
                <Check size={15} />
              )}
              {isPending ? 'Saving…' : 'Save changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
