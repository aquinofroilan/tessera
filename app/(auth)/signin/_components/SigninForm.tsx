"use client";

// TODO: wire to a real signin endpoint when the backend is ready.
// For now this simulates the loading -> success state from the static mock.

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema, type SigninValues } from "./signin-schema";
import { SsoButtons } from "./SsoButtons";
import {
  ArrowRightIcon,
  CheckIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
  SpinnerIcon,
} from "./icons";

const labelClass =
  "mb-1.5 block font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]";
const inputBase =
  "w-full rounded-[10px] border border-[var(--rule)] bg-[var(--card)] px-3.5 py-3 text-[14.5px] text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--muted-2)] hover:border-[var(--muted-2)] focus:border-[var(--ink)] focus:shadow-[0_0_0_3px_rgb(23_22_15_/_6%)] disabled:cursor-not-allowed disabled:opacity-70";
const inputWithPrefix = `${inputBase} pl-10`;
const inputWithBoth = `${inputBase} pl-10 pr-11`;
const errorClass =
  "mt-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--accent)]";

type Status = "idle" | "submitting" | "success";

export function SigninForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninValues>({
    resolver: zodResolver(signinSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      remember: true,
    },
  });

  const onSubmit = handleSubmit(async () => {
    setStatus("submitting");
    await new Promise((resolve) => setTimeout(resolve, 1400));
    setStatus("success");
  });

  const disabled = status !== "idle";

  return (
    <form className="grid gap-4" onSubmit={onSubmit} noValidate>
      <SsoButtons disabled={disabled} />

      <div className="my-1 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--muted)] before:h-px before:flex-1 before:bg-[var(--rule)] before:content-[''] after:h-px after:flex-1 after:bg-[var(--rule)] after:content-['']">
        or with email
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>
          Work email <span className="text-[var(--accent)]">*</span>
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3.5 top-1/2 grid -translate-y-1/2 place-items-center text-[var(--muted)]">
            <MailIcon className="h-4 w-4" />
          </span>
          <input
            id="email"
            type="email"
            placeholder="emma@hollisdray.co"
            autoComplete="email"
            disabled={disabled}
            className={inputWithPrefix}
            {...register("email")}
          />
        </div>
        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="password" className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">
            Password <span className="text-[var(--accent)]">*</span>
          </label>
          <Link
            href="#"
            className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--ink-soft)] no-underline transition-colors hover:text-[var(--accent)]"
          >
            Forgot?
          </Link>
        </div>
        <div className="relative">
          <span className="pointer-events-none absolute left-3.5 top-1/2 grid -translate-y-1/2 place-items-center text-[var(--muted)]">
            <LockIcon className="h-4 w-4" />
          </span>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Your password"
            autoComplete="current-password"
            disabled={disabled}
            className={inputWithBoth}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-2.5 top-1/2 grid -translate-y-1/2 place-items-center rounded-md p-1.5 text-[var(--muted)] transition-colors hover:bg-[var(--paper-2)] hover:text-[var(--ink)]"
          >
            {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && <p className={errorClass}>{errors.password.message}</p>}
      </div>

      <label className="mt-1 flex cursor-pointer items-center gap-2.5 text-[13px] text-[var(--ink-soft)] select-none">
        <input type="checkbox" className="peer hidden" disabled={disabled} {...register("remember")} />
        <span className="relative inline-block size-[18px] flex-none rounded-[5px] border-[1.5px] border-[var(--rule)] bg-[var(--card)] transition-colors peer-hover:border-[var(--muted-2)] peer-checked:border-[var(--ink)] peer-checked:bg-[var(--ink)] peer-checked:after:absolute peer-checked:after:left-[4px] peer-checked:after:top-[1px] peer-checked:after:block peer-checked:after:h-[9px] peer-checked:after:w-[5px] peer-checked:after:rotate-45 peer-checked:after:border-r-2 peer-checked:after:border-b-2 peer-checked:after:border-[var(--paper)] peer-checked:after:content-['']" />
        <span>Keep me signed in on this device for 30 days.</span>
      </label>

      <button
        type="submit"
        disabled={disabled}
        className={`mt-1.5 inline-flex w-full items-center justify-center gap-2.5 rounded-[10px] px-5 py-3.5 text-[15px] font-medium tracking-[-0.005em] text-[var(--paper)] transition-all hover:-translate-y-px ${
          status === "success"
            ? "bg-[var(--moss)]"
            : "bg-[var(--ink)] hover:bg-[var(--accent)]"
        } disabled:cursor-not-allowed`}
      >
        {status === "idle" && (
          <>
            Sign in
            <ArrowRightIcon className="h-4 w-4" />
          </>
        )}
        {status === "submitting" && (
          <>
            <SpinnerIcon className="h-4 w-4 animate-[spin_0.9s_linear_infinite]" />
            Signing you in…
          </>
        )}
        {status === "success" && (
          <>
            <CheckIcon className="h-4 w-4" />
            Signed in · redirecting
          </>
        )}
      </button>

      <div className="mt-3 flex flex-wrap gap-4 font-mono text-[11px] tracking-[0.04em] text-[var(--muted)]">
        {["End-to-end encrypted", "SOC 2 Type II", "MFA available"].map((text) => (
          <span key={text} className="inline-flex items-center gap-1.5">
            <CheckIcon className="h-3 w-3" />
            {text}
          </span>
        ))}
      </div>
    </form>
  );
}
