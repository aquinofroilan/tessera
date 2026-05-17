import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { IconPencil } from "@tabler/icons-react";

import { Button, Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import { AppTopbar } from "../../../_components/AppTopbar";
import { Block } from "../../../_components/Block";
import { PageHeader } from "../../../_components/PageHeader";
import { getAccount, listAccounts } from "@/lib/api/finance/accounts-dal";
import { AccountProfileCard } from "./_components/AccountProfileCard";

type Props = { params: Promise<{ id: string }> };

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const { id } = await params;
    const account = await getAccount(id);
    return { title: account ? `${account.code} ${account.name} · Loom` : "Account · Loom" };
};

const AccountDetailPage = async ({ params }: Props) => {
    const { id } = await params;
    const account = await getAccount(id);
    if (!account) notFound();

    const parent = account.parentId ? await getAccount(account.parentId) : null;
    const children = (await listAccounts({ parentId: id })).sort((a, b) => a.code.localeCompare(b.code));

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "Finance", href: "/finance" },
                    { label: "Chart of accounts", href: "/finance/accounts" },
                    { label: `${account.code} · ${account.name}` },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="Finance · General ledger · Accounts"
                        title={
                            <span className="inline-flex items-center gap-3">
                                <span className="font-mono text-[28px] tracking-[0.02em]">{account.code}</span>
                                <span>{account.name}</span>
                            </span>
                        }
                        description={account.description ?? "—"}
                        actions={
                            !account.isSystemAccount && (
                                <Button variant="outline" size="sm">
                                    <IconPencil stroke={1.8} />
                                    Edit
                                </Button>
                            )
                        }
                    />

                    <Block title="Profile" description="Type, parent, and posting rules.">
                        <AccountProfileCard account={account} parent={parent} />
                    </Block>

                    {children.length > 0 && (
                        <Block
                            title="Sub-accounts"
                            description={`${children.length} account${children.length === 1 ? "" : "s"} rolling up to this one.`}>
                            <Card className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[110px]">Code</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead className="w-[90px]">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {children.map((child) => (
                                            <TableRow key={child.id}>
                                                <TableCell className="font-mono text-[12px] tracking-[0.04em] text-(--ink)">
                                                    {child.code}
                                                </TableCell>
                                                <TableCell>
                                                    <Link
                                                        href={`/finance/accounts/${child.id}`}
                                                        className="text-(--ink) hover:text-(--accent)">
                                                        {child.name}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    <span
                                                        className={
                                                            child.isActive
                                                                ? "inline-flex items-center rounded-full bg-(--moss-soft) px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] text-(--moss) uppercase"
                                                                : "inline-flex items-center rounded-full bg-(--paper-3) px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] text-(--muted) uppercase"
                                                        }>
                                                        {child.isActive ? "Active" : "Archived"}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Card>
                        </Block>
                    )}
                </div>
            </div>
        </>
    );
};

export default AccountDetailPage;
