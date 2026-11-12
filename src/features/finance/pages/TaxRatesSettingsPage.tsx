import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Pencil, Plus, Trash2 } from '@/components/ui/hugeicons'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TaxRateDeactivateDialog } from '@/src/features/finance/components/TaxRateDeactivateDialog'
import { TaxRateEditDialog } from '@/src/features/finance/components/TaxRateEditDialog'
import { useTaxRates } from '@/src/features/finance/api/taxRates'
import type { TaxRateResponse } from '@/src/features/finance/types/taxRates'
import { getApiErrorMessage } from '@/src/lib/api-error'
import { DashboardShell } from '@/src/features/dashboard/components/DashboardShell'

type TaxRateStatusFilter = 'all' | 'active' | 'inactive'

const rateFormatter = new Intl.NumberFormat( undefined, { maximumFractionDigits: 4 } )

function formatRate ( rate: number ) {
    return `${ rateFormatter.format( rate ) }%`
}

function sortTaxRates ( rates: TaxRateResponse[] ) {
    return [ ...rates ].sort( ( first, second ) => first.name.localeCompare( second.name ) )
}

function getTaxRatesErrorMessage ( error: unknown ) {
    return getApiErrorMessage( error, 'Tax rates could not be loaded. Check your connection and try again.', {
        403: 'You do not have permission to view tax rates. Ask an administrator for tax:read access.',
    } )
}

export function TaxRatesSettingsPage () {
    const [ statusFilter, setStatusFilter ] = useState<TaxRateStatusFilter>( 'all' )
    const [ editingRate, setEditingRate ] = useState<TaxRateResponse | null>( null )
    const [ deactivatingRate, setDeactivatingRate ] = useState<TaxRateResponse | null>( null )
    const ratesQuery = useTaxRates( { activeOnly: null } )
    const allRates = sortTaxRates( ratesQuery.data ?? [] )
    const rates = statusFilter === 'all'
        ? allRates
        : allRates.filter( rate => rate.isActive === ( statusFilter === 'active' ) )

    const renderRates = () => {
        if ( ratesQuery.isError ) {
            return (
                <div className="flex flex-col items-start gap-3 p-6" role="alert">
                    <p className="text-sm text-(--accent-deep)">{ getTaxRatesErrorMessage( ratesQuery.error ) }</p>
                    <Button type="button" variant="pill-ghost" className="border border-(--rule)" onClick={ () => { void ratesQuery.refetch() } }>Retry</Button>
                </div>
            )
        }

        if ( ratesQuery.isPending ) {
            return (
                <div className="flex items-center justify-center gap-2 p-8 text-sm text-(--muted)" aria-live="polite">
                    <Spinner className="size-4 text-(--accent)" aria-label="Loading tax rates" />
                    <span>Loading tax rates…</span>
                </div>
            )
        }

        if ( rates.length === 0 ) {
            const emptyMessage = statusFilter === 'all' ? 'No tax rates yet' : `No ${ statusFilter } tax rates`
            return (
                <div className="px-5 py-12 text-center">
                    <h3 className="font-display text-xl">{ emptyMessage }</h3>
                    <p className="mt-2 text-sm text-(--muted)">
                        { statusFilter === 'all' ? 'Tax rates configured for this organization will appear here.' : `There are no ${ statusFilter } tax rates for this organization.` }
                    </p>
                    { statusFilter === 'all' ? (
                        <Button asChild variant="pill-ghost" className="mt-4 bg-(--ink) text-(--paper) hover:bg-(--accent)">
                            <Link to="/finance/tax/rates/new"><Plus size={ 15 } />Create a tax rate</Link>
                        </Button>
                    ) : null }
                </div>
            )
        }

        return (
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead>Tax rate</TableHead>
                        <TableHead>Authority</TableHead>
                        <TableHead className="text-right">Percentage</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    { rates.map( rate => (
                        <TableRow key={ rate.id }>
                            <TableCell>
                                <span className="block font-medium text-(--ink)">{ rate.name }</span>
                                <span className="mt-0.5 block font-mono text-xs text-(--muted)">{ rate.code }</span>
                            </TableCell>
                            <TableCell>{ rate.authority }</TableCell>
                            <TableCell className="text-right font-medium">{ formatRate( rate.percentage ) }</TableCell>
                            <TableCell>
                                <span className={ `inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${ rate.isActive ? 'bg-(--moss-soft) text-(--moss)' : 'bg-(--paper-2) text-(--muted)' }` }>
                                    { rate.isActive ? 'Active' : 'Inactive' }
                                </span>
                            </TableCell>
                            <TableCell>
                                <div className="flex justify-end gap-1">
                                    <Button type="button" variant="pill-ghost" size="sm" onClick={ () => setEditingRate( rate ) } aria-label={ `Edit ${ rate.name }` }>
                                        <Pencil size={ 14 } />Edit
                                    </Button>
                                    { rate.isActive ? (
                                        <Button type="button" variant="pill-ghost" size="sm" className="text-(--accent-deep) hover:bg-(--accent-soft)" onClick={ () => setDeactivatingRate( rate ) } aria-label={ `Deactivate ${ rate.name }` }>
                                            <Trash2 size={ 14 } />Deactivate
                                        </Button>
                                    ) : null }
                                </div>
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
                        <p className="mb-3 font-mono text-[10px] tracking-[0.14em] text-(--muted) uppercase">Finance &amp; Accounting / Tax settings</p>
                        <h1 className="font-display text-[clamp(36px,4vw,48px)] font-light leading-none tracking-[-0.03em]">Tax rates</h1>
                        <p className="mt-2.5 text-[15px] text-(--ink-soft)">Manage the rates available to this organization’s tax groups.</p>
                    </div>
                    <div className="mt-5 flex flex-wrap items-end gap-3 sm:mt-0">
                        <div className="grid gap-1.5 sm:min-w-36">
                            <label htmlFor="tax-rate-status-filter" className="text-xs font-medium text-(--ink-soft)">Rate status</label>
                            <Select value={ statusFilter } onValueChange={ value => {
                                if ( value === 'all' || value === 'active' || value === 'inactive' ) setStatusFilter( value )
                            } }>
                                <SelectTrigger id="tax-rate-status-filter" className="h-10 rounded-[10px] border-(--rule) bg-(--card) text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All rates</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button asChild variant="pill-ghost" className="bg-(--ink) text-(--paper) hover:bg-(--accent)">
                            <Link to="/finance/tax/rates/new"><Plus size={ 15 } />Create tax rate</Link>
                        </Button>
                    </div>
                </div>

                <section aria-labelledby="tax-rates-heading">
                    <Card className="overflow-hidden">
                        <CardHeader className="border-b border-(--rule) px-5 py-4 sm:px-6">
                            <h2 id="tax-rates-heading" className="font-display text-lg font-[380] tracking-[-0.01em]">Organization rates</h2>
                            <p className="text-sm text-(--ink-soft)">{ ratesQuery.isPending ? 'Loading tax rates…' : `${ allRates.length } ${ allRates.length === 1 ? 'rate' : 'rates' } configured, including inactive rates.` }</p>
                        </CardHeader>
                        <CardContent className="p-0">{ renderRates() }</CardContent>
                    </Card>
                </section>
            </div>
            { editingRate ? <TaxRateEditDialog key={ editingRate.id } rate={ editingRate } onOpenChange={ open => { if ( !open ) setEditingRate( null ) } } /> : null }
            { deactivatingRate ? <TaxRateDeactivateDialog key={ deactivatingRate.id } rate={ deactivatingRate } onOpenChange={ open => { if ( !open ) setDeactivatingRate( null ) } } /> : null }
        </DashboardShell>
    )
}
