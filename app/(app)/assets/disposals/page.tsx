import type { Metadata } from "next";
import Link from "next/link";
import { IconArrowsExchange, IconPlus } from "@tabler/icons-react";

import { Button, Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import { listAssets } from "@/lib/api/assets/assets-dal";
import { listAssetDisposals } from "@/lib/api/assets/disposals-dal";
import { AppTopbar } from "../../_components/AppTopbar";
import { Block } from "../../_components/Block";
import { PageHeader } from "../../_components/PageHeader";
import { DisposalStatusBadge, DisposalTypeLabel } from "./_components/DisposalStatusBadge";

export const metadata: Metadata = {
    title: "Asset disposals · Tessera",
    description: "Sale, write-off, or scrap events. Posting removes the asset from the books and records the gain/loss.",
};

const DisposalsPage = async () => {
    const [disposals, assets] = await Promise.all([listAssetDisposals(), listAssets()]);
    const assetById = Object.fromEntries(
        assets.map((a) => [a.id, `${a.assetNumber} · ${a.name}`]),
    );

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "Assets", href: "/assets" },
                    { label: "Disposals" },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="Fixed assets"
                        title={
                            <>
                                Disposals<em className="text-(--accent) italic">.</em>
                            </>
                        }
                        description="Retire assets from the books. Each posting generates the gain/loss journal entry automatically."
                        actions={
                            <Button asChild variant="default" size="sm">
                                <Link href="/assets/disposals/new">
                                    <IconPlus stroke={1.8} />
                                    New disposal
                                </Link>
                            </Button>
                        }
                    />

                    <Block
                        title="History"
                        description={`${disposals.length} disposal${disposals.length === 1 ? "" : "s"} on record.`}>
                        {disposals.length === 0 ? (
                            <Card className="items-center gap-3 px-6 py-12 text-center">
                                <span className="grid size-10 place-items-center rounded-full bg-(--paper-2) text-(--muted)">
                                    <IconArrowsExchange className="size-5" stroke={1.6} />
                                </span>
                                <div className="font-display text-foreground text-xl font-[380]">
                                    No disposals yet.
                                </div>
                                <div className="max-w-80 text-sm text-(--muted)">
                                    Start one when you sell, write off, or scrap a fixed asset.
                                </div>
                            </Card>
                        ) : (
                            <Card className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[120px]">Date</TableHead>
                                            <TableHead>Asset</TableHead>
                                            <TableHead className="w-[110px]">Type</TableHead>
                                            <TableHead className="w-[140px] text-right">Proceeds</TableHead>
                                            <TableHead className="w-[110px]">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {disposals.map((d) => (
                                            <TableRow key={d.id}>
                                                <TableCell>
                                                    <Link
                                                        href={`/assets/disposals/${d.id}`}
                                                        className="font-mono text-[12px] tracking-[0.04em] text-foreground no-underline hover:text-(--accent)">
                                                        {d.disposalDate}
                                                    </Link>
                                                </TableCell>
                                                <TableCell className="text-[13px] text-(--ink-soft)">
                                                    {assetById[d.assetId] ?? d.assetId}
                                                </TableCell>
                                                <TableCell>
                                                    <DisposalTypeLabel type={d.disposalType} />
                                                </TableCell>
                                                <TableCell className="text-right font-mono text-[12px] tabular-nums">
                                                    {d.proceeds}
                                                </TableCell>
                                                <TableCell>
                                                    <DisposalStatusBadge status={d.status} />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Card>
                        )}
                    </Block>
                </div>
            </div>
        </>
    );
};

export default DisposalsPage;
