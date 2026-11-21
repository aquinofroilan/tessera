import { useEffect } from 'react';
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
import { DashboardShell } from '@/src/features/dashboard/components/DashboardShell';
import { useCreateReorderRule } from '@/src/features/inventory/api/reorderRules';
import { useProducts } from '@/src/features/inventory/api/products';
import { useWarehouses } from '@/src/features/inventory/api/warehouses';
import { toastApiError } from '@/src/lib/api-error';

const reorderRuleSchema = z.object({
  productId: z.string().uuid('Choose a product'),
  warehouseId: z.string().uuid('Choose a warehouse'),
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

const inputClass =
  'h-11 rounded-[10px] border-(--rule) bg-(--card) px-3.5 text-sm placeholder:text-(--muted-2) focus-visible:border-(--ink) focus-visible:ring-(--ink)/10';

export function ReorderRuleCreatePage() {
  const navigate = useNavigate();
  const createMutation = useCreateReorderRule();
  const productsQuery = useProducts({ isActive: true });
  const warehousesQuery = useWarehouses({ isActive: true });
  const products = productsQuery.data ?? [];
  const warehouses = warehousesQuery.data ?? [];

  useEffect(() => {
    if (productsQuery.isError) {
      toastApiError(
        productsQuery.error,
        'Products could not be loaded. Check your connection and try again.',
        {
          403: 'You do not have permission to view products. Ask an administrator for inventory:read access.',
        },
      );
    }
  }, [productsQuery.error, productsQuery.isError]);

  useEffect(() => {
    if (warehousesQuery.isError) {
      toastApiError(
        warehousesQuery.error,
        'Warehouses could not be loaded. Check your connection and try again.',
        {
          403: 'You do not have permission to view warehouses. Ask an administrator for inventory:read access.',
        },
      );
    }
  }, [warehousesQuery.error, warehousesQuery.isError]);

  const form = useForm({
    defaultValues: {
      productId: '',
      warehouseId: '',
      reorderPoint: '',
      safetyStock: '0',
    },
    validators: { onSubmit: reorderRuleSchema },
    onSubmit: ({ value }) => {
      if (createMutation.isPending) return;

      createMutation.mutate(
        {
          productId: value.productId,
          warehouseId: value.warehouseId,
          reorderPoint: Number(value.reorderPoint),
          safetyStock: value.safetyStock.trim() === '' ? 0 : Number(value.safetyStock),
        },
        {
          onSuccess: (rule) => {
            toast.success('Reorder rule created', {
              description: 'The reorder thresholds are ready to use.',
            });
            void navigate({
              to: '/inventory/reorder-rules/$ruleId',
              params: { ruleId: rule.id },
            });
          },
          onError: (error) =>
            toastApiError(
              error,
              'The reorder rule could not be created. Check your connection and try again.',
              {
                403: 'You do not have permission to create reorder rules. Ask an administrator for inventory:write access.',
              },
            ),
        },
      );
    },
  });

  const isPending = createMutation.isPending;
  const selectionsLoading = productsQuery.isPending || warehousesQuery.isPending;
  const selectionsUnavailable = productsQuery.isError || warehousesQuery.isError;

  return (
    <DashboardShell>
      <div className="w-full max-w-3xl">
        <header className="mb-7 border-b border-(--rule) pb-6">
          <h1 className="font-display text-[clamp(36px,4vw,48px)] leading-none font-light tracking-[-0.03em]">
            Create reorder rule
          </h1>
          <p className="mt-2.5 text-[15px] text-(--ink-soft)">
            Set thresholds for a product at a warehouse.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Reorder thresholds</CardTitle>
            <CardDescription>
              Choose an active product and warehouse, then configure the stock thresholds.
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
                <form.Field name="productId">
                  {(field) => {
                    const isInvalid = field.state.meta.errors.length > 0;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel>
                          Product <span className="text-(--accent)">*</span>
                        </FieldLabel>
                        <Select
                          value={field.state.value || undefined}
                          onValueChange={field.handleChange}
                          disabled={isPending || selectionsLoading || selectionsUnavailable}
                        >
                          <SelectTrigger className={inputClass}>
                            <SelectValue placeholder="Select an active product" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name} · {product.sku}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                          disabled={isPending || selectionsLoading || selectionsUnavailable}
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

              <FieldGroup className="grid gap-5 sm:grid-cols-2">
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
                          placeholder="25"
                          disabled={isPending}
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
                          placeholder="10"
                          disabled={isPending}
                        />
                        {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
                      </Field>
                    );
                  }}
                </form.Field>
              </FieldGroup>

              {selectionsUnavailable ? (
                <p className="text-sm text-(--accent-deep)">
                  Product or warehouse data is unavailable. Retry from the notification.
                </p>
              ) : null}

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="pill-ghost"
                  className="border border-(--rule)"
                  onClick={() => {
                    void navigate({ to: '/inventory/reorder-rules' });
                  }}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="pill-ghost"
                  className="bg-(--ink) text-(--paper) hover:bg-(--accent)"
                  disabled={isPending || selectionsLoading || selectionsUnavailable}
                >
                  {isPending ? (
                    <Spinner className="size-4 text-current" aria-label="Creating reorder rule" />
                  ) : (
                    <Plus size={15} aria-hidden="true" />
                  )}
                  {isPending ? 'Creating…' : 'Create reorder rule'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
