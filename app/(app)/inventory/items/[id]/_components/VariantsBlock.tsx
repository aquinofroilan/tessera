import { Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import type { VariantResponse } from "@/lib/api/inventory/variants";
import { formatMoney } from "../../../../finance/_data/format";
import { formatQuantity } from "../../../_data/format";
import { AddVariantForm } from "./AddVariantForm";

type VariantsBlockProps = {
    itemId: string;
    unitOfMeasure: string;
    currency: string;
    variants: VariantResponse[];
};

const renderAttributes = (attrs: Record<string, string>): string =>
    Object.entries(attrs)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ");

export const VariantsBlock = ({ itemId, unitOfMeasure, currency, variants }: VariantsBlockProps) => (
    <div className="grid gap-4">
        {variants.length === 0 ? (
            <Card className="items-center gap-2 px-6 py-8 text-center">
                <div className="text-sm text-(--muted)">
                    No variants yet. Add size, color, or other attribute splits below — each variant tracks its own
                    SKU and on-hand quantity.
                </div>
            </Card>
        ) : (
            <Card className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[180px]">SKU</TableHead>
                            <TableHead>Attributes</TableHead>
                            <TableHead className="w-[120px] text-right">On hand</TableHead>
                            <TableHead className="w-[140px] text-right">Sales price</TableHead>
                            <TableHead className="w-[140px] text-right">Purchase cost</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {variants.map((variant) => (
                            <TableRow key={variant.id}>
                                <TableCell className="font-mono text-[12px] tracking-[0.02em] text-(--ink)">
                                    {variant.sku}
                                </TableCell>
                                <TableCell className="text-(--ink-soft)">{renderAttributes(variant.attributes)}</TableCell>
                                <TableCell className="text-right font-mono text-[12px] tracking-[0.02em] text-(--ink-soft) tabular-nums">
                                    {formatQuantity(variant.onHand, unitOfMeasure)}
                                </TableCell>
                                <TableCell className="text-right font-mono text-[12px] tracking-[0.02em] text-(--ink-soft) tabular-nums">
                                    {variant.salesPrice ? formatMoney(variant.salesPrice, currency) : "—"}
                                </TableCell>
                                <TableCell className="text-right font-mono text-[12px] tracking-[0.02em] text-(--ink-soft) tabular-nums">
                                    {variant.purchaseCost ? formatMoney(variant.purchaseCost, currency) : "—"}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        )}
        <AddVariantForm itemId={itemId} />
    </div>
);
