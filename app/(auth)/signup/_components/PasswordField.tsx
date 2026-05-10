"use client";

import { useState } from "react";
import { useController, type Control } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button, IconInput, Label, formMessageClass } from "@/components/ui";
import { IconEye, IconEyeOff, IconLock } from "@tabler/icons-react";
import { scorePassword, type SignupValues } from "./signup-schema";

const barColor = ["", "bg-(--accent)", "bg-(--ochre)", "bg-(--ochre)", "bg-(--moss)"];
const stateColor = ["", "text-(--accent)", "text-(--ochre)", "text-(--ochre)", "text-(--moss)"];

export function PasswordField({ control, disabled }: { control: Control<SignupValues>; disabled?: boolean }) {
    const [visible, setVisible] = useState(false);
    const {
        field,
        fieldState: { error },
    } = useController({ control, name: "password" });

    const value = field.value ?? "";
    const strength = scorePassword(value);
    const stateColorClass = value
        ? strength.score === 0
            ? "text-(--accent)"
            : stateColor[strength.score]
        : "text-(--ink-soft)";

    return (
        <div className="grid gap-1.5">
            <Label htmlFor="password" variant="eyebrow">
                Password <span className="text-(--accent)">*</span>
            </Label>
            <IconInput
                id="password"
                type={visible ? "text" : "password"}
                autoComplete="new-password"
                placeholder="At least 10 characters"
                disabled={disabled}
                startIcon={<IconLock className="size-4" />}
                endAdornment={
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setVisible((v) => !v)}
                        aria-label={visible ? "Hide password" : "Show password"}
                        className="hover:text-foreground rounded-md text-(--muted) hover:bg-(--paper-2)">
                        {visible ? <IconEyeOff className="size-4" /> : <IconEye className="size-4" />}
                    </Button>
                }
                {...field}
                value={value}
            />

            <div className="mt-1 flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className={`h-0.75 flex-1 rounded-sm transition-colors ${
                            i <= strength.score ? barColor[strength.score] : "bg-(--rule)"
                        }`}
                    />
                ))}
            </div>
            <div className="flex justify-between font-mono text-[10px] tracking-[0.04em] text-(--muted)">
                <span>10+ characters. Mix of letters, numbers, symbols.</span>
                <span className={`font-medium ${stateColorClass}`}>{strength.label}</span>
            </div>

            {error?.message && <p className={cn("mt-0.5", formMessageClass)}>{error.message}</p>}
        </div>
    );
}
