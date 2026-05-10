"use client";

import { useState } from "react";
import { useController, type Control } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { formMessageClass } from "@/components/ui/form";
import { IconInput } from "@/components/ui/icon-input";
import { Label } from "@/components/ui/label";
import { IconEye, IconEyeOff, IconLock } from "@tabler/icons-react";
import { scorePassword, type SignupValues } from "./signup-schema";

const barColor = ["", "bg-[var(--accent)]", "bg-[var(--ochre)]", "bg-[var(--ochre)]", "bg-[var(--moss)]"];
const stateColor = ["", "text-[var(--accent)]", "text-[var(--ochre)]", "text-[var(--ochre)]", "text-[var(--moss)]"];

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
            ? "text-[var(--accent)]"
            : stateColor[strength.score]
        : "text-[var(--ink-soft)]";

    return (
        <div className="grid gap-1.5">
            <Label htmlFor="password" variant="eyebrow">
                Password <span className="text-[var(--accent)]">*</span>
            </Label>
            <IconInput
                id="password"
                type={visible ? "text" : "password"}
                autoComplete="new-password"
                placeholder="At least 10 characters"
                disabled={disabled}
                startIcon={<IconLock className="h-4 w-4" />}
                endAdornment={
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setVisible((v) => !v)}
                        aria-label={visible ? "Hide password" : "Show password"}
                        className="rounded-md text-[var(--muted)] hover:bg-[var(--paper-2)] hover:text-[var(--ink)]">
                        {visible ? <IconEyeOff className="h-4 w-4" /> : <IconEye className="h-4 w-4" />}
                    </Button>
                }
                {...field}
                value={value}
            />

            <div className="mt-1 flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className={`h-[3px] flex-1 rounded-sm transition-colors ${
                            i <= strength.score ? barColor[strength.score] : "bg-[var(--rule)]"
                        }`}
                    />
                ))}
            </div>
            <div className="flex justify-between font-mono text-[10px] tracking-[0.04em] text-[var(--muted)]">
                <span>10+ characters. Mix of letters, numbers, symbols.</span>
                <span className={`font-medium ${stateColorClass}`}>{strength.label}</span>
            </div>

            {error?.message && <p className={cn("mt-0.5", formMessageClass)}>{error.message}</p>}
        </div>
    );
}
