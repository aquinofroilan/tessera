import { Link } from '@tanstack/react-router'
import { Plus } from '@/components/ui/hugeicons'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { UnitConversionCard } from '@/src/features/inventory/components/UnitConversionCard'
import { UnitOfMeasureTable } from '@/src/features/inventory/components/UnitOfMeasureTable'
import { useUnitsOfMeasure } from '@/src/features/inventory/api/unitsOfMeasure'
import { DashboardShell } from '@/src/features/dashboard/components/DashboardShell'
import { getApiErrorMessage } from '@/src/lib/api-error'

export function UnitOfMeasureSettingsPage () {
    const unitsQuery = useUnitsOfMeasure( { activeOnly: false } )
    const units = [ ...( unitsQuery.data ?? [] ) ].sort( ( first, second ) => first.name.localeCompare( second.name ) )

    return (
        <DashboardShell>
            <div className="w-full">
                <header className="mb-7 flex items-end justify-between gap-6 border-b border-(--rule) pb-6 max-sm:block">
                    <div>
                        <h1 className="font-display text-[clamp(36px,4vw,48px)] font-light leading-none tracking-[-0.03em]">Units of measure</h1>
                        <p className="mt-2.5 text-[15px] text-(--ink-soft)">Manage inventory units and their base-unit conversions.</p>
                    </div>
                    <Button asChild variant="pill-ghost" className="mt-5 bg-(--ink) text-(--paper) hover:bg-(--accent) sm:mt-0">
                        <Link to="/inventory/settings/uoms/new"><Plus size={ 15 } aria-hidden="true" />Add unit</Link>
                    </Button>
                </header>

                <section aria-label="Unit conversion" className="mb-6">
                    <UnitConversionCard />
                </section>

                <section aria-labelledby="units-of-measure-heading">
                    <Card className="overflow-hidden">
                        <CardHeader className="flex-row items-center justify-between gap-4 border-b border-(--rule) px-5 py-4 sm:px-6">
                            <div>
                                <h2 id="units-of-measure-heading" className="font-display text-lg font-[380] tracking-[-0.01em]">Organization units</h2>
                                <p className="text-sm text-(--ink-soft)">{ unitsQuery.isPending ? 'Loading units…' : unitsQuery.isError ? 'Unit count is unavailable.' : `${ units.length } ${ units.length === 1 ? 'unit' : 'units' } configured, including inactive units.` }</p>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            { unitsQuery.isError ? (
                                <div className="flex flex-col items-start gap-3 p-5 sm:p-6" role="alert">
                                    <p className="text-sm text-(--accent-deep)">{ getApiErrorMessage( unitsQuery.error, 'Units of measure could not be loaded. Check your connection and try again.', { 403: 'You do not have permission to view units of measure. Ask an administrator for inventory:read access.' } ) }</p>
                                    <Button type="button" variant="pill-ghost" className="border border-(--rule)" onClick={ () => { void unitsQuery.refetch() } }>Retry</Button>
                                </div>
                            ) : unitsQuery.isPending ? (
                                <div className="flex items-center justify-center gap-2 p-8 text-sm text-(--muted)" aria-live="polite">
                                    <Spinner className="size-4 text-(--accent)" aria-label="Loading units of measure" />
                                    <span>Loading units of measure…</span>
                                </div>
                            ) : units.length ? (
                                <UnitOfMeasureTable units={ units } />
                            ) : (
                                <div className="px-5 py-12 text-center">
                                    <h3 className="font-display text-xl">No units of measure yet</h3>
                                    <p className="mt-2 text-sm text-(--muted)">Units configured for this organization will appear here.</p>
                                    <Button asChild variant="pill-ghost" className="mt-4 bg-(--ink) text-(--paper) hover:bg-(--accent)">
                                        <Link to="/inventory/settings/uoms/new"><Plus size={ 15 } aria-hidden="true" />Create a unit</Link>
                                    </Button>
                                </div>
                            ) }
                        </CardContent>
                    </Card>
                </section>
            </div>
        </DashboardShell>
    )
}
