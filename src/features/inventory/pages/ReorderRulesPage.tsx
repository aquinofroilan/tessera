import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Plus, Pencil, Trash2 } from '@/components/ui/hugeicons';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DashboardShell } from '@/src/features/dashboard/components/DashboardShell';
import { ReorderRuleDeleteDialog } from '@/src/features/inventory/components/ReorderRuleDeleteDialog';
import { ReorderRuleEditDialog } from '@/src/features/inventory/components/ReorderRuleEditDialog';
import { useReorderRules } from '@/src/features/inventory/api/reorderRules';
import { useProducts } from '@/src/features/inventory/api/products';
import { useWarehouses } from '@/src/features/inventory/api/warehouses';
import type { ReorderRuleResponse } from '@/src/features/inventory/types/reorderRules';
import { toastApiError } from '@/src/lib/api-error';

export function ReorderRulesPage() {
  const [editingRule, setEditingRule] = useState<ReorderRuleResponse | null>(null);
  const [deletingRule, setDeletingRule] = useState<ReorderRuleResponse | null>(null);
  const rulesQuery = useReorderRules();
  const productsQuery = useProducts();
  const warehousesQuery = useWarehouses();
  const productsById = new Map((productsQuery.data ?? []).map((product) => [product.id, product]));
  const warehousesById = new Map(
    (warehousesQuery.data ?? []).map((warehouse) => [warehouse.id, warehouse]),
  );

  useEffect(() => {
    if (rulesQuery.isError) {
      toastApiError(
        rulesQuery.error,
        'Reorder rules could not be loaded. Check your connection and try again.',
        {
          403: 'You do not have permission to view reorder rules. Ask an administrator for inventory:read access.',
        },
      );
    }
  }, [rulesQuery.error, rulesQuery.isError]);

  const rules = [...(rulesQuery.data ?? [])].sort((first, second) => {
    const firstName = productsById.get(first.productId)?.name ?? first.productId;
    const secondName = productsById.get(second.productId)?.name ?? second.productId;
    return firstName.localeCompare(secondName);
  });

  const isLoading = rulesQuery.isPending || productsQuery.isPending || warehousesQuery.isPending;

  return (
    <DashboardShell>
      <div className="w-full">
        <div className="mb-7 flex items-end justify-between gap-6 border-b border-(--rule) pb-6 max-sm:block">
          <div>
            <h1 className="font-display text-[clamp(36px,4vw,48px)] leading-none font-light tracking-[-0.03em]">
              Reorder rules
            </h1>
            <p className="mt-2.5 text-[15px] text-(--ink-soft)">
              Configure reorder points and safety stock by product and warehouse.
            </p>
          </div>
          <Button
            asChild
            variant="pill-ghost"
            className="mt-5 bg-(--ink) text-(--paper) hover:bg-(--accent) sm:mt-0"
          >
            <Link to="/inventory/reorder-rules/new">
              <Plus size={15} />
              Create reorder rule
            </Link>
          </Button>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            {isLoading ? (
              <div
                className="flex items-center justify-center gap-2 p-8 text-sm text-(--muted)"
                aria-live="polite"
              >
                <Spinner className="size-4 text-(--accent)" aria-label="Loading reorder rules" />
                <span>Loading reorder rules…</span>
              </div>
            ) : rulesQuery.isError ? (
              <div className="p-8 text-center">
                <p className="text-sm text-(--accent-deep)">
                  Reorder rules are unavailable. Retry from the notification.
                </p>
              </div>
            ) : rules.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <h2 className="font-display text-xl">No reorder rules yet</h2>
                <p className="mt-2 text-sm text-(--muted)">
                  Create a rule to define restocking thresholds for a product and warehouse.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Product</TableHead>
                    <TableHead>Warehouse</TableHead>
                    <TableHead className="text-right">Reorder point</TableHead>
                    <TableHead className="text-right">Safety stock</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rules.map((rule) => {
                    const product = productsById.get(rule.productId);
                    const warehouse = warehousesById.get(rule.warehouseId);
                    return (
                      <TableRow key={rule.id}>
                        <TableCell>
                          <Link
                            to="/inventory/reorder-rules/$ruleId"
                            params={{ ruleId: rule.id }}
                            className="block w-fit font-medium text-(--ink) hover:underline"
                          >
                            {product?.name ?? 'Unknown product'}
                          </Link>
                          <span className="mt-0.5 block font-mono text-xs text-(--muted)">
                            {product?.sku ?? rule.productId}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="block">{warehouse?.name ?? 'Unknown warehouse'}</span>
                          <span className="mt-0.5 block font-mono text-xs text-(--muted)">
                            {warehouse?.code ?? rule.warehouseId}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {rule.reorderPoint}
                        </TableCell>
                        <TableCell className="text-right font-medium">{rule.safetyStock}</TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1">
                            <Button
                              type="button"
                              variant="pill-ghost"
                              size="sm"
                              onClick={() => setEditingRule(rule)}
                              aria-label="Edit reorder rule"
                            >
                              <Pencil size={14} />
                              Edit
                            </Button>
                            <Button
                              type="button"
                              variant="pill-ghost"
                              size="sm"
                              className="text-(--accent-deep) hover:bg-(--accent-soft)"
                              onClick={() => setDeletingRule(rule)}
                              aria-label="Delete reorder rule"
                            >
                              <Trash2 size={14} />
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
      {editingRule ? (
        <ReorderRuleEditDialog
          key={editingRule.id}
          rule={editingRule}
          onOpenChange={(open) => {
            if (!open) setEditingRule(null);
          }}
        />
      ) : null}
      {deletingRule ? (
        <ReorderRuleDeleteDialog
          key={deletingRule.id}
          rule={deletingRule}
          onOpenChange={(open) => {
            if (!open) setDeletingRule(null);
          }}
        />
      ) : null}
    </DashboardShell>
  );
}
