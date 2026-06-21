"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
    Button,
    Card,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui";
import { setParentAction } from "../_data/set-parent-action";

const ROOT_SENTINEL = "__root__";

type Option = { id: string; code: string; name: string };

type Props = {
    id: string;
    currentParentId: string | null;
    options: Option[];
};

export const SetParentControl = ({ id, currentParentId, options }: Props) => {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const [value, setValue] = useState<string>(currentParentId ?? ROOT_SENTINEL);

    const dirty = (currentParentId ?? ROOT_SENTINEL) !== value;

    const onSubmit = () => {
        startTransition(async () => {
            const next = value === ROOT_SENTINEL ? null : value;
            const result = await setParentAction(id, next);
            if (!result.ok) {
                toast.error(result.error);
                return;
            }
            toast.success(next ? "Department moved." : "Promoted to top-level.");
            router.refresh();
        });
    };

    return (
        <Card className="p-6">
            <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                <div className="grid gap-1.5">
                    <label className="font-mono text-[10px] tracking-[0.12em] text-(--muted) uppercase">
                        Reports into
                    </label>
                    <Select value={value} onValueChange={setValue} disabled={pending}>
                        <SelectTrigger>
                            <SelectValue placeholder="Pick a parent" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ROOT_SENTINEL}>Top-level (no parent)</SelectItem>
                            {options.map((opt) => (
                                <SelectItem key={opt.id} value={opt.id}>
                                    {opt.code} · {opt.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button type="button" onClick={onSubmit} disabled={!dirty || pending}>
                    {pending ? "Saving…" : "Save parent"}
                </Button>
            </div>
        </Card>
    );
};
