import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DashboardShell } from '@/src/features/dashboard/components/DashboardShell'
import { useTaxGroups } from '@/src/features/finance/api/taxGroups'
import { useTaxRates } from '@/src/features/finance/api/taxRates'
import type { TaxGroupResponse } from '@/src/features/finance/types/taxGroups'
import type { TaxRateResponse } from '@/src/features/finance/types/taxRates'
import { getApiErrorMessage } from '@/src/lib/api-error'

const rateFormatter = new Intl.NumberFormat( undefined, { maximumFractionDigits: 4 } )

function formatRate ( rate: number ) {
    return `${ rateFormatter.format( rate ) }%`
}

function StatusBadge ( { isActive }: Readonly<{ isActive: boolean }> ) {
    return (
        <span className={ `inline-flex whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium ${ isActive ? 'bg-(--moss-soft) text-(--moss)' : 'bg-(--paper-2) text-(--muted)' }` }>
            { isActive ? 'Active' : 'Inactive' }
        </span>
    )
}

function TaxGroupsTable ( { groups }: Readonly<{ groups: TaxGroupResponse[] }> ) {
    if ( !groups.length ) {
        return (
            <div className="px-5 py-12 text-center">
                <h3 className="font-display text-xl">No tax groups yet</h3>
                <p className="mt-2 text-sm text-(--muted)">Tax groups configured for this organization will appear here.</p>
                <Button asChild variant="pill-ghost" className="mt-4 bg-(--ink) text-(--paper) hover:bg-(--accent)">
                    <Link to="/finance/tax/groups/new">Create tax group</Link>
                </Button>
            </div>
        )
    }

    return (
        <Table className="min-w-[720px]">
            <TableHeader>
                <TableRow className="hover:bg-transparent">
                    <TableHead className="whitespace-nowrap">Tax group</TableHead>
                    <TableHead className="whitespace-nowrap">Tax rates</TableHead>
                    <TableHead className="whitespace-nowrap text-right">Combined rate</TableHead>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                { groups.map( group => (
                    <TableRow key={ group.id }>
                        <TableCell>
                            <Link to="/finance/tax/groups/$groupId" params={ { groupId: group.id } } className="block w-fit whitespace-nowrap font-medium text-(--ink) hover:underline hover:underline-offset-4 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ink)">{ group.name }</Link>
                            <span className="mt-0.5 block font-mono text-xs text-(--muted)">{ group.code }</span>
                        </TableCell>
                        <TableCell>
                            { group.taxRates.length ? (
                                <div className="flex flex-wrap gap-1.5">
                                    { group.taxRates.map( rate => (
                                        <span key={ rate.id } className="whitespace-nowrap rounded-full bg-(--paper-2) px-2 py-0.5 text-[11px] text-(--ink-soft)" title={ `${ rate.authority } · ${ rate.code }` }>
                                            { rate.name } · { formatRate( rate.percentage ) }
                                        </span>
                                    ) ) }
                                </div>
                            ) : <span className="text-(--muted)">No rates</span> }
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-right font-medium">{ formatRate( group.combinedRate ) }</TableCell>
                        <TableCell><StatusBadge isActive={ group.isActive } /></TableCell>
                    </TableRow>
                ) ) }
            </TableBody>
        </Table>
    )
}

function TaxRatesTable ( { rates }: Readonly<{ rates: TaxRateResponse[] }> ) {
    if ( !rates.length ) {
        return (
            <div className="px-5 py-12 text-center">
                <h3 className="font-display text-xl">No tax rates yet</h3>
                <p className="mt-2 text-sm text-(--muted)">Tax rates configured for this organization will appear here.</p>
                <Button asChild variant="pill-ghost" className="mt-4 bg-(--ink) text-(--paper) hover:bg-(--accent)">
                    <Link to="/finance/tax/rates/new">Create tax rate</Link>
                </Button>
            </div>
        )
    }

    return (
        <Table className="min-w-[720px]">
            <TableHeader>
                <TableRow className="hover:bg-transparent">
                    <TableHead className="whitespace-nowrap">Tax rate</TableHead>
                    <TableHead className="whitespace-nowrap">Authority</TableHead>
                    <TableHead className="whitespace-nowrap text-right">Percentage</TableHead>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                { rates.map( rate => (
                    <TableRow key={ rate.id }>
                        <TableCell>
                            <span className="block whitespace-nowrap font-medium text-(--ink)">{ rate.name }</span>
                            <span className="mt-0.5 block font-mono text-xs text-(--muted)">{ rate.code }</span>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{ rate.authority }</TableCell>
                        <TableCell className="whitespace-nowrap text-right font-medium">{ formatRate( rate.percentage ) }</TableCell>
                        <TableCell><StatusBadge isActive={ rate.isActive } /></TableCell>
                    </TableRow>
                ) ) }
            </TableBody>
        </Table>
    )
}

export function FinanceHomePage () {
    const groupsQuery = useTaxGroups( { activeOnly: false } )
    const ratesQuery = useTaxRates( { activeOnly: null } )
    const groups = [ ...( groupsQuery.data ?? [] ) ].sort( ( first, second ) => first.name.localeCompare( second.name ) )
    const rates = [ ...( ratesQuery.data ?? [] ) ].sort( ( first, second ) => first.name.localeCompare( second.name ) )

    return (
        <DashboardShell>
            <div className="w-full">
                <header className="mb-7 border-b border-(--rule) pb-6">
                    <h1 className="font-display text-[clamp(36px,4vw,48px)] font-light leading-none tracking-[-0.03em]">Finance</h1>
                    <p className="mt-2.5 max-w-2xl text-[15px] text-(--ink-soft)">Review the tax groups and rates configured for this organization.</p>
                </header>

                <section aria-labelledby="finance-tax-groups-heading" className="mb-6 min-w-0">
                    <Card className="overflow-hidden">
                        <CardHeader className="flex-row items-center justify-between gap-4 border-b border-(--rule) px-5 py-4 sm:px-6">
                            <div>
                                <h2 id="finance-tax-groups-heading" className="font-display text-lg font-[380] tracking-[-0.01em]">Tax groups</h2>
                                <p className="text-sm text-(--ink-soft)">{ groupsQuery.isPending ? 'Loading tax groups…' : `${ groups.length } ${ groups.length === 1 ? 'group' : 'groups' } configured, including inactive groups.` }</p>
                            </div>
                            <Button asChild variant="pill-ghost" size="sm" className="shrink-0 border border-(--rule)">
                                <Link to="/finance/tax/groups">View all</Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            { groupsQuery.isError ? (
                                <div className="flex flex-col items-start gap-3 p-5 sm:p-6" role="alert">
                                    <p className="text-sm text-(--accent-deep)">{ getApiErrorMessage( groupsQuery.error, 'Tax groups could not be loaded. Check your connection and try again.', { 403: 'You do not have permission to view tax groups. Ask an administrator for tax:read access.' } ) }</p>
                                    <Button type="button" variant="pill-ghost" className="border border-(--rule)" onClick={ () => { void groupsQuery.refetch() } }>Retry</Button>
                                </div>
                            ) : groupsQuery.isPending ? (
                                <div className="flex items-center justify-center gap-2 p-8 text-sm text-(--muted)" aria-live="polite">
                                    <Spinner className="size-4 text-(--accent)" aria-label="Loading tax groups" />
                                    <span>Loading tax groups…</span>
                                </div>
                            ) : <TaxGroupsTable groups={ groups } /> }
                        </CardContent>
                    </Card>
                </section>

                <section aria-labelledby="finance-tax-rates-heading" className="min-w-0">
                    <Card className="overflow-hidden">
                        <CardHeader className="flex-row items-center justify-between gap-4 border-b border-(--rule) px-5 py-4 sm:px-6">
                            <div>
                                <h2 id="finance-tax-rates-heading" className="font-display text-lg font-[380] tracking-[-0.01em]">Tax rates</h2>
                                <p className="text-sm text-(--ink-soft)">{ ratesQuery.isPending ? 'Loading tax rates…' : `${ rates.length } ${ rates.length === 1 ? 'rate' : 'rates' } configured, including inactive rates.` }</p>
                            </div>
                            <Button asChild variant="pill-ghost" size="sm" className="shrink-0 border border-(--rule)">
                                <Link to="/finance/tax/rates">View all</Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            { ratesQuery.isError ? (
                                <div className="flex flex-col items-start gap-3 p-5 sm:p-6" role="alert">
                                    <p className="text-sm text-(--accent-deep)">{ getApiErrorMessage( ratesQuery.error, 'Tax rates could not be loaded. Check your connection and try again.', { 403: 'You do not have permission to view tax rates. Ask an administrator for tax:read access.' } ) }</p>
                                    <Button type="button" variant="pill-ghost" className="border border-(--rule)" onClick={ () => { void ratesQuery.refetch() } }>Retry</Button>
                                </div>
                            ) : ratesQuery.isPending ? (
                                <div className="flex items-center justify-center gap-2 p-8 text-sm text-(--muted)" aria-live="polite">
                                    <Spinner className="size-4 text-(--accent)" aria-label="Loading tax rates" />
                                    <span>Loading tax rates…</span>
                                </div>
                            ) : <TaxRatesTable rates={ rates } /> }
                        </CardContent>
                    </Card>
                </section>
            </div>
        </DashboardShell>
    )
}
