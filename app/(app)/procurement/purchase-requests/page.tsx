import type { Metadata } from "next";
import Link from "next/link";
import { IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui";
import { listPurchaseRequests } from "@/lib/api/procurement/purchase-requests-dal";
import type { PurchaseRequestStatus } from "@/lib/api/procurement/purchase-requests";
import { AppTopbar } from "../../_components/AppTopbar";
import { Block } from "../../_components/Block";
import { PageHeader } from "../../_components/PageHeader";
import { PurchaseRequestsTable } from "./_components/PurchaseRequestsTable";

export const metadata: Metadata = {
    title: "Purchase requests · Tessera",
    description: "Requests to buy — drafted, submitted, approved, converted into POs.",
};

type Props = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const STATUSES: readonly PurchaseRequestStatus[] = [
    "DRAFT",
    "SUBMITTED",
    "APPROVED",
    "REJECTED",
    "CONVERTED",
    "CANCELLED",
];

const parseStatus = (raw: string | string[] | undefined): PurchaseRequestStatus | undefined => {
    const v = Array.isArray(raw) ? raw[0] : raw;
    return STATUSES.includes(v as PurchaseRequestStatus) ? (v as PurchaseRequestStatus) : undefined;
};

const PurchaseRequestsListPage = async ({ searchParams }: Props) => {
    const sp = await searchParams;
    const status = parseStatus(sp.status);
    const requests = await listPurchaseRequests({ status });
    const ordered = [...requests].sort((a, b) =>
        (b.createdAt ?? "").localeCompare(a.createdAt ?? ""),
    );

    return (
        <>
            <AppTopbar
                crumbs={[{ label: "Procurement", href: "/procurement" }, { label: "Purchase requests" }]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="Procurement"
                        title={
                            <>
                                Purchase requests<em className="text-(--accent) italic">.</em>
                            </>
                        }
                        description="Requests to buy. Submit, approve, then convert into a purchase order."
                        actions={
                            <Button asChild variant="default" size="sm">
                                <Link href="/procurement/purchase-requests/new">
                                    <IconPlus stroke={1.8} />
                                    New request
                                </Link>
                            </Button>
                        }
                    />

                    <Block
                        title="All requests"
                        description={`${ordered.length} request${ordered.length === 1 ? "" : "s"}${
                            status ? ` filtered to ${status.toLowerCase()}` : ""
                        }.`}>
                        <PurchaseRequestsTable rows={ordered} detailHrefBase="/procurement/purchase-requests" />
                    </Block>
                </div>
            </div>
        </>
    );
};

export default PurchaseRequestsListPage;
