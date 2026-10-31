import { useMemo, useState, type ComponentProps } from "react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type PasswordInputProps = ComponentProps<typeof Input>;

function PasswordInput({ className, disabled, ...props }: PasswordInputProps) {
    const [visible, setVisible] = useState(false);

    return (
        <div className="relative">
            <Input
                {...props}
                type={visible ? "text" : "password"}
                disabled={disabled}
                className={cn("pr-11", className)}
            />
            <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={visible ? "Hide password" : "Show password"}
                aria-pressed={visible}
                disabled={disabled}
                onClick={() => setVisible((current) => !current)}
                className="absolute inset-y-0 right-0 my-auto h-full w-11 rounded-none text-(--muted) outline-none transition-colors hover:bg-transparent hover:text-(--ink) focus-visible:text-(--ink) focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ink) motion-reduce:transition-none"
            >
                {visible ? <IconEyeOff aria-hidden="true" size={16} /> : <IconEye aria-hidden="true" size={16} />}
            </Button>
        </div>
    );
}

type PasswordStrengthMeterProps = {
    value: string;
};

function PasswordStrengthMeter({ value }: PasswordStrengthMeterProps) {
    const strength = useMemo(() => {
        if (!value) return 0;

        let score = 0;
        if (value.length >= 8) score += 1;
        if (value.length >= 12) score += 1;
        if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score += 1;
        if (/\d/.test(value) || /[^A-Za-z0-9]/.test(value)) score += 1;
        return score;
    }, [value]);

    const state = strength <= 1 ? "weak" : strength === 2 ? "medium" : "strong";
    const label = !value ? "Enter a password" : state === "weak" ? "Weak" : state === "medium" ? "Getting there" : "Strong";
    const tone = state === "weak" ? "--accent" : state === "medium" ? "--ochre" : "--moss";

    return (
        <div className="space-y-2" aria-live="polite">
            <div className="flex gap-1" aria-label={`Password strength: ${label}`}>
                {[0, 1, 2, 3].map((bar) => (
                    <span
                        key={bar}
                        aria-hidden="true"
                        className={cn(
                            "h-0.75 flex-1 rounded-[2px] bg-(--rule) transition-colors motion-reduce:transition-none",
                            bar < strength && "bg-(--strength-tone)",
                        )}
                        style={{ "--strength-tone": `var(${tone})` } as ComponentProps<"span">["style"]}
                    />
                ))}
            </div>
            <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.08em] text-(--muted) uppercase">
                <span>{strength === 0 ? "Use 8+ characters" : "Password strength"}</span>
                <span className={cn(strength > 0 && "text-(--strength-tone)")} style={{ "--strength-tone": `var(${tone})` } as ComponentProps<"span">["style"]}>
                    {label}
                </span>
            </div>
        </div>
    );
}

export { PasswordInput, PasswordStrengthMeter };
