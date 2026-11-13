import { Link } from '@tanstack/react-router'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { UnitOfMeasureResponse } from '@/src/features/inventory/types/unitsOfMeasure'

type UnitOfMeasureTableProps = Readonly<{
    units: UnitOfMeasureResponse[]
    baseUnits?: UnitOfMeasureResponse[]
}>

export function UnitOfMeasureTable ( { units, baseUnits = units }: UnitOfMeasureTableProps ) {
    const unitsById = new Map( baseUnits.map( unit => [ unit.id, unit ] ) )

    return (
        <div className="w-full overflow-x-auto">
            <Table className="min-w-[720px]">
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="whitespace-nowrap">Unit</TableHead>
                        <TableHead className="whitespace-nowrap">Base unit</TableHead>
                        <TableHead className="whitespace-nowrap text-right">Conversion factor</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="whitespace-nowrap">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    { units.map( unit => {
                        const baseUnit = unit.baseUomId ? unitsById.get( unit.baseUomId ) : undefined

                        return (
                            <TableRow key={ unit.id }>
                                <TableCell>
                                    <Link
                                        to="/inventory/settings/uoms/$uomId"
                                        params={ { uomId: unit.id } }
                                        className="block w-fit whitespace-nowrap font-medium text-(--ink) hover:underline hover:underline-offset-4 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ink)"
                                    >
                                        { unit.name }
                                    </Link>
                                    <span className="mt-0.5 block font-mono text-xs text-(--muted)">{ unit.code }</span>
                                </TableCell>
                                <TableCell className="whitespace-nowrap text-(--ink-soft)">{ unit.baseUomId ? baseUnit?.name ?? `Unit ${ unit.baseUomId.slice( 0, 8 ) }` : 'Base unit' }</TableCell>
                                <TableCell className="whitespace-nowrap text-right font-medium">{ unit.conversionFactor }</TableCell>
                                <TableCell className="max-w-[40ch] truncate text-(--ink-soft)">{ unit.description || '—' }</TableCell>
                                <TableCell>
                                    <span className={ `inline-flex whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium ${ unit.isActive ? 'bg-(--moss-soft) text-(--moss)' : 'bg-(--paper-2) text-(--muted)' }` }>
                                        { unit.isActive ? 'Active' : 'Inactive' }
                                    </span>
                                </TableCell>
                            </TableRow>
                        )
                    } ) }
                </TableBody>
            </Table>
        </div>
    )
}
