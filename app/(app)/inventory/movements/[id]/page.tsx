import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import { AppTopbar } from "../../../_components/AppTopbar";
import { Block } from "../../../_components/Block";
import { PageHeader } from "../../../_components/PageHeader";
import { getMovement } from "@/lib/api/inventory/movements-dal";
import { formatMoney } from "../../../finance/_data/format";
import { adjustmentReasonLabel, movementTypeLabel } from "../../_data/movements-query";
import { MovementTypeBadge } from "../../_components/MovementTypeBadge";

type Props = { params: Promise<{ id: string }> };

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const { id } = await params;
    const movement = await getMovement(id);
    return { title: movement ? `${movementTypeLabel(movement.type)} ${id.slice(0, 8)} · Loom` : "Movement · Loom" };
};

type ProfileRow = { label: string; value: ReactNode };

const ProfileGrid = ({ rows }: { rows: ProfileRow[] }) => (
    <Card className="p-6">
        <dl className="grid gap-x-8 gap-y-4 md:grid-cols-3">
            {rows.map((row, i) => (
                <div key={i} className="flex flex-col gap-1">
                    <dt className="font-mono text-[10px] tracking-[0.12em] text-(--muted) uppercase">{row.label}</dt>
                    <dd className="text-[14px] text-(--ink)">{row.value}</dd>
                </div>
            ))}
        </dl>
    </Card>
);

const MovementDetailPage = async ({ params }: Props) => {
    const { id } = await params;
    const movement = await getMovement(id);
    if (!movement) notFound();

    const currency = "USD";

    const profile: ProfileRow[] = [
        { label: "Type", value: <MovementTypeBadge type={movement.type} /> },
        { label: "Date", value: movement.date },
        { label: "Reference", value: movement.referenceNumber ?? "—" },
        { label: "Total value", value: formatMoney(movement.totalValue, currency) },
        {
            label: "Journal entry",
            value: movement.journalEntryId ? (
                <Link
                    href={`/finance/journal/${movement.journalEntryId}`}
                    className="text-(--accent) hover:underline">
                    Open journal
                </Link>
            ) : (
                "—"
            ),
        },
        {
            label: "Source",
            value: movement.sourceBillId ? (
                <Link href={`/finance/ap/bills/${movement.sourceBillId}`} className="text-(--accent) hover:underline">
                    Bill
                </Link>
            ) : movement.sourceInvoiceId ? (
                <Link
                    href={`/finance/ar/invoices/${movement.sourceInvoiceId}`}
                    className="text-(--accent) hover:underline">
                    Invoice
                </Link>
            ) : (
                "Manual"
            ),
        },
    ];

    if (movement.reason) {
        profile.push({ label: "Reason", value: adjustmentReasonLabel(movement.reason) });
    }
    if (movement.memo) {
        profile.push({ label: "Memo", value: movement.memo });
    }

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "Inventory", href: "/inventory" },
                    { label: "Movements", href: "/inventory/movements" },
                    { label: id.slice(0, 8) },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="Inventory · Movements"
                        title={`${movementTypeLabel(movement.type)} · ${movement.date}`}
                        description="Immutable. Corrections post as opposite-direction movements."
                    />

                    <Block title="Header" description="Movement metadata, source, and journal link.">
                        <ProfileGrid rows={profile} />
                    </Block>

                    <Block title="Lines" description="Items, warehouses, quantities, and engine-applied unit cost.">
                        <Card className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[160px]">SKU</TableHead>
                                        <TableHead>Item</TableHead>
                                        <TableHead>Warehouse</TableHead>
                                        <TableHead className="w-[110px] text-right">Quantity</TableHead>
                                        <TableHead className="w-[130px] text-right">Unit cost</TableHead>
                                        <TableHead className="w-[150px] text-right">Value change</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {movement.lines.map((line, i) => (
                                        <TableRow key={i}>
                                            <TableCell className="font-mono text-[12px] tracking-[0.02em] text-(--ink-soft)">
                                                {line.itemSku}
                                            </TableCell>
                                            <TableCell>{line.itemName}</TableCell>
                                            <TableCell className="text-(--ink-soft)">
                                                {line.toWarehouseName
                                                    ? `${line.warehouseName} → ${line.toWarehouseName}`
                                                    : line.warehouseName}
                                            </TableCell>
                                            <TableCell className="text-right font-mono text-[12px] tracking-[0.02em] text-(--ink-soft) tabular-nums">
                                                {line.quantity}
                                            </TableCell>
                                            <TableCell className="text-right font-mono text-[12px] tracking-[0.02em] text-(--ink-soft) tabular-nums">
                                                {formatMoney(line.unitCost, currency)}
                                            </TableCell>
                                            <TableCell className="text-right font-mono text-[12px] tracking-[0.02em] text-(--ink-soft) tabular-nums">
                                                {formatMoney(line.valueChange, currency)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>
                    </Block>
                </div>
            </div>
        </>
    );
};

export default MovementDetailPage;
