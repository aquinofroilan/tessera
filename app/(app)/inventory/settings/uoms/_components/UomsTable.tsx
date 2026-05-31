import { Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import type { UomResponse } from "@/lib/api/inventory/uoms";

export const UomsTable = ({ rows }: { rows: UomResponse[] }) => {
    if (!rows.length) {
        return (
            <Card className="items-center gap-2 px-6 py-8 text-center">
                <div className="text-sm text-(--muted)">
                    No units configured yet. Add one below — common starters are EA, KG, BOX, HOUR.
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-0">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[120px]">Code</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="w-[120px] text-right">Precision</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell className="font-mono text-[12px] tracking-[0.02em] text-(--ink)">
                                {row.code}
                            </TableCell>
                            <TableCell className="text-(--ink-soft)">{row.name}</TableCell>
                            <TableCell className="text-right font-mono text-[12px] tabular-nums text-(--ink-soft)">
                                {row.precision}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
};
