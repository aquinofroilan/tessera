"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { IconLoader2 } from "@tabler/icons-react";
import { toast } from "sonner";

import { Button, Card, Checkbox } from "@/components/ui";
import {
    KNOWN_NOTIFICATION_KINDS,
    NOTIFICATION_CHANNELS,
    type NotificationChannel,
    type NotificationPreferenceResponse,
} from "@/lib/api/notification-preferences";
import { savePreferencesAction } from "../_data/preferences-action";

type Key = `${string}::${NotificationChannel}`;

const keyOf = (kind: string, channel: NotificationChannel): Key => `${kind}::${channel}` as Key;

type Props = {
    initialPreferences: NotificationPreferenceResponse[];
};

export function PreferencesForm({ initialPreferences }: Props) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();

    // Server state — only explicit deviations.
    const baseline = useMemo(() => {
        const map = new Map<Key, boolean>();
        for (const p of initialPreferences) map.set(keyOf(p.kind, p.channel), p.enabled);
        return map;
    }, [initialPreferences]);

    // Local state — every cell, defaulting to true (channel × kind default-on).
    const [enabledByKey, setEnabledByKey] = useState<Map<Key, boolean>>(() => {
        const map = new Map<Key, boolean>();
        for (const k of KNOWN_NOTIFICATION_KINDS) {
            for (const c of NOTIFICATION_CHANNELS) {
                const key = keyOf(k.kind, c.channel);
                map.set(key, baseline.get(key) ?? true);
            }
        }
        return map;
    });

    const dirty = useMemo(() => {
        for (const k of KNOWN_NOTIFICATION_KINDS) {
            for (const c of NOTIFICATION_CHANNELS) {
                const key = keyOf(k.kind, c.channel);
                const current = enabledByKey.get(key) ?? true;
                const original = baseline.get(key) ?? true;
                if (current !== original) return true;
            }
        }
        return false;
    }, [enabledByKey, baseline]);

    const toggle = (kind: string, channel: NotificationChannel, next: boolean) => {
        setEnabledByKey((prev) => {
            const copy = new Map(prev);
            copy.set(keyOf(kind, channel), next);
            return copy;
        });
    };

    const onSave = () => {
        const body = {
            preferences: KNOWN_NOTIFICATION_KINDS.flatMap((k) =>
                NOTIFICATION_CHANNELS.map((c) => ({
                    kind: k.kind,
                    channel: c.channel,
                    enabled: enabledByKey.get(keyOf(k.kind, c.channel)) ?? true,
                })),
            ),
        };
        startTransition(async () => {
            const result = await savePreferencesAction(body);
            if (!result.ok) {
                toast.error(result.error);
                return;
            }
            toast.success("Preferences saved.");
            router.refresh();
        });
    };

    return (
        <div className="grid gap-6">
            <Card className="p-0">
                <div className="grid grid-cols-[1fr_auto_auto] items-center gap-x-6 px-6 py-3 font-mono text-[10px] tracking-[0.12em] text-(--muted) uppercase border-b border-(--rule)">
                    <span>Notification</span>
                    {NOTIFICATION_CHANNELS.map((c) => (
                        <span key={c.channel} className="w-16 text-center">
                            {c.label}
                        </span>
                    ))}
                </div>
                {KNOWN_NOTIFICATION_KINDS.map((k, index) => (
                    <div
                        key={k.kind}
                        className={`grid grid-cols-[1fr_auto_auto] items-center gap-x-6 px-6 py-4 ${
                            index === KNOWN_NOTIFICATION_KINDS.length - 1 ? "" : "border-b border-(--rule)"
                        }`}>
                        <div className="grid gap-1">
                            <div className="text-foreground text-[14px] font-medium">{k.label}</div>
                            <div className="text-(--ink-soft) text-[12px]">{k.description}</div>
                            <div className="font-mono text-[10px] tracking-[0.04em] text-(--muted) uppercase">
                                {k.kind}
                            </div>
                        </div>
                        {NOTIFICATION_CHANNELS.map((c) => {
                            const key = keyOf(k.kind, c.channel);
                            const checked = enabledByKey.get(key) ?? true;
                            return (
                                <div key={c.channel} className="grid w-16 place-items-center">
                                    <Checkbox
                                        checked={checked}
                                        onCheckedChange={(v) => toggle(k.kind, c.channel, v === true)}
                                        disabled={pending}
                                        aria-label={`${c.label} for ${k.label}`}
                                    />
                                </div>
                            );
                        })}
                    </div>
                ))}
            </Card>

            <div className="flex flex-wrap items-center justify-between gap-2.5">
                <p className="text-[12px] text-(--muted)">
                    Everything is on by default. Uncheck a cell to opt out — saving stores only the deviations.
                </p>
                <div className="flex items-center gap-2.5">
                    <Button type="button" variant="ghost" size="sm" onClick={() => router.refresh()} disabled={pending}>
                        Reset
                    </Button>
                    <Button type="button" variant="default" size="sm" onClick={onSave} disabled={!dirty || pending}>
                        {pending ? (
                            <>
                                <IconLoader2 className="size-4 animate-[spin_0.9s_linear_infinite]" />
                                Saving…
                            </>
                        ) : (
                            "Save changes"
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
