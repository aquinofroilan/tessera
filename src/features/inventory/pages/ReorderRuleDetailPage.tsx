import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Pencil, Trash2 } from '@/components/ui/hugeicons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { DashboardShell } from '@/src/features/dashboard/components/DashboardShell';
import { ReorderRuleDeleteDialog } from '@/src/features/inventory/components/ReorderRuleDeleteDialog';
import { ReorderRuleEditDialog } from '@/src/features/inventory/components/ReorderRuleEditDialog';
import { useReorderRule } from '@/src/features/inventory/api/reorderRules';
import { useProduct } from '@/src/features/inventory/api/products';
import { useWarehouse } from '@/src/features/inventory/api/warehouses';
import { toastApiError } from '@/src/lib/api-error';

type ReorderRuleDetailPageProps = Readonly<{
  ruleId: string;
}>;

export function ReorderRuleDetailPage({ ruleId }: ReorderRuleDetailPageProps) {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const ruleQuery = useReorderRule(ruleId);
  const rule = ruleQuery.data;
  const productQuery = useProduct(rule?.productId ?? '');
  const warehouseQuery = useWarehouse(rule?.warehouseId ?? '');

  useEffect(() => {
    if (ruleQuery.isError) {
      toastApiError(
        ruleQuery.error,
        'Reorder rule details could not be loaded. Check your connection and try again.',
        {
          403: 'You do not have permission to view reorder rules. Ask an administrator for inventory:read access.',
        },
      );
    }
  }, [ruleQuery.error, ruleQuery.isError]);

  return (
    <DashboardShell>
      {ruleQuery.isPending ? (
        <div
          className="flex w-full items-center justify-center gap-2 p-12 text-sm text-(--muted)"
          aria-live="polite"
        >
          <Spinner className="size-4 text-(--accent)" aria-label="Loading reorder rule" />
          <span>Loading reorder rule…</span>
        </div>
      ) : ruleQuery.isError ? (
        <div className="flex min-h-64 flex-col items-start justify-center gap-3" role="alert">
          <h1 className="font-display text-2xl">Reorder rule unavailable</h1>
          <p className="text-sm text-(--accent-deep)">
            Reorder rule details could not be loaded. Retry from the notification.
          </p>
          <Button
            type="button"
            variant="pill-ghost"
            className="border border-(--rule)"
            onClick={() => {
              void ruleQuery.refetch();
            }}
          >
            Retry
          </Button>
        </div>
      ) : rule ? (
        <>
          <div className="mb-7 flex flex-wrap items-end justify-between gap-5 border-b border-(--rule) pb-6">
            <div>
              <h1 className="font-display text-[clamp(36px,4vw,48px)] leading-tight font-light tracking-[-0.03em]">
                Reorder rule
              </h1>
              <p className="mt-2 text-sm text-(--ink-soft)">
                {productQuery.data?.name ?? 'Loading product…'} ·{' '}
                {warehouseQuery.data?.name ?? 'Loading warehouse…'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="pill-ghost"
                className="bg-(--ink) text-(--paper) hover:bg-(--accent)"
                onClick={() => setEditing(true)}
              >
                <Pencil size={15} />
                Edit thresholds
              </Button>
              <Button
                type="button"
                variant="pill-ghost"
                className="text-(--accent-deep) hover:bg-(--accent-soft)"
                onClick={() => setDeleting(true)}
              >
                <Trash2 size={15} />
                Delete
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Threshold details</CardTitle>
              <CardDescription>
                This rule applies to the selected product and warehouse.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-(--muted)">Product</dt>
                  <dd className="mt-1 text-sm font-medium">
                    {productQuery.data?.name ?? rule.productId}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-(--muted)">Warehouse</dt>
                  <dd className="mt-1 text-sm font-medium">
                    {warehouseQuery.data?.name ?? rule.warehouseId}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-(--muted)">Reorder point</dt>
                  <dd className="mt-1 text-sm font-medium">{rule.reorderPoint}</dd>
                </div>
                <div>
                  <dt className="text-xs text-(--muted)">Safety stock</dt>
                  <dd className="mt-1 text-sm font-medium">{rule.safetyStock}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {editing ? (
            <ReorderRuleEditDialog
              key={rule.id}
              rule={rule}
              onOpenChange={(open) => {
                if (!open) setEditing(false);
              }}
            />
          ) : null}
          {deleting ? (
            <ReorderRuleDeleteDialog
              key={rule.id}
              rule={rule}
              onOpenChange={(open) => {
                if (!open) setDeleting(false);
              }}
              onDeleted={() => {
                void navigate({ to: '/inventory/reorder-rules' });
              }}
            />
          ) : null}
        </>
      ) : null}
    </DashboardShell>
  );
}
