import type { ReactNode } from "react";

import { Card, CardEyebrow } from "@/components/ui";

const Field = ({ label, children }: { label: string; children: ReactNode }) => {
    return (
        <div className="flex flex-col gap-1">
            <CardEyebrow>{label}</CardEyebrow>
            <div className="text-[14px] text-(--ink)">{children}</div>
        </div>
    );
};

export type PartyProfile = {
    contactName: string | null;
    contactEmail: string | null;
    contactPhone: string | null;
    paymentTermDays: number;
    defaultAccountLabel: string;
    defaultAccountValue: string | null;
    isActive: boolean;
};

export const PartyProfileCard = ({ profile }: { profile: PartyProfile }) => {
    return (
        <Card className="p-6">
            <div className="grid grid-cols-2 gap-x-8 gap-y-5 md:grid-cols-3">
                <Field label="Contact">{profile.contactName ?? "—"}</Field>
                <Field label="Email">
                    {profile.contactEmail ? (
                        <a
                            href={`mailto:${profile.contactEmail}`}
                            className="font-mono text-[12px] tracking-[0.02em] hover:text-(--accent)">
                            {profile.contactEmail}
                        </a>
                    ) : (
                        "—"
                    )}
                </Field>
                <Field label="Phone">
                    <span className="font-mono text-[12px] tracking-[0.02em] text-(--ink-soft)">
                        {profile.contactPhone ?? "—"}
                    </span>
                </Field>
                <Field label="Payment terms">
                    <span className="tabular-nums">Net {profile.paymentTermDays}</span>
                </Field>
                <Field label={profile.defaultAccountLabel}>{profile.defaultAccountValue ?? "—"}</Field>
                <Field label="Status">
                    <span
                        className={
                            profile.isActive
                                ? "inline-flex items-center rounded-full bg-(--moss-soft) px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] text-(--moss) uppercase"
                                : "inline-flex items-center rounded-full bg-(--paper-3) px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] text-(--muted) uppercase"
                        }>
                        {profile.isActive ? "Active" : "Archived"}
                    </span>
                </Field>
            </div>
        </Card>
    );
};
