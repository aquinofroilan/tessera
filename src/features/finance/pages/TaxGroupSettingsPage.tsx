import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Plus } from '@/components/ui/hugeicons'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DashboardShell } from '@/src/features/dashboard/components/DashboardShell'
import { useTaxGroups } from '@/src/features/finance/api/taxGroups'
import type { TaxGroupResponse } from '@/src/features/finance/types/taxGroups'
import { getApiErrorMessage } from '@/src/lib/api-error'

type TaxGroupStatusFilter = 'all' | 'active' | 'inactive'

const rateFormatter = new Intl.NumberFormat( undefined, { maximumFractionDigits: 4 } )

function formatRate ( rate: number ) {
    return `${ rateFormatter.format( rate ) }%`
}

function sortTaxGroups ( groups: TaxGroupResponse[] ) {
    return [ ...groups ].sort( ( first, second ) => first.name.localeCompare( second.name ) )
}

function getTaxGroupsErrorMessage ( error: unknown ) {
    return getApiErrorMessage( error, 'Tax groups could not be loaded. Check your connection and try again.', {
        403: 'You do not have permission to view tax groups. Ask an administrator for tax:read access.',
    } )
}

export function TaxGroupSettingsPage () {
    const [ statusFilter, setStatusFilter ] = useState<TaxGroupStatusFilter>( 'all' )
    const groupsQuery = useTaxGroups( { activeOnly: false } )

    const isLoading = groupsQuery.isPending
    const error = groupsQuery.error
    const isError = groupsQuery.isError
    const allGroups = sortTaxGroups( groupsQuery.data ?? [] )
    const groups = statusFilter === 'all'
        ? allGroups
        : allGroups.filter( group => group.isActive === ( statusFilter === 'active' ) )

    const retry = () => {
        void groupsQuery.refetch()
    }

    const renderGroups = () => {
        if ( isError ) {
            return (
                <div className="flex flex-col items-start gap-3 p-6" role="alert">
                    <p className="text-sm text-(--accent-deep)">{ getTaxGroupsErrorMessage( error ) }</p>
                    <Button type="button" variant="pill-ghost" className="border border-(--rule)" onClick={ retry }>Retry</Button>
                </div>
            )
        }

        if ( isLoading ) {
            return (
                <div className="flex items-center justify-center gap-2 p-8 text-sm text-(--muted)" aria-live="polite">
                    <Spinner className="size-4 text-(--accent)" aria-label="Loading tax groups" />
                    <span>Loading tax groups…</span>
                </div>
            )
        }

        if ( groups.length === 0 ) {
            return (
                <div className="px-5 py-12 text-center">
                    <h3 className="font-display text-xl">{ statusFilter === 'all' ? 'No tax groups yet' : `No ${ statusFilter } tax groups` }</h3>
                    <p className="mt-2 text-sm text-(--muted)">
                        { statusFilter === 'all' ? 'Tax groups configured for this organization will appear here.' : `There are no ${ statusFilter } tax groups for this organization.` }
                    </p>
                </div>
            )
        }

        return (
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead>Tax group</TableHead>
                        <TableHead>Tax rates</TableHead>
                        <TableHead className="text-right">Combined rate</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    { groups.map( group => (
                        <TableRow key={ group.id }>
                            <TableCell>
                                <Link to="/finance/tax/groups/$groupId" params={ { groupId: group.id } } className="block font-medium text-(--ink) hover:underline hover:underline-offset-4 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ink)">{ group.name }</Link>
                                <span className="mt-0.5 block font-mono text-xs text-(--muted)">{ group.code }</span>
                            </TableCell>
                            <TableCell>
                                { group.taxRates.length ? (
                                    <div className="flex flex-wrap gap-1.5">
                                        { group.taxRates.map( rate => (
                                            <span key={ rate.id } className="rounded-full bg-(--paper-2) px-2 py-0.5 text-[11px] text-(--ink-soft)" title={ `${ rate.authority } · ${ rate.code }` }>
                                                { rate.name } · { formatRate( rate.percentage ) }
                                            </span>
                                        ) ) }
                                    </div>
                                ) : <span className="text-(--muted)">No rates</span> }
                            </TableCell>
                            <TableCell className="text-right font-medium">{ formatRate( group.combinedRate ) }</TableCell>
                            <TableCell>
                                <span className={ `inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${ group.isActive ? 'bg-(--moss-soft) text-(--moss)' : 'bg-(--paper-2) text-(--muted)' }` }>
                                    { group.isActive ? 'Active' : 'Inactive' }
                                </span>
                            </TableCell>
                        </TableRow>
                    ) ) }
                </TableBody>
            </Table>
        )
    }

    return (
        <DashboardShell>
            <div className="w-full">
                <div className="mb-7 flex items-end justify-between gap-6 border-b border-(--rule) pb-6 max-sm:block">
                    <div>
                        <h1 className="font-display text-[clamp(36px,4vw,48px)] font-light leading-none tracking-[-0.03em]">Tax settings</h1>
                        <p className="mt-2.5 text-[15px] text-(--ink-soft)">Review the tax groups and rates configured for this organization.</p>
                    </div>
                    <div className="mt-5 flex flex-wrap items-end gap-3 sm:mt-0">
                        <div className="grid gap-1.5 sm:min-w-40">
                            <label htmlFor="tax-group-status-filter" className="text-xs font-medium text-(--ink-soft)">Group status</label>
                            <Select value={ statusFilter } onValueChange={ value => {
                                if ( value === 'all' || value === 'active' || value === 'inactive' ) setStatusFilter( value )
                            } }>
                                <SelectTrigger id="tax-group-status-filter" className="h-10 rounded-[10px] border-(--rule) bg-(--card) text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All groups</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button asChild variant="pill-ghost" className="bg-(--ink) text-(--paper) hover:bg-(--accent)">
                            <Link to="/finance/tax/groups/new"><Plus size={ 15 } />Create tax group</Link>
                        </Button>
                    </div>
                </div>

                <section aria-labelledby="tax-groups-heading">
                    <Card className="overflow-hidden">
                        <CardHeader className="border-b border-(--rule) px-5 py-4 sm:px-6">
                            <h2 id="tax-groups-heading" className="font-display text-lg font-[380] tracking-[-0.01em]">Tax groups</h2>
                            <p className="text-sm text-(--ink-soft)">{ isLoading ? 'Loading tax groups…' : `${ allGroups.length } ${ allGroups.length === 1 ? 'group' : 'groups' } configured, including inactive groups.` }</p>
                        </CardHeader>
                        <CardContent className="p-0">{ renderGroups() }</CardContent>
                    </Card>
                </section>
            </div>
        </DashboardShell>
    )
}
