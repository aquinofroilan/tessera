import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { DashboardShell } from '@/src/features/dashboard/components/DashboardShell'
import { UnitOfMeasureDeactivateDialog } from '@/src/features/inventory/components/UnitOfMeasureDeactivateDialog'
import { UnitOfMeasureEditSheet } from '@/src/features/inventory/components/UnitOfMeasureEditSheet'
import { useUnitOfMeasure, useUnitsOfMeasure } from '@/src/features/inventory/api/unitsOfMeasure'
import { getApiErrorMessage } from '@/src/lib/api-error'

type UnitOfMeasureDetailPageProps = Readonly<{
    unitId: string
}>

function DetailItem ( { label, children }: Readonly<{ label: string, children: ReactNode }> ) {
    return (
        <div className="grid gap-1 border-b border-(--rule-soft) py-3 last:border-b-0 sm:grid-cols-[180px_1fr] sm:gap-4">
            <dt className="text-sm text-(--muted)">{ label }</dt>
            <dd className="min-w-0 text-sm text-(--ink)">{ children }</dd>
        </div>
    )
}

export function UnitOfMeasureDetailPage ( { unitId }: UnitOfMeasureDetailPageProps ) {
    const unitQuery = useUnitOfMeasure( unitId )
    const unitsQuery = useUnitsOfMeasure( { activeOnly: false } )

    return (
        <DashboardShell>
            { unitQuery.isError ? (
                <div className="flex w-full flex-col items-start gap-3" role="alert">
                    <p className="text-sm text-(--accent-deep)">{ getApiErrorMessage( unitQuery.error, 'The unit could not be loaded. Check your connection and try again.', { 403: 'You do not have permission to view units of measure. Ask an administrator for inventory:read access.' } ) }</p>
                    <Button type="button" variant="pill-ghost" className="border border-(--rule)" onClick={ () => { void unitQuery.refetch() } }>Retry</Button>
                </div>
            ) : unitQuery.isPending ? (
                <div className="flex w-full items-center justify-center gap-2 p-12 text-sm text-(--muted)" aria-live="polite">
                    <Spinner className="size-4 text-(--accent)" aria-label="Loading unit" />
                    <span>Loading unit…</span>
                </div>
            ) : unitQuery.data ? (
                <div className="w-full">
                    <header className="mb-7 flex flex-wrap items-end justify-between gap-5 border-b border-(--rule) pb-6">
                        <div>
                            <p className="mb-2 font-mono text-[10px] tracking-[0.14em] text-(--muted) uppercase">{ unitQuery.data.code }</p>
                            <h1 className="font-display text-[clamp(36px,4vw,48px)] font-light leading-none tracking-[-0.03em]">{ unitQuery.data.name }</h1>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className={ `inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${ unitQuery.data.isActive ? 'bg-(--moss-soft) text-(--moss)' : 'bg-(--paper-2) text-(--muted)' }` }>{ unitQuery.data.isActive ? 'Active' : 'Inactive' }</span>
                            <UnitOfMeasureEditSheet unit={ unitQuery.data } />
                            { unitQuery.data.isActive ? <UnitOfMeasureDeactivateDialog unit={ unitQuery.data } /> : null }
                        </div>
                    </header>

                    <div className="grid w-full gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(260px,0.8fr)]">
                        <Card>
                            <CardHeader>
                                <h2 className="font-display text-xl font-light">Unit details</h2>
                                <p className="text-sm text-(--ink-soft)">Definition and conversion information for this unit.</p>
                            </CardHeader>
                            <CardContent>
                                <dl>
                                    <DetailItem label="Code">{ unitQuery.data.code }</DetailItem>
                                    <DetailItem label="Name">{ unitQuery.data.name }</DetailItem>
                                    <DetailItem label="Description">{ unitQuery.data.description || '—' }</DetailItem>
                                    <DetailItem label="Base unit">
                                        { unitQuery.data.baseUomId
                                            ? unitsQuery.data?.find( unit => unit.id === unitQuery.data.baseUomId )?.name ?? `Unit ${ unitQuery.data.baseUomId.slice( 0, 8 ) }`
                                            : 'Base unit' }
                                    </DetailItem>
                                    <DetailItem label="Conversion factor">{ unitQuery.data.conversionFactor }</DetailItem>
                                </dl>
                                { unitsQuery.isError ? <p className="mt-3 text-xs text-(--muted)">Base-unit names are unavailable. The saved unit ID is shown where needed.</p> : null }
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <h2 className="font-display text-xl font-light">Record information</h2>
                            </CardHeader>
                            <CardContent className="grid gap-3 text-sm">
                                <div>
                                    <p className="text-(--muted)">Unit ID</p>
                                    <p className="mt-1 break-all font-mono text-xs text-(--ink-soft)">{ unitQuery.data.id }</p>
                                </div>
                                <Button asChild variant="pill-ghost" className="mt-2 w-fit border border-(--rule)">
                                    <Link to="/inventory/settings/uoms">View all units</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            ) : null }
        </DashboardShell>
    )
}
