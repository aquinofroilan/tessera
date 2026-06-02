import type { Metadata } from "next";
import Link from "next/link";
import { IconCalendarStats, IconListDetails } from "@tabler/icons-react";

import { Card } from "@/components/ui";
import { AppTopbar } from "../../_components/AppTopbar";
import { Block } from "../../_components/Block";
import { PageHeader } from "../../_components/PageHeader";

export const metadata: Metadata = {
    title: "Asset reports · Tessera",
    description: "Asset register snapshot and projected depreciation schedule.",
};

const REPORTS = [
    {
        href: "/assets/reports/register",
        title: "Asset register",
        description: "Current state of every asset — cost, accumulated, net book value, plus org totals.",
        Icon: IconListDetails,
    },
    {
        href: "/assets/reports/depreciation-schedule",
        title: "Depreciation schedule",
        description: "Forward projection: monthly depreciation and projected NBV for each active asset.",
        Icon: IconCalendarStats,
    },
];

const ReportsLandingPage = () => (
    <>
        <AppTopbar
            crumbs={[
                { label: "Assets", href: "/assets" },
                { label: "Reports" },
            ]}
        />
        <div className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-300 p-9">
                <PageHeader
                    eyebrow="Fixed assets"
                    title={
                        <>
                            Reports<em className="text-(--accent) italic">.</em>
                        </>
                    }
                    description="Current state and forward projections off the same register that drives depreciation and disposal."
                />

                <Block title="Available reports" description="Read-only.">
                    <div className="grid gap-4 md:grid-cols-2">
                        {REPORTS.map(({ href, title, description, Icon }) => (
                            <Link key={href} href={href} className="no-underline">
                                <Card className="h-full gap-3 p-6 transition-colors hover:bg-(--paper-2)">
                                    <span className="grid size-10 place-items-center rounded-full bg-(--paper-2) text-(--accent)">
                                        <Icon className="size-5" stroke={1.6} />
                                    </span>
                                    <div className="font-display text-foreground text-xl font-[380]">{title}</div>
                                    <p className="text-[13px] text-(--ink-soft)">{description}</p>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </Block>
            </div>
        </div>
    </>
);

export default ReportsLandingPage;
