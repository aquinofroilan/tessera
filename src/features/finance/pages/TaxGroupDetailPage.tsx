import { Link } from '@tanstack/react-router'
import { ArrowLeft } from '@/components/ui/hugeicons'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardEyebrow, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DashboardShell } from '@/src/features/dashboard/components/DashboardShell'
import { useTaxGroup } from '@/src/features/finance/api/taxGroups'
import { getApiErrorMessage, getApiErrorStatus } from '@/src/lib/api-error'

type TaxGroupDetailPageProps = Readonly<{
    groupId: string
}>

const rateFormatter = new Intl.NumberFormat( undefined, { maximumFractionDigits: 4 } )

function formatRate ( rate: number ) {
    return `${ rateFormatter.format( rate ) }%`
}

function StatusBadge ( { isActive }: Readonly<{ isActive: boolean }> ) {
    return (
        <span className={ `inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${ isActive ? 'bg-(--moss-soft) text-(--moss)' : 'bg-(--paper-2) text-(--muted)' }` }>
            { isActive ? 'Active' : 'Inactive' }
        </span>
    )
}

export function TaxGroupDetailPage ( { groupId }: TaxGroupDetailPageProps ) {
    const groupQuery = useTaxGroup( groupId )
    const group = groupQuery.data
    const status = groupQuery.error ? getApiErrorStatus( groupQuery.error ) : undefined

    return (
        <DashboardShell>
            <div className="w-full">
                <Button asChild variant="pill-ghost" size="sm" className="mb-5 -ml-2 text-(--ink-soft) hover:bg-(--paper-2)">
                    <Link to="/finance/tax/groups"><ArrowLeft size={ 15 } />Tax groups</Link>
                </Button>

                { groupQuery.isPending ? (
                    <div className="flex min-h-64 items-center justify-center gap-2 text-sm text-(--muted)" aria-live="polite">
                        <Spinner className="size-4 text-(--accent)" aria-label="Loading tax group" />
                        <span>Loading tax group…</span>
                    </div>
                ) : groupQuery.isError ? (
                    <div className="flex min-h-64 flex-col items-start justify-center gap-3" role="alert">
                        <div>
                            <h1 className="font-display text-2xl font-normal">{ status === 404 ? 'Tax group not found' : 'Tax group unavailable' }</h1>
                            <p className="mt-1 text-sm text-(--accent-deep)">
                                { status === 404
                                    ? 'This group may have been removed or is not available in this organization.'
                                    : getApiErrorMessage( groupQuery.error, 'Tax group details could not be loaded. Check your connection and try again.', { 403: 'You do not have permission to view tax groups. Ask an administrator for tax:read access.' } ) }
                            </p>
                        </div>
                        { status !== 404 ? <Button type="button" variant="pill-ghost" className="border border-(--rule)" onClick={ () => { void groupQuery.refetch() } }>Retry</Button> : null }
                    </div>
                ) : group ? (
                    <>
                        <div className="mb-7 flex flex-wrap items-end justify-between gap-5 border-b border-(--rule) pb-6">
                            <div>
                                <p className="mb-3 font-mono text-[10px] tracking-[0.14em] text-(--muted) uppercase">Finance &amp; Accounting / Tax settings / Tax group</p>
                                <h1 className="font-display text-[clamp(36px,4vw,48px)] font-light leading-tight tracking-[-0.03em]">{ group.name }</h1>
                                <p className="mt-2 font-mono text-sm text-(--ink-soft)">{ group.code }</p>
                            </div>
                            <StatusBadge isActive={ group.isActive } />
                        </div>

                        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(220px,0.45fr)]">
                            <Card>
                                <CardHeader>
                                    <CardEyebrow>Group details</CardEyebrow>
                                    <CardTitle>Tax group information</CardTitle>
                                    <CardDescription>Core tax group identity and its code.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <dl className="grid gap-4 sm:grid-cols-2">
                                        <div className="min-w-0">
                                            <dt className="font-mono text-[10px] tracking-[0.12em] text-(--muted) uppercase">Group name</dt>
                                            <dd className="mt-1 break-words text-sm font-medium text-(--ink)">{ group.name }</dd>
                                        </div>
                                        <div className="min-w-0">
                                            <dt className="font-mono text-[10px] tracking-[0.12em] text-(--muted) uppercase">Group code</dt>
                                            <dd className="mt-1 break-words font-mono text-sm text-(--ink)">{ group.code }</dd>
                                        </div>
                                    </dl>
                                </CardContent>
                            </Card>

                            <Card className="border-(--accent)/25 bg-(--accent-soft)/35">
                                <CardHeader>
                                    <CardEyebrow>Combined rate</CardEyebrow>
                                    <CardTitle className="font-display text-3xl font-normal text-(--ink)">{ formatRate( group.combinedRate ) }</CardTitle>
                                    <CardDescription>Total of the rates assigned to this group.</CardDescription>
                                </CardHeader>
                            </Card>
                        </div>

                        <section className="mt-5" aria-labelledby="tax-group-rates-heading">
                            <Card className="overflow-hidden">
                                <CardHeader className="border-b border-(--rule) px-5 py-4 sm:px-6">
                                    <CardEyebrow>Rate breakdown</CardEyebrow>
                                    <h2 id="tax-group-rates-heading" className="font-display text-lg font-[380] tracking-[-0.01em]">Component tax rates</h2>
                                    <CardDescription>{ group.taxRates.length } { group.taxRates.length === 1 ? 'rate' : 'rates' } make up this tax group.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-0">
                                    { group.taxRates.length === 0 ? (
                                        <p className="px-5 py-12 text-center text-sm text-(--muted)">This tax group has no component rates.</p>
                                    ) : (
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="hover:bg-transparent">
                                                    <TableHead>Rate</TableHead>
                                                    <TableHead>Code</TableHead>
                                                    <TableHead>Authority</TableHead>
                                                    <TableHead className="text-right">Percentage</TableHead>
                                                    <TableHead>Status</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                { group.taxRates.map( rate => (
                                                    <TableRow key={ rate.id }>
                                                        <TableCell className="font-medium">{ rate.name }</TableCell>
                                                        <TableCell className="font-mono text-xs">{ rate.code }</TableCell>
                                                        <TableCell className="text-(--ink-soft)">{ rate.authority }</TableCell>
                                                        <TableCell className="text-right font-medium">{ formatRate( rate.percentage ) }</TableCell>
                                                        <TableCell><StatusBadge isActive={ rate.isActive } /></TableCell>
                                                    </TableRow>
                                                ) ) }
                                            </TableBody>
                                        </Table>
                                    ) }
                                </CardContent>
                            </Card>
                        </section>
                    </>
                ) : null }
            </div>
        </DashboardShell>
    )
}
