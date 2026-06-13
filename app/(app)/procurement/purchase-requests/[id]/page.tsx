import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import { listVendors } from "@/lib/api/finance/vendors-dal";
import { listWarehouses } from "@/lib/api/inventory/warehouses-dal";
import { getPurchaseRequest } from "@/lib/api/procurement/purchase-requests-dal";
import { AppTopbar } from "../../../_components/AppTopbar";
import { Block } from "../../../_components/Block";
import { PageHeader } from "../../../_components/PageHeader";
import { PurchaseRequestStatusBadge } from "../../_components/PurchaseRequestStatusBadge";
import { LifecycleActions } from "./_components/LifecycleActions";

type Props = { params: Promise<{ id: string }> };

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const { id } = await params;
    const pr = await getPurchaseRequest(id);
    return { title: pr ? `${pr.prNumber} · Tessera` : "Purchase request · Tessera" };
};

const PurchaseRequestDetailPage = async ({ params }: Props) => {
    const { id } = await params;
    const pr = await getPurchaseRequest(id);
    if (!pr) notFound();

    const [vendors, warehouses] = await Promise.all([listVendors(), listWarehouses()]);
    const vendorName = pr.suggestedVendorId
        ? (vendors.find((v) => v.id === pr.suggestedVendorId)?.name ?? "—")
        : "Not specified";
    const warehouseName = pr.warehouseId
        ? (warehouses.find((w) => w.id === pr.warehouseId)?.name ?? "—")
        : "Not specified";

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "Procurement", href: "/procurement" },
                    { label: "Purchase requests", href: "/procurement/purchase-requests" },
                    { label: pr.prNumber },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="Procurement · Purchase request"
                        title={pr.prNumber}
                        description={pr.justification ?? "No justification provided."}
                        actions={<PurchaseRequestStatusBadge status={pr.status} />}
                    />

                    <Block title="Lifecycle" description="Move the request through approval.">
                        <Card className="p-6">
                            <LifecycleActions id={pr.id} status={pr.status} />
                            {pr.status !== "DRAFT" && pr.status !== "SUBMITTED" && (
                                <p className="text-[13px] text-(--muted)">
                                    No actions available — this request is{" "}
                                    <span className="text-foreground font-medium">{pr.status.toLowerCase()}</span>.
                                    {pr.decisionReason && (
                                        <>
                                            {" "}
                                            Decision reason: <em>{pr.decisionReason}</em>
                                        </>
                                    )}
                                </p>
                            )}
                        </Card>
                    </Block>

                    <Block title="Lines" description={`${pr.lines.length} item${pr.lines.length === 1 ? "" : "s"}.`}>
                        <Card className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[60px]">#</TableHead>
                                        <TableHead>Product</TableHead>
                                        <TableHead className="w-[110px] text-right">Qty</TableHead>
                                        <TableHead className="w-[130px] text-right">Est. unit cost</TableHead>
                                        <TableHead>Note</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pr.lines.map((line) => (
                                        <TableRow key={line.id}>
                                            <TableCell className="font-mono text-[11px] text-(--muted) tabular-nums">
                                                {line.lineNumber}
                                            </TableCell>
                                            <TableCell>
                                                <div className="grid gap-0.5">
                                                    <span className="text-foreground text-[14px] font-medium">
                                                        {line.productName}
                                                    </span>
                                                    <span className="font-mono text-[10px] tracking-[0.04em] text-(--ink-soft) uppercase">
                                                        {line.productSku}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-mono text-[13px] text-(--ink) tabular-nums">
                                                {line.quantity}
                                            </TableCell>
                                            <TableCell className="text-right font-mono text-[12px] text-(--ink-soft) tabular-nums">
                                                {line.estimatedUnitCost ?? "—"}
                                            </TableCell>
                                            <TableCell className="text-[12px] text-(--muted)">
                                                {line.description ?? "—"}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>
                    </Block>

                    <Block title="Routing" description="Where this request would go if approved.">
                        <Card className="p-6">
                            <dl className="grid gap-x-8 gap-y-4 md:grid-cols-2">
                                <div className="flex flex-col gap-1">
                                    <dt className="font-mono text-[10px] tracking-[0.12em] text-(--muted) uppercase">
                                        Suggested vendor
                                    </dt>
                                    <dd className="text-[14px] text-(--ink)">{vendorName}</dd>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <dt className="font-mono text-[10px] tracking-[0.12em] text-(--muted) uppercase">
                                        Receive at
                                    </dt>
                                    <dd className="text-[14px] text-(--ink)">{warehouseName}</dd>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <dt className="font-mono text-[10px] tracking-[0.12em] text-(--muted) uppercase">
                                        Requested by
                                    </dt>
                                    <dd className="font-mono text-[12px] text-(--ink-soft)">{pr.requestedBy}</dd>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <dt className="font-mono text-[10px] tracking-[0.12em] text-(--muted) uppercase">
                                        Created
                                    </dt>
                                    <dd className="font-mono text-[12px] text-(--ink-soft) tabular-nums">
                                        {pr.createdAt?.slice(0, 19).replace("T", " ") ?? "—"}
                                    </dd>
                                </div>
                            </dl>
                        </Card>
                    </Block>
                </div>
            </div>
        </>
    );
};

export default PurchaseRequestDetailPage;
