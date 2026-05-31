import type { Metadata } from "next";
import Link from "next/link";
import { IconDownload, IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui";
import { AppTopbar } from "../../_components/AppTopbar";
import { Block } from "../../_components/Block";
import { PageHeader } from "../../_components/PageHeader";
import { PaginationFooter } from "../_components/PaginationFooter";
import { AccountsTable } from "./_components/AccountsTable";
import { AccountsToolbar } from "./_components/AccountsToolbar";
import { listAccounts } from "@/lib/api/finance/accounts-dal";
import { countByType, filterAccounts, paginate, parseAccountsQuery } from "./_data/filter";

export const metadata: Metadata = {
    title: "Chart of accounts · Tessera",
    description: "Every place a debit or credit can land.",
};

type Props = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const AccountsListPage = async ({ searchParams }: Props) => {
    const sp = await searchParams;
    const query = parseAccountsQuery(sp);
    const accounts = await listAccounts();
    const counts = countByType(accounts);
    const filtered = filterAccounts(accounts, query);
    const sorted = [...filtered].sort((a, b) => a.code.localeCompare(b.code));
    const { rows: pageRows, window } = paginate(sorted, query.page);

    return (
        <>
            <AppTopbar crumbs={[{ label: "Finance", href: "/finance" }, { label: "Chart of accounts" }]} />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="Finance · General ledger"
                        title={
                            <>
                                Chart of accounts<em className="text-(--accent) italic">.</em>
                            </>
                        }
                        description="Every place a debit or credit can land. Filter by type, search by code or name."
                        actions={
                            <>
                                <Button variant="outline" size="sm">
                                    <IconDownload stroke={1.8} />
                                    Export
                                </Button>
                                <Button asChild variant="default" size="sm">
                                    <Link href="/finance/accounts/new">
                                        <IconPlus stroke={1.8} />
                                        New account
                                    </Link>
                                </Button>
                            </>
                        }
                    />

                    <Block
                        title="All accounts"
                        description={`${filtered.length} of ${accounts.length} accounts match your filters.`}>
                        <div className="mb-5">
                            <AccountsToolbar activeType={query.type} initialQ={query.q} counts={counts} />
                        </div>
                        <AccountsTable rows={pageRows} />
                        {window.total > 0 && <PaginationFooter window={window} />}
                    </Block>
                </div>
            </div>
        </>
    );
};

export default AccountsListPage;
