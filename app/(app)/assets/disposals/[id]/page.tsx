import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getAsset } from "@/lib/api/assets/assets-dal";
import { getAssetDisposal } from "@/lib/api/assets/disposals-dal";
import { listAccounts } from "@/lib/api/finance/accounts-dal";
import { AppTopbar } from "../../../_components/AppTopbar";
import { Block } from "../../../_components/Block";
import { PageHeader } from "../../../_components/PageHeader";
import { ProfileGrid, type ProfileRow } from "../../../hr/_components/ProfileGrid";
import { DisposalStatusBadge, DisposalTypeLabel } from "../_components/DisposalStatusBadge";
import { PostDisposalButton } from "./_components/PostDisposalButton";

type Props = { params: Promise<{ id: string }> };

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const { id } = await params;
    const d = await getAssetDisposal(id);
    return { title: d ? `Disposal ${d.disposalDate} · Tessera` : "Disposal · Tessera" };
};

const DisposalDetailPage = async ({ params }: Props) => {
    const { id } = await params;
    const disposal = await getAssetDisposal(id);
    if (!disposal) notFound();

    const [asset, accounts] = await Promise.all([getAsset(disposal.assetId), listAccounts()]);
    const accountNameById = Object.fromEntries(accounts.map((a) => [a.id, `${a.code} · ${a.name}`]));

    const rows: ProfileRow[] = [
        {
            label: "Asset",
            value: asset ? (
                <Link href={`/assets/${asset.id}`}>
                    {asset.assetNumber} · {asset.name}
                </Link>
            ) : (
                disposal.assetId
            ),
        },
        { label: "Date", value: disposal.disposalDate },
        { label: "Type", value: <DisposalTypeLabel type={disposal.disposalType} /> },
        { label: "Proceeds", value: disposal.proceeds },
        { label: "Status", value: <DisposalStatusBadge status={disposal.status} /> },
        {
            label: "Gain / loss account",
            value: disposal.gainLossAccountId
                ? (accountNameById[disposal.gainLossAccountId] ?? "—")
                : "Not configured",
        },
        {
            label: "Cash account",
            value: disposal.cashAccountId
                ? (accountNameById[disposal.cashAccountId] ?? "—")
                : disposal.proceeds === "0"
                  ? "Not required (zero proceeds)"
                  : "Not configured",
        },
        { label: "Journal entry", value: disposal.journalEntryId ?? "—" },
        { label: "Notes", value: disposal.notes ?? "—" },
    ];

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "Assets", href: "/assets" },
                    { label: "Disposals", href: "/assets/disposals" },
                    { label: disposal.disposalDate },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-300 p-9">
                    <PageHeader
                        eyebrow={`Fixed assets · Disposal`}
                        title={asset ? `${asset.assetNumber} · ${asset.name}` : "Disposal"}
                        description={disposal.notes ?? "Review and post to retire the asset."}
                        actions={
                            <div className="flex flex-wrap items-center gap-2.5">
                                <DisposalStatusBadge status={disposal.status} />
                                {disposal.status === "DRAFT" && <PostDisposalButton id={disposal.id} />}
                            </div>
                        }
                    />

                    <Block title="Disposal" description="Posting generates the GL entry and flips the asset to DISPOSED.">
                        <ProfileGrid rows={rows} />
                    </Block>
                </div>
            </div>
        </>
    );
};

export default DisposalDetailPage;
