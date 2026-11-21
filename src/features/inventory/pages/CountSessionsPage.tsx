import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Plus } from '@/components/ui/hugeicons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { useCountSessions } from '@/src/features/inventory/api/countSessions';
import { useWarehouses } from '@/src/features/inventory/api/warehouses';
import type { CountSessionStatus } from '@/src/features/inventory/types/countSessions';
import { toastApiError } from '@/src/lib/api-error';

const statuses: CountSessionStatus[] = ['DRAFT', 'COUNTING', 'POSTED', 'CANCELLED'];

export function CountSessionsPage() {
  const [status, setStatus] = useState<CountSessionStatus | undefined>();
  const countsQuery = useCountSessions(status);
  const warehousesQuery = useWarehouses();
  const warehousesById = new Map(
    (warehousesQuery.data ?? []).map((warehouse) => [warehouse.id, warehouse]),
  );

  useEffect(() => {
    if (countsQuery.isError) {
      toastApiError(
        countsQuery.error,
        'Inventory counts could not be loaded. Check your connection and try again.',
        {
          403: 'You do not have permission to view inventory counts. Ask an administrator for inventory:read access.',
        },
      );
    }
  }, [countsQuery.error, countsQuery.isError]);

  const counts = [...(countsQuery.data ?? [])].sort((first, second) =>
    first.code.localeCompare(second.code),
  );

  return (
    <DashboardShell>
      <div className="w-full">
        <div className="mb-7 flex items-end justify-between gap-6 border-b border-(--rule) pb-6 max-sm:block">
          <div>
            <h1 className="font-display text-[clamp(36px,4vw,48px)] leading-none font-light tracking-[-0.03em]">
              Inventory counts
            </h1>
            <p className="mt-2.5 text-[15px] text-(--ink-soft)">
              Schedule, record, and post physical inventory counts.
            </p>
          </div>
          <div className="mt-5 flex flex-wrap items-end gap-3 sm:mt-0">
            <div className="grid gap-1.5 sm:min-w-40">
              <span className="text-xs font-medium text-(--ink-soft)">Status</span>
              <Select
                value={status ?? 'ALL'}
                onValueChange={(value) => {
                  setStatus(value === 'ALL' ? undefined : (value as CountSessionStatus));
                }}
              >
                <SelectTrigger className="h-10 rounded-[10px] border-(--rule) bg-(--card)">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All statuses</SelectItem>
                  {statuses.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              asChild
              variant="pill-ghost"
              className="bg-(--ink) text-(--paper) hover:bg-(--accent)"
            >
              <Link to="/inventory/counts/new">
                <Plus size={15} />
                Create count
              </Link>
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden">
          <CardHeader className="border-b border-(--rule)">
            <h2 className="font-display text-lg font-[380]">Count sessions</h2>
          </CardHeader>
          <CardContent className="p-0">
            {countsQuery.isPending ? (
              <div
                className="flex items-center justify-center gap-2 p-8 text-sm text-(--muted)"
                aria-live="polite"
              >
                <Spinner className="size-4 text-(--accent)" aria-label="Loading inventory counts" />
                <span>Loading inventory counts…</span>
              </div>
            ) : counts.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <h3 className="font-display text-xl">No count sessions</h3>
                <p className="mt-2 text-sm text-(--muted)">
                  Create a count to begin a physical inventory check.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Count</TableHead>
                    <TableHead>Warehouse</TableHead>
                    <TableHead>Scheduled</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {counts.map((count) => {
                    const warehouse = warehousesById.get(count.warehouseId);
                    return (
                      <TableRow key={count.id}>
                        <TableCell>
                          <Link
                            to="/inventory/counts/$countId"
                            params={{ countId: count.id }}
                            className="block w-fit font-medium text-(--ink) hover:underline"
                          >
                            {count.code}
                          </Link>
                          <span className="mt-0.5 block text-xs text-(--muted)">
                            {count.lines.length} {count.lines.length === 1 ? 'line' : 'lines'}
                          </span>
                        </TableCell>
                        <TableCell>
                          {warehouse?.name ?? 'Unknown warehouse'}
                          {warehouse ? (
                            <span className="mt-0.5 block font-mono text-xs text-(--muted)">
                              {warehouse.code}
                            </span>
                          ) : null}
                        </TableCell>
                        <TableCell>{count.scheduledFor ?? 'Not scheduled'}</TableCell>
                        <TableCell>
                          <span className="inline-flex rounded-full bg-(--paper-2) px-2 py-0.5 text-[11px] font-medium text-(--ink-soft)">
                            {count.status}
                          </span>
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
    </DashboardShell>
  );
}
