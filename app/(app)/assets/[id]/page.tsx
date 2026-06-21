import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getAsset, listAssetCategories } from "@/lib/api/assets/assets-dal";
import { listAccounts } from "@/lib/api/finance/accounts-dal";
import { AppTopbar } from "../../_components/AppTopbar";
import { Block } from "../../_components/Block";
import { PageHeader } from "../../_components/PageHeader";
import { AssetStatusBadge } from "../_components/AssetStatusBadge";
import { ProfileGrid, type ProfileRow } from "../../hr/_components/ProfileGrid";
import { EditAssetForm } from "./_components/EditAssetForm";

type Props = { params: Promise<{ id: string }> };

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const { id } = await params;
    const asset = await getAsset(id);
    return { title: asset ? `${asset.assetNumber} · Tessera` : "Asset · Tessera" };
};

const AssetDetailPage = async ({ params }: Props) => {
    const { id } = await params;
    const asset = await getAsset(id);
    if (!asset) notFound();

    const [categories, accounts] = await Promise.all([listAssetCategories(true), listAccounts()]);
    const category = asset.categoryId ? categories.find((c) => c.id === asset.categoryId) : null;
    const accountNameById = Object.fromEntries(accounts.map((a) => [a.id, `${a.code} · ${a.name}`]));

    const profileRows: ProfileRow[] = [
        { label: "Asset #", value: asset.assetNumber },
        { label: "Category", value: category ? `${category.code} · ${category.name}` : "Uncategorised" },
        { label: "Acquired", value: asset.acquisitionDate },
        { label: "Cost", value: asset.acquisitionCost },
        { label: "Salvage", value: asset.salvageValue },
        { label: "Useful life", value: `${asset.usefulLifeMonths} months` },
        { label: "Accumulated depreciation", value: asset.accumulatedDepreciation },
        { label: "Net book value", value: asset.netBookValue },
        { label: "Status", value: <AssetStatusBadge status={asset.status} /> },
        { label: "Location", value: asset.location ?? "—" },
        { label: "Serial #", value: asset.serialNumber ?? "—" },
        {
            label: "GL — Asset",
            value: asset.assetAccountId ? (accountNameById[asset.assetAccountId] ?? "—") : "Not configured",
        },
        {
            label: "GL — Accumulated",
            value: asset.accumulatedDepreciationAccountId
                ? (accountNameById[asset.accumulatedDepreciationAccountId] ?? "—")
                : "Not configured",
        },
        {
            label: "GL — Expense",
            value: asset.depreciationExpenseAccountId
                ? (accountNameById[asset.depreciationExpenseAccountId] ?? "—")
                : "Not configured",
        },
    ];

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "Assets", href: "/assets" },
                    { label: asset.assetNumber },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-300 p-9">
                    <PageHeader
                        eyebrow="Fixed asset"
                        title={asset.name}
                        description={asset.description ?? `Asset ${asset.assetNumber}.`}
                        actions={<AssetStatusBadge status={asset.status} />}
                    />

                    <Block title="Snapshot" description="Current state on the books.">
                        <ProfileGrid rows={profileRows} />
                    </Block>

                    <Block
                        title="Edit"
                        description="Acquisition cost, salvage, and useful life are immutable — change category, location, notes, or GL routing here.">
                        <EditAssetForm
                            id={asset.id}
                            defaultValues={{
                                name: asset.name,
                                description: asset.description ?? "",
                                categoryId: asset.categoryId ?? "",
                                acquisitionDate: asset.acquisitionDate,
                                acquisitionCost: asset.acquisitionCost,
                                salvageValue: asset.salvageValue,
                                usefulLifeMonths: String(asset.usefulLifeMonths),
                                location: asset.location ?? "",
                                serialNumber: asset.serialNumber ?? "",
                                assetAccountId: asset.assetAccountId ?? "",
                                accumulatedDepreciationAccountId: asset.accumulatedDepreciationAccountId ?? "",
                                depreciationExpenseAccountId: asset.depreciationExpenseAccountId ?? "",
                            }}
                            categories={categories.map((c) => ({ id: c.id, label: `${c.code} · ${c.name}` }))}
                            accounts={accounts.map((a) => ({ id: a.id, label: `${a.code} · ${a.name}` }))}
                        />
                    </Block>
                </div>
            </div>
        </>
    );
};

export default AssetDetailPage;
