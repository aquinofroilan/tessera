import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IconBan, IconCheck } from "@tabler/icons-react";

import { Button } from "@/components/ui";
import { AppTopbar } from "../../../_components/AppTopbar";
import { Block } from "../../../_components/Block";
import { PageHeader } from "../../../_components/PageHeader";
import { getJournalEntry } from "@/lib/api/finance/journal-dal";
import { StatusBadge } from "../../_components/StatusBadge";
import { JournalLinesTable } from "./_components/JournalLinesTable";
import { JournalSummaryCard } from "./_components/JournalSummaryCard";

type Props = { params: Promise<{ id: string }> };

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const { id } = await params;
    const entry = await getJournalEntry(id);
    return { title: entry ? `${entry.entryNumber} · Tessera` : "Journal entry · Tessera" };
};

const JournalDetailPage = async ({ params }: Props) => {
    const { id } = await params;
    const entry = await getJournalEntry(id);
    if (!entry) notFound();

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "Finance", href: "/finance" },
                    { label: "Journal", href: "/finance/journal" },
                    { label: entry.entryNumber },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="Finance · General ledger · Journal"
                        title={
                            <span className="inline-flex items-center gap-3">
                                <span className="font-mono text-[28px] tracking-[0.02em]">{entry.entryNumber}</span>
                                <StatusBadge status={entry.status === "VOIDED" ? "VOIDED" : entry.status} />
                            </span>
                        }
                        description={entry.description}
                        actions={
                            entry.status === "DRAFT" ? (
                                <Button variant="default" size="sm">
                                    <IconCheck stroke={1.8} />
                                    Post
                                </Button>
                            ) : entry.status === "POSTED" ? (
                                <Button variant="outline" size="sm">
                                    <IconBan stroke={1.8} />
                                    Void
                                </Button>
                            ) : null
                        }
                    />

                    <Block title="Summary" description="Date, source, posting state, and lineage.">
                        <JournalSummaryCard entry={entry} />
                    </Block>

                    <Block
                        title="Lines"
                        description={`${entry.lines.length} line ${entry.lines.length === 1 ? "item" : "items"} on this entry.`}>
                        <JournalLinesTable entry={entry} />
                    </Block>
                </div>
            </div>
        </>
    );
};

export default JournalDetailPage;
