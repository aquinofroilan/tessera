"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
    Button,
    Card,
    Input,
    Label,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui";

type Option = { id: string; label: string };

const ALL = "__all__";

type Props = {
    assets: Option[];
    initialAssetId: string;
    initialMonths: number;
};

export function ScheduleControls({ assets, initialAssetId, initialMonths }: Props) {
    const router = useRouter();
    const [assetId, setAssetId] = useState<string>(initialAssetId || ALL);
    const [months, setMonths] = useState<string>(String(initialMonths));

    const onApply = () => {
        const params = new URLSearchParams();
        if (assetId !== ALL) params.set("assetId", assetId);
        const m = Number.parseInt(months, 10);
        if (Number.isFinite(m) && m > 0) params.set("months", String(m));
        const q = params.toString();
        router.push(`/assets/reports/depreciation-schedule${q ? `?${q}` : ""}`);
    };

    return (
        <Card className="grid gap-5 p-6 md:grid-cols-[1fr_120px_auto] md:items-end">
            <div className="grid gap-1.5">
                <Label variant="eyebrow">Asset</Label>
                <Select value={assetId} onValueChange={setAssetId}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ALL}>Every active asset</SelectItem>
                        {assets.map((a) => (
                            <SelectItem key={a.id} value={a.id}>
                                {a.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="grid gap-1.5">
                <Label variant="eyebrow">Months</Label>
                <Input
                    type="number"
                    min={1}
                    max={240}
                    value={months}
                    onChange={(e) => setMonths(e.target.value)}
                />
            </div>
            <Button type="button" onClick={onApply}>
                Apply
            </Button>
        </Card>
    );
}
