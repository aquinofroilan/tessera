import type { Metadata } from "next";
import Link from "next/link";
import { IconDownload, IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui";
import { AppTopbar } from "../../_components/AppTopbar";
import { Block } from "../../_components/Block";
import { PageHeader } from "../../_components/PageHeader";
import { PaginationFooter } from "../_components/PaginationFooter";
import { JournalTable } from "./_components/JournalTable";
import { JournalToolbar } from "./_components/JournalToolbar";
import { listJournalEntries } from "@/lib/api/finance/journal-dal";
import { countByStatus, filterJournal, paginate, parseJournalQuery } from "./_data/filter";

export const metadata: Metadata = {
    title: "Journal · Tessera",
    description: "Every debit and credit. Manual and system-generated entries.",
};

type Props = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const JournalListPage = async ({ searchParams }: Props) => {
    const sp = await searchParams;
    const query = parseJournalQuery(sp);
    const journalEntries = await listJournalEntries();
    const counts = countByStatus(journalEntries);
    const filtered = filterJournal(journalEntries, query);
    const { rows: pageRows, window } = paginate(filtered, query.page);

    return (
        <>
            <AppTopbar crumbs={[{ label: "Finance", href: "/finance" }, { label: "Journal" }]} />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="Finance · General ledger"
                        title={
                            <>
                                Journal<em className="text-(--accent) italic">.</em>
                            </>
                        }
                        description="Every debit and credit. Filter by status, search by entry number, description, or source reference."
                        actions={
                            <>
                                <Button variant="outline" size="sm">
                                    <IconDownload stroke={1.8} />
                                    Export
                                </Button>
                                <Button asChild variant="default" size="sm">
                                    <Link href="/finance/journal/new">
                                        <IconPlus stroke={1.8} />
                                        New entry
                                    </Link>
                                </Button>
                            </>
                        }
                    />

                    <Block
                        title="All entries"
                        description={`${filtered.length} of ${journalEntries.length} entries match your filters.`}>
                        <div className="mb-5">
                            <JournalToolbar activeStatus={query.status} initialQ={query.q} counts={counts} />
                        </div>
                        <JournalTable rows={pageRows} />
                        {window.total > 0 && <PaginationFooter window={window} />}
                    </Block>
                </div>
            </div>
        </>
    );
};

export default JournalListPage;
