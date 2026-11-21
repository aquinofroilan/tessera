import { useForm } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { toast } from 'sonner';
import { Plus } from '@/components/ui/hugeicons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { DashboardShell } from '@/src/features/dashboard/components/DashboardShell';
import { useCreateCountSession } from '@/src/features/inventory/api/countSessions';
import { useWarehouses } from '@/src/features/inventory/api/warehouses';
import { toastApiError } from '@/src/lib/api-error';

const countSchema = z.object({
  code: z.string().trim().min(1, 'Count code is required'),
  warehouseId: z.string().uuid('Choose a warehouse'),
  scheduledFor: z.string(),
  notes: z.string(),
});

const inputClass =
  'h-11 rounded-[10px] border-(--rule) bg-(--card) px-3.5 text-sm placeholder:text-(--muted-2) focus-visible:border-(--ink) focus-visible:ring-(--ink)/10';

export function CountSessionCreatePage() {
  const navigate = useNavigate();
  const createMutation = useCreateCountSession();
  const warehousesQuery = useWarehouses({ isActive: true });
  const warehouses = warehousesQuery.data ?? [];

  const form = useForm({
    defaultValues: { code: '', warehouseId: '', scheduledFor: '', notes: '' },
    validators: { onSubmit: countSchema },
    onSubmit: ({ value }) => {
      if (createMutation.isPending) return;
      createMutation.mutate(
        {
          code: value.code.trim(),
          warehouseId: value.warehouseId,
          scheduledFor: value.scheduledFor || undefined,
          notes: value.notes.trim() || undefined,
        },
        {
          onSuccess: (session) => {
            toast.success('Count session created', {
              description: `${session.code} is ready for counting.`,
            });
            void navigate({
              to: '/inventory/counts/$countId',
              params: { countId: session.id },
            });
          },
          onError: (error) =>
            toastApiError(
              error,
              'The count session could not be created. Check your connection and try again.',
              {
                403: 'You do not have permission to create inventory counts. Ask an administrator for inventory:write access.',
              },
            ),
        },
      );
    },
  });

  const isPending = createMutation.isPending;

  return (
    <DashboardShell>
      <div className="w-full max-w-3xl">
        <header className="mb-7 border-b border-(--rule) pb-6">
          <h1 className="font-display text-[clamp(36px,4vw,48px)] leading-none font-light tracking-[-0.03em]">
            Create inventory count
          </h1>
          <p className="mt-2.5 text-[15px] text-(--ink-soft)">
            Start a physical count session for an active warehouse.
          </p>
        </header>
        <Card>
          <CardHeader>
            <CardTitle>Count details</CardTitle>
            <CardDescription>
              Set the count identity, warehouse, and optional schedule.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                event.stopPropagation();
                void form.handleSubmit();
              }}
              className="grid gap-5"
            >
              <FieldGroup className="grid gap-5 sm:grid-cols-2">
                <form.Field name="code">
                  {(field) => {
                    const isInvalid = field.state.meta.errors.length > 0;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel>
                          Count code <span className="text-(--accent)">*</span>
                        </FieldLabel>
                        <Input
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) => field.handleChange(event.target.value)}
                          aria-invalid={isInvalid}
                          className={`${inputClass} font-mono`}
                          placeholder="COUNT-2026-001"
                          disabled={isPending}
                        />
                        {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
                      </Field>
                    );
                  }}
                </form.Field>
                <form.Field name="warehouseId">
                  {(field) => {
                    const isInvalid = field.state.meta.errors.length > 0;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel>
                          Warehouse <span className="text-(--accent)">*</span>
                        </FieldLabel>
                        <Select
                          value={field.state.value || undefined}
                          onValueChange={field.handleChange}
                          disabled={
                            isPending || warehousesQuery.isPending || warehousesQuery.isError
                          }
                        >
                          <SelectTrigger className={inputClass}>
                            <SelectValue placeholder="Select an active warehouse" />
                          </SelectTrigger>
                          <SelectContent>
                            {warehouses.map((warehouse) => (
                              <SelectItem key={warehouse.id} value={warehouse.id}>
                                {warehouse.name} · {warehouse.code}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
                      </Field>
                    );
                  }}
                </form.Field>
              </FieldGroup>

              <form.Field name="scheduledFor">
                {(field) => (
                  <Field>
                    <FieldLabel>Scheduled for</FieldLabel>
                    <Input
                      type="date"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                      className={inputClass}
                      disabled={isPending}
                    />
                  </Field>
                )}
              </form.Field>
              <form.Field name="notes">
                {(field) => (
                  <Field>
                    <FieldLabel>Notes</FieldLabel>
                    <Textarea
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                      className="min-h-24 resize-y rounded-[10px] border border-(--rule) bg-(--card)"
                      placeholder="Monthly count"
                      disabled={isPending}
                    />
                  </Field>
                )}
              </form.Field>

              {warehousesQuery.isError ? (
                <p className="text-sm text-(--accent-deep)">
                  Warehouses are unavailable. Retry from the notification.
                </p>
              ) : null}

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="pill-ghost"
                  className="border border-(--rule)"
                  onClick={() => void navigate({ to: '/inventory/counts' })}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="pill-ghost"
                  className="bg-(--ink) text-(--paper) hover:bg-(--accent)"
                  disabled={isPending || warehousesQuery.isPending || warehousesQuery.isError}
                >
                  {isPending ? (
                    <Spinner className="size-4 text-current" aria-label="Creating count" />
                  ) : (
                    <Plus size={15} aria-hidden="true" />
                  )}
                  {isPending ? 'Creating…' : 'Create count'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
