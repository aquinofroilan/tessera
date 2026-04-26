"use client";

import { useState } from "react";
import { useController, type Control } from "react-hook-form";
import { EyeIcon, EyeOffIcon, LockIcon } from "./icons";
import { scorePassword, type SignupValues } from "./signup-schema";

const barColor = ["", "bg-[var(--accent)]", "bg-[var(--ochre)]", "bg-[var(--ochre)]", "bg-[var(--moss)]"];
const stateColor = ["", "text-[var(--accent)]", "text-[var(--ochre)]", "text-[var(--ochre)]", "text-[var(--moss)]"];

export function PasswordField({
  control,
  disabled,
}: {
  control: Control<SignupValues>;
  disabled?: boolean;
}) {
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
    <div>
      <label htmlFor="password" className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">
        Password <span className="text-[var(--accent)]">*</span>
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 grid -translate-y-1/2 place-items-center text-[var(--muted)]">
          <LockIcon className="h-4 w-4" />
        </span>
        <input
          id="password"
          type={visible ? "text" : "password"}
          autoComplete="new-password"
          placeholder="At least 10 characters"
          disabled={disabled}
          className="w-full rounded-[10px] border border-[var(--rule)] bg-[var(--card)] py-3 pl-10 pr-11 text-[14.5px] text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--muted-2)] hover:border-[var(--muted-2)] focus:border-[var(--ink)] focus:shadow-[0_0_0_3px_rgb(23_22_15_/_6%)] disabled:cursor-not-allowed disabled:opacity-70"
          {...field}
          value={value}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-2.5 top-1/2 grid -translate-y-1/2 place-items-center rounded-md p-1.5 text-[var(--muted)] transition-colors hover:bg-[var(--paper-2)] hover:text-[var(--ink)]"
        >
          {visible ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
        </button>
      </div>

      <div className="mt-2 flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-[3px] flex-1 rounded-sm transition-colors ${
              i <= strength.score ? barColor[strength.score] : "bg-[var(--rule)]"
            }`}
          />
        ))}
      </div>
      <div className="mt-1.5 flex justify-between font-mono text-[10px] tracking-[0.04em] text-[var(--muted)]">
        <span>10+ characters. Mix of letters, numbers, symbols.</span>
        <span className={`font-medium ${stateColorClass}`}>{strength.label}</span>
      </div>

      {error?.message && (
        <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--accent)]">
          {error.message}
        </p>
      )}
    </div>
  );
}
