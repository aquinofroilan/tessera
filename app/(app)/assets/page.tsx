import type { Metadata } from "next";
import Link from "next/link";
import { IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui";
import { listAssetCategories, listAssets } from "@/lib/api/assets/assets-dal";
import type { AssetStatus } from "@/lib/api/assets/assets";
import { AppTopbar } from "../_components/AppTopbar";
import { Block } from "../_components/Block";
import { PageHeader } from "../_components/PageHeader";
import { AssetsTable } from "./_components/AssetsTable";

export const metadata: Metadata = {
    title: "Fixed assets · Tessera",
    description: "Capital asset register — cost, accumulated depreciation, net book value.",
};

type Props = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const STATUSES: readonly AssetStatus[] = ["ACTIVE", "DISPOSED", "FULLY_DEPRECIATED"];

const parseStatus = (raw: string | string[] | undefined): AssetStatus | undefined => {
    const v = Array.isArray(raw) ? raw[0] : raw;
    return STATUSES.includes(v as AssetStatus) ? (v as AssetStatus) : undefined;
};

const AssetsListPage = async ({ searchParams }: Props) => {
    const sp = await searchParams;
    const status = parseStatus(sp.status);

    const [assets, categories] = await Promise.all([
        listAssets({ status }),
        listAssetCategories(),
    ]);
    const categoryNameById = Object.fromEntries(
        categories.map((c) => [c.id, `${c.code} · ${c.name}`]),
    );

    return (
        <>
            <AppTopbar crumbs={[{ label: "Assets" }]} />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="Fixed assets"
                        title={
                            <>
                                Asset register<em className="text-(--accent) italic">.</em>
                            </>
                        }
                        description="What you own and how much value remains. Configure GL accounts on each asset to enable depreciation posting."
                        actions={
                            <>
                                <Button asChild variant="outline" size="sm">
                                    <Link href="/assets/categories">Categories</Link>
                                </Button>
                                <Button asChild variant="default" size="sm">
                                    <Link href="/assets/new">
                                        <IconPlus stroke={1.8} />
                                        New asset
                                    </Link>
                                </Button>
                            </>
                        }
                    />

                    <Block
                        title="All assets"
                        description={`${assets.length} asset${assets.length === 1 ? "" : "s"}${
                            status ? ` filtered to ${status.toLowerCase().replace("_", " ")}` : ""
                        }.`}>
                        <AssetsTable
                            rows={assets}
                            categoryNameById={categoryNameById}
                            detailHrefBase="/assets"
                        />
                    </Block>
                </div>
            </div>
        </>
    );
};

export default AssetsListPage;
