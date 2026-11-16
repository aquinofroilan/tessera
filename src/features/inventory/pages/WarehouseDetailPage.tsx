import { useEffect, useState, type ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { DashboardShell } from '@/src/features/dashboard/components/DashboardShell';
import { WarehouseDeactivateDialog } from '@/src/features/inventory/components/WarehouseDeactivateDialog';
import { WarehouseEditSheet } from '@/src/features/inventory/components/WarehouseEditSheet';
import { WarehouseLocationCreateForm } from '@/src/features/inventory/components/WarehouseLocationCreateForm';
import { WarehouseLocationManageSheet } from '@/src/features/inventory/components/WarehouseLocationManageSheet';
import { useWarehouse, useWarehouseLocations } from '@/src/features/inventory/api/warehouses';
import { toastApiError } from '@/src/lib/api-error';

type WarehouseDetailPageProps = Readonly<{
  warehouseId: string;
}>;

function DetailItem({ label, children }: Readonly<{ label: string; children: ReactNode }>) {
  return (
    <div className="grid gap-1 border-b border-(--rule-soft) py-3 last:border-b-0 sm:grid-cols-[180px_1fr] sm:gap-4">
      <dt className="text-sm text-(--muted)">{label}</dt>
      <dd className="min-w-0 text-sm text-(--ink)">{children}</dd>
    </div>
  );
}

export function WarehouseDetailPage({ warehouseId }: WarehouseDetailPageProps) {
  const [includeInactiveLocations, setIncludeInactiveLocations] = useState(false);
  const [locationsPage, setLocationsPage] = useState(0);
  const warehouseQuery = useWarehouse(warehouseId);
  const locationsQuery = useWarehouseLocations(
    warehouseId,
    !includeInactiveLocations,
    locationsPage,
    100,
  );
  const warehouse = warehouseQuery.data;
  const locations = [...(locationsQuery.data?.content ?? [])].sort((first, second) =>
    first.code.localeCompare(second.code),
  );
  const totalLocations = locationsQuery.data?.totalElements ?? 0;
  const totalPages = locationsQuery.data?.totalPages ?? 0;
  const locationsById = new Map(locations.map((location) => [location.id, location]));

  useEffect(() => {
    const toastId = `inventory-warehouse-detail-error-${warehouseId}`;

    if (warehouseQuery.isError) {
      toastApiError(
        warehouseQuery.error,
        'Warehouse details could not be loaded. Check your connection and try again.',
        {
          403: 'You do not have permission to view warehouses. Ask an administrator for inventory:read access.',
        },
        {
          id: toastId,
          action: {
            label: 'Retry',
            onClick: () => {
              void warehouseQuery.refetch();
            },
          },
        },
      );
    } else {
      toast.dismiss(toastId);
    }
  }, [warehouseId, warehouseQuery.error, warehouseQuery.isError, warehouseQuery.refetch]);

  useEffect(() => {
    const toastId = `inventory-warehouse-locations-error-${warehouseId}`;

    if (locationsQuery.isError) {
      toastApiError(
        locationsQuery.error,
        'Warehouse locations could not be loaded. Check your connection and try again.',
        {
          403: 'You do not have permission to view warehouse locations. Ask an administrator for inventory:read access.',
        },
        {
          id: toastId,
          action: {
            label: 'Retry',
            onClick: () => {
              void locationsQuery.refetch();
            },
          },
        },
      );
    } else {
      toast.dismiss(toastId);
    }
  }, [warehouseId, locationsQuery.error, locationsQuery.isError, locationsQuery.refetch]);

  return (
    <DashboardShell>
      {warehouseQuery.isPending ? (
        <div
          className="flex w-full items-center justify-center gap-2 p-12 text-sm text-(--muted)"
          aria-live="polite"
        >
          <Spinner className="size-4 text-(--accent)" aria-label="Loading warehouse" />
          <span>Loading warehouse…</span>
        </div>
      ) : !warehouse ? (
        <div className="w-full rounded-xl border border-(--rule) bg-(--card) p-8 text-center">
          <p className="text-sm text-(--muted)">
            Warehouse data is unavailable. Use the retry action in the notification to try again.
          </p>
          <Button asChild variant="pill-ghost" className="mt-4 border border-(--rule)">
            <Link to="/inventory/warehouses">View warehouses</Link>
          </Button>
        </div>
      ) : (
        <div className="w-full">
          <header className="mb-7 flex flex-wrap items-end justify-between gap-5 border-b border-(--rule) pb-6">
            <div>
              <p className="mb-2 font-mono text-[10px] tracking-[0.14em] text-(--muted) uppercase">
                {warehouse.code}
              </p>
              <h1 className="font-display text-[clamp(36px,4vw,48px)] leading-none font-light tracking-[-0.03em]">
                {warehouse.name}
              </h1>
              <p className="mt-2.5 text-[15px] text-(--ink-soft)">
                {[warehouse.addressLine, warehouse.city, warehouse.country]
                  .filter(Boolean)
                  .join(', ') || 'No address recorded'}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${warehouse.isActive ? 'bg-(--moss-soft) text-(--moss)' : 'bg-(--paper-2) text-(--muted)'}`}
              >
                {warehouse.isActive ? 'Active' : 'Inactive'}
              </span>
              <WarehouseEditSheet warehouse={warehouse} />
              {warehouse.isActive ? <WarehouseDeactivateDialog warehouse={warehouse} /> : null}
            </div>
          </header>

          <div className="grid w-full gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)]">
            <Card>
              <CardHeader>
                <h2 className="font-display text-xl font-light">Warehouse details</h2>
                <p className="text-sm text-(--ink-soft)">
                  Facility information and inventory behavior.
                </p>
              </CardHeader>
              <CardContent>
                <dl>
                  <DetailItem label="Code">{warehouse.code}</DetailItem>
                  <DetailItem label="Name">{warehouse.name}</DetailItem>
                  <DetailItem label="Description">{warehouse.description || '—'}</DetailItem>
                  <DetailItem label="Address">{warehouse.addressLine || '—'}</DetailItem>
                  <DetailItem label="City">{warehouse.city || '—'}</DetailItem>
                  <DetailItem label="Country">{warehouse.country || '—'}</DetailItem>
                  <DetailItem label="Negative stock">
                    {warehouse.allowNegativeStock ? 'Allowed' : 'Blocked'}
                  </DetailItem>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="font-display text-xl font-light">Record information</h2>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm">
                <div>
                  <p className="text-(--muted)">Warehouse ID</p>
                  <p className="mt-1 font-mono text-xs break-all text-(--ink-soft)">
                    {warehouse.id}
                  </p>
                </div>
                <div>
                  <p className="text-(--muted)">Organization ID</p>
                  <p className="mt-1 font-mono text-xs break-all text-(--ink-soft)">
                    {warehouse.organizationId}
                  </p>
                </div>
                <Button asChild variant="pill-ghost" className="mt-2 w-fit border border-(--rule)">
                  <Link to="/inventory/warehouses">View all warehouses</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <section aria-labelledby="warehouse-locations-heading" className="mt-6">
            <Card className="overflow-hidden">
              <CardHeader>
                <h2 id="warehouse-locations-heading" className="font-display text-xl font-light">
                  Storage locations
                </h2>
                <p className="text-sm text-(--ink-soft)">
                  {locationsQuery.isPending
                    ? 'Loading locations…'
                    : locationsQuery.isError
                      ? 'Location data is unavailable.'
                      : `${totalLocations} ${totalLocations === 1 ? 'location' : 'locations'} in this warehouse.`}
                </p>
              </CardHeader>
              <div className="flex items-center justify-between gap-4 border-b border-(--rule-soft) px-5 py-3 sm:px-6">
                <p className="text-xs text-(--muted)">
                  {includeInactiveLocations
                    ? 'Active and inactive locations'
                    : 'Active locations only'}
                </p>
                <label
                  htmlFor="include-inactive-locations"
                  className="flex items-center gap-2 text-sm text-(--ink-soft)"
                >
                  Include inactive
                  <Switch
                    id="include-inactive-locations"
                    checked={includeInactiveLocations}
                    onCheckedChange={(value) => {
                      setIncludeInactiveLocations(value);
                      setLocationsPage(0);
                    }}
                    aria-label="Include inactive locations"
                  />
                </label>
              </div>
              <WarehouseLocationCreateForm
                warehouseId={warehouse.id}
                locations={locations.filter((location) => location.isActive)}
              />
              {locationsQuery.isError && !locationsQuery.data ? (
                <div className="p-8 text-center text-sm text-(--muted)">
                  Location data is unavailable. Use the retry action in the notification to try
                  again.
                </div>
              ) : locationsQuery.isPending ? (
                <div
                  className="flex items-center justify-center gap-2 p-8 text-sm text-(--muted)"
                  aria-live="polite"
                >
                  <Spinner className="size-4 text-(--accent)" aria-label="Loading locations" />
                  <span>Loading locations…</span>
                </div>
              ) : locations.length ? (
                <>
                  <div className="w-full overflow-x-auto">
                    <Table className="min-w-[680px]">
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead>Location code</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Parent location</TableHead>
                          <TableHead>Barcode</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {locations.map((location) => (
                          <TableRow key={location.id}>
                            <TableCell className="font-mono text-xs font-medium text-(--ink)">
                              {location.code}
                            </TableCell>
                            <TableCell>
                              <span className="rounded-full bg-(--paper-2) px-2 py-0.5 font-mono text-[10px] tracking-wide text-(--ink-soft)">
                                {location.type}
                              </span>
                            </TableCell>
                            <TableCell className="text-(--ink-soft)">
                              {location.parentLocationId
                                ? (locationsById.get(location.parentLocationId)?.code ??
                                  `Location ${location.parentLocationId.slice(0, 8)}`)
                                : '—'}
                            </TableCell>
                            <TableCell className="font-mono text-xs text-(--muted)">
                              {location.barcode || '—'}
                            </TableCell>
                            <TableCell>
                              <span
                                className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${location.isActive ? 'bg-(--moss-soft) text-(--moss)' : 'bg-(--paper-2) text-(--muted)'}`}
                              >
                                {location.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </TableCell>
                            <TableCell>
                              <WarehouseLocationManageSheet
                                locationId={location.id}
                                locations={locations}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  {totalPages > 1 ? (
                    <div className="flex items-center justify-between gap-3 border-t border-(--rule-soft) px-5 py-3 sm:px-6">
                      <p className="text-xs text-(--muted)">
                        Page {locationsPage + 1} of {totalPages} · {totalLocations} locations
                      </p>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="pill-ghost"
                          className="border border-(--rule)"
                          onClick={() => setLocationsPage((page) => Math.max(0, page - 1))}
                          disabled={locationsPage === 0 || locationsQuery.isFetching}
                        >
                          Previous
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="pill-ghost"
                          className="border border-(--rule)"
                          onClick={() =>
                            setLocationsPage((page) => Math.min(totalPages - 1, page + 1))
                          }
                          disabled={locationsPage >= totalPages - 1 || locationsQuery.isFetching}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </>
              ) : (
                <div className="px-5 py-12 text-center">
                  <h3 className="font-display text-xl">No locations yet</h3>
                  <p className="mt-2 text-sm text-(--muted)">
                    {includeInactiveLocations
                      ? 'There are no locations for this warehouse.'
                      : 'Create the first location for this warehouse above or include inactive locations.'}
                  </p>
                </div>
              )}
            </Card>
          </section>
        </div>
      )}
    </DashboardShell>
  );
}
