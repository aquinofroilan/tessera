"use client";

// TODO: wire to a real signup endpoint when the backend is ready.
// For now this simulates the loading -> success state from the static mock.

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupValues } from "./signup-schema";
import { PasswordField } from "./PasswordField";
import { SsoButtons } from "./SsoButtons";
import {
  ArrowRightIcon,
  BuildingIcon,
  CheckIcon,
  MailIcon,
  SpinnerIcon,
} from "./icons";

const labelClass =
  "mb-1.5 block font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]";
const inputBase =
  "w-full rounded-[10px] border border-[var(--rule)] bg-[var(--card)] px-3.5 py-3 text-[14.5px] text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--muted-2)] hover:border-[var(--muted-2)] focus:border-[var(--ink)] focus:shadow-[0_0_0_3px_rgb(23_22_15_/_6%)] disabled:cursor-not-allowed disabled:opacity-70";
const inputWithPrefix = `${inputBase} pl-10`;
const errorClass =
  "mt-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--accent)]";

type Status = "idle" | "submitting" | "success";

export function SignupForm() {
  const [status, setStatus] = useState<Status>("idle");
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      role: "",
      email: "",
      company: "",
      password: "",
      terms: false as unknown as true,
    },
  });

  const onSubmit = handleSubmit(async () => {
    setStatus("submitting");
    await new Promise((resolve) => setTimeout(resolve, 1600));
    setStatus("success");
  });

  const disabled = status !== "idle";

  return (
    <form className="grid gap-4" onSubmit={onSubmit} noValidate>
      <SsoButtons disabled={disabled} />

      <div className="my-1 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--muted)] before:h-px before:flex-1 before:bg-[var(--rule)] before:content-[''] after:h-px after:flex-1 after:bg-[var(--rule)] after:content-['']">
        or with work email
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Your name <span className="text-[var(--accent)]">*</span>
          </label>
          <input
            id="name"
            type="text"
            placeholder="Emma Voss"
            autoComplete="name"
            disabled={disabled}
            className={inputBase}
            {...register("name")}
          />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="role" className={labelClass}>
            Your role{" "}
            <span className="font-sans text-[11px] normal-case tracking-normal text-[var(--muted-2)]">
              (optional)
            </span>
          </label>
          <input
            id="role"
            type="text"
            placeholder="Controller, COO, Owner…"
            disabled={disabled}
            className={inputBase}
            {...register("role")}
          />
        </div>
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
        <label htmlFor="company" className={labelClass}>
          Company name <span className="text-[var(--accent)]">*</span>
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3.5 top-1/2 grid -translate-y-1/2 place-items-center text-[var(--muted)]">
            <BuildingIcon className="h-4 w-4" />
          </span>
          <input
            id="company"
            type="text"
            placeholder="Hollis & Dray Millwork"
            autoComplete="organization"
            disabled={disabled}
            className={inputWithPrefix}
            {...register("company")}
          />
        </div>
        {errors.company && <p className={errorClass}>{errors.company.message}</p>}
      </div>

      <PasswordField control={control} disabled={disabled} />

      <label className="mt-1 flex cursor-pointer items-start gap-2.5 text-[13px] leading-[1.5] text-[var(--ink-soft)] select-none">
        <input type="checkbox" className="peer hidden" disabled={disabled} {...register("terms")} />
        <span className="relative mt-0.5 inline-block size-[18px] flex-none rounded-[5px] border-[1.5px] border-[var(--rule)] bg-[var(--card)] transition-colors peer-hover:border-[var(--muted-2)] peer-checked:border-[var(--ink)] peer-checked:bg-[var(--ink)] peer-checked:after:absolute peer-checked:after:left-[4px] peer-checked:after:top-[1px] peer-checked:after:block peer-checked:after:h-[9px] peer-checked:after:w-[5px] peer-checked:after:rotate-45 peer-checked:after:border-r-2 peer-checked:after:border-b-2 peer-checked:after:border-[var(--paper)] peer-checked:after:content-['']" />
        <span>
          I agree to Loom&apos;s{" "}
          <a href="#" className="border-b border-[var(--rule)] text-[var(--ink)] no-underline transition-colors hover:border-[var(--accent)]">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="border-b border-[var(--rule)] text-[var(--ink)] no-underline transition-colors hover:border-[var(--accent)]">
            Privacy Policy
          </a>
          , and I understand I can export or delete all data at any time.
        </span>
      </label>
      {errors.terms && <p className={errorClass}>{errors.terms.message}</p>}

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
            Start my 30-day trial
            <ArrowRightIcon className="h-4 w-4" />
          </>
        )}
        {status === "submitting" && (
          <>
            <SpinnerIcon className="h-4 w-4 animate-[spin_0.9s_linear_infinite]" />
            Setting up your workspace…
          </>
        )}
        {status === "success" && (
          <>
            <CheckIcon className="h-4 w-4" />
            Workspace ready · redirecting
          </>
        )}
      </button>

      <div className="mt-3 flex flex-wrap gap-4 font-mono text-[11px] tracking-[0.04em] text-[var(--muted)]">
        {["No credit card", "Cancel anytime", "SOC 2 Type II"].map((text) => (
          <span key={text} className="inline-flex items-center gap-1.5">
            <CheckIcon className="h-3 w-3" />
            {text}
          </span>
        ))}
      </div>
    </form>
  );
}
