import Link from "next/link";

import { Card, CardEyebrow } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { AccountResponse, AccountType } from "@/lib/api/finance/accounts";

const typeLabels: Record<AccountType, string> = {
    ASSET: "Asset",
    LIABILITY: "Liability",
    EQUITY: "Equity",
    REVENUE: "Revenue",
    EXPENSE: "Expense",
};

const typeTones: Record<AccountType, string> = {
    ASSET: "bg-(--sky-soft) text-(--sky)",
    LIABILITY: "bg-(--ochre-soft) text-(--ochre)",
    EQUITY: "bg-(--plum-soft) text-(--plum)",
    REVENUE: "bg-(--moss-soft) text-(--moss)",
    EXPENSE: "bg-(--accent-soft) text-(--accent-deep)",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1">
            <CardEyebrow>{label}</CardEyebrow>
            <div className="text-[14px] text-(--ink)">{children}</div>
        </div>
    );
}

export function AccountProfileCard({ account, parent }: { account: AccountResponse; parent: AccountResponse | null }) {
    return (
        <Card className="p-6">
            <div className="grid grid-cols-2 gap-x-8 gap-y-5 md:grid-cols-3">
                <Field label="Code">
                    <span className="font-mono text-[12px] tracking-[0.04em]">{account.code}</span>
                </Field>
                <Field label="Type">
                    <span
                        className={cn(
                            "inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] uppercase",
                            typeTones[account.type],
                        )}>
                        {typeLabels[account.type]}
                    </span>
                </Field>
                <Field label="Status">
                    <span
                        className={
                            account.isActive
                                ? "inline-flex items-center rounded-full bg-(--moss-soft) px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] text-(--moss) uppercase"
                                : "inline-flex items-center rounded-full bg-(--paper-3) px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] text-(--muted) uppercase"
                        }>
                        {account.isActive ? "Active" : "Archived"}
                    </span>
                </Field>
                <Field label="Parent">
                    {parent ? (
                        <Link
                            href={`/finance/accounts/${parent.id}`}
                            className="font-mono text-[12px] tracking-[0.02em] hover:text-(--accent)">
                            {parent.code} · {parent.name}
                        </Link>
                    ) : (
                        "—"
                    )}
                </Field>
                <Field label="System account">{account.isSystemAccount ? "Yes" : "No"}</Field>
                <Field label="Description">
                    <span className="text-[13px] text-(--ink-soft)">{account.description ?? "—"}</span>
                </Field>
            </div>
        </Card>
    );
}
