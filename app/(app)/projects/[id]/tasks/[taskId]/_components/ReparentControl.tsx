"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { IconArrowsMove } from "@tabler/icons-react";

import { Button, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { NONE_SENTINEL } from "../../../../../hr/_data/select-sentinels";
import { reparentTaskAction } from "../_data/reparent-task-action";

type Props = {
    projectId: string;
    taskId: string;
    currentParentId: string | null;
    options: { id: string; name: string }[];
};

export const ReparentControl = ({ projectId, taskId, currentParentId, options }: Props) => {
    const [selected, setSelected] = useState<string>(currentParentId ?? NONE_SENTINEL);
    const [pending, startTransition] = useTransition();

    const dirty = (currentParentId ?? NONE_SENTINEL) !== selected;

    const apply = () => {
        const parentTaskId = selected === NONE_SENTINEL ? null : selected;
        startTransition(async () => {
            const result = await reparentTaskAction(projectId, taskId, parentTaskId);
            if (!result.ok) toast.error(result.error);
            else toast.success(parentTaskId ? "Task reparented." : "Task moved to top level.");
        });
    };

    return (
        <div className="flex flex-col gap-3 md:flex-row md:items-end">
            <div className="flex-1">
                <Label variant="eyebrow">Parent task</Label>
                <Select value={selected} onValueChange={setSelected}>
                    <SelectTrigger>
                        <SelectValue placeholder="Top level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={NONE_SENTINEL}>(top level)</SelectItem>
                        {options.map((opt) => (
                            <SelectItem key={opt.id} value={opt.id}>
                                {opt.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Button variant="outline" size="sm" disabled={!dirty || pending} onClick={apply}>
                <IconArrowsMove stroke={1.8} />
                Reparent
            </Button>
        </div>
    );
};
