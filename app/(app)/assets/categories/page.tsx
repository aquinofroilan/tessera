import type { Metadata } from "next";
import Link from "next/link";
import { IconPlus, IconTags } from "@tabler/icons-react";

import { Button, Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import { listAssetCategories } from "@/lib/api/assets/assets-dal";
import { AppTopbar } from "../../_components/AppTopbar";
import { Block } from "../../_components/Block";
import { PageHeader } from "../../_components/PageHeader";

export const metadata: Metadata = {
    title: "Asset categories · Tessera",
    description: "Buckets for fixed assets — define defaults once, apply them to every new asset.",
};

const CategoriesPage = async () => {
    const categories = await listAssetCategories();

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "Assets", href: "/assets" },
                    { label: "Categories" },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-300 p-9">
                    <PageHeader
                        eyebrow="Fixed assets"
                        title={
                            <>
                                Categories<em className="text-(--accent) italic">.</em>
                            </>
                        }
                        description="Each category carries default depreciation method, useful life, and salvage so you don't repeat yourself per asset."
                        actions={
                            <Button asChild variant="default" size="sm">
                                <Link href="/assets/categories/new">
                                    <IconPlus stroke={1.8} />
                                    New category
                                </Link>
                            </Button>
                        }
                    />

                    <Block title="All categories" description={`${categories.length} total.`}>
                        {categories.length === 0 ? (
                            <Card className="items-center gap-3 px-6 py-12 text-center">
                                <span className="grid size-10 place-items-center rounded-full bg-(--paper-2) text-(--muted)">
                                    <IconTags className="size-5" stroke={1.6} />
                                </span>
                                <div className="font-display text-foreground text-xl font-[380]">No categories yet.</div>
                                <div className="max-w-80 text-sm text-(--muted)">
                                    Create one — common buckets are Machinery, IT Equipment, Vehicles, Furniture.
                                </div>
                            </Card>
                        ) : (
                            <Card className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[120px]">Code</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead className="w-[140px] text-right">Useful life</TableHead>
                                            <TableHead className="w-[120px] text-right">Salvage</TableHead>
                                            <TableHead className="w-[100px]">Active</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {categories.map((cat) => (
                                            <TableRow key={cat.id}>
                                                <TableCell>
                                                    <Link
                                                        href={`/assets/categories/${cat.id}`}
                                                        className="font-mono text-[12px] tracking-[0.04em] text-foreground uppercase no-underline hover:text-(--accent)">
                                                        {cat.code}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="grid gap-0.5">
                                                        <span className="text-foreground text-[14px] font-medium">
                                                            {cat.name}
                                                        </span>
                                                        {cat.description && (
                                                            <span className="text-[12px] text-(--muted)">
                                                                {cat.description}
                                                            </span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right font-mono text-[12px] tabular-nums">
                                                    {cat.defaultUsefulLifeMonths
                                                        ? `${cat.defaultUsefulLifeMonths} mo`
                                                        : "—"}
                                                </TableCell>
                                                <TableCell className="text-right font-mono text-[12px] tabular-nums">
                                                    {cat.defaultSalvageValue}
                                                </TableCell>
                                                <TableCell>
                                                    <span
                                                        className={`inline-flex rounded-full px-2 py-0.5 font-mono text-[10px] uppercase ${
                                                            cat.isActive
                                                                ? "bg-(--moss) text-(--paper)"
                                                                : "bg-(--paper-3) text-(--muted)"
                                                        }`}>
                                                        {cat.isActive ? "Active" : "Inactive"}
                                                    </span>
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

export default CategoriesPage;
