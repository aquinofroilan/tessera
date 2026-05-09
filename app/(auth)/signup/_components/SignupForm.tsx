"use client";

// TODO: wire to a real signup endpoint when the backend is ready.
// For now this simulates the loading -> success state from the static mock.

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { IconInput } from "@/components/ui/icon-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

type Status = "idle" | "submitting" | "success";

export function SignupForm() {
  const [status, setStatus] = useState<Status>("idle");
  const form = useForm<SignupValues>({
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

  const onSubmit = form.handleSubmit(async () => {
    setStatus("submitting");
    await new Promise((resolve) => setTimeout(resolve, 1600));
    setStatus("success");
  });

  const disabled = status !== "idle";

  return (
    <Form {...form}>
      <form className="grid gap-4" onSubmit={onSubmit} noValidate>
        <SsoButtons disabled={disabled} />

        <div className="my-1 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--muted)] before:h-px before:flex-1 before:bg-[var(--rule)] before:content-[''] after:h-px after:flex-1 after:bg-[var(--rule)] after:content-['']">
          or with work email
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="gap-1.5">
                <FormLabel asChild>
                  <Label variant="eyebrow">
                    Your name <span className="text-[var(--accent)]">*</span>
                  </Label>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Emma Voss" autoComplete="name" disabled={disabled} {...field} />
                </FormControl>
                <FormMessage className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--accent)]" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="gap-1.5">
                <FormLabel asChild>
                  <Label variant="eyebrow">
                    Your role{" "}
                    <span className="font-sans text-[11px] normal-case tracking-normal text-[var(--muted-2)]">
                      (optional)
                    </span>
                  </Label>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Controller, COO, Owner…" disabled={disabled} {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="gap-1.5">
              <FormLabel asChild>
                <Label variant="eyebrow">
                  Work email <span className="text-[var(--accent)]">*</span>
                </Label>
              </FormLabel>
              <FormControl>
                <IconInput
                  type="email"
                  placeholder="emma@hollisdray.co"
                  autoComplete="email"
                  disabled={disabled}
                  startIcon={<MailIcon className="h-4 w-4" />}
                  {...field}
                />
              </FormControl>
              <FormMessage className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--accent)]" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem className="gap-1.5">
              <FormLabel asChild>
                <Label variant="eyebrow">
                  Company name <span className="text-[var(--accent)]">*</span>
                </Label>
              </FormLabel>
              <FormControl>
                <IconInput
                  type="text"
                  placeholder="Hollis & Dray Millwork"
                  autoComplete="organization"
                  disabled={disabled}
                  startIcon={<BuildingIcon className="h-4 w-4" />}
                  {...field}
                />
              </FormControl>
              <FormMessage className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--accent)]" />
            </FormItem>
          )}
        />

        <PasswordField control={form.control} disabled={disabled} />

        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem className="mt-1 gap-1.5">
              <div className="flex items-start gap-2.5">
                <FormControl>
                  <Checkbox
                    checked={field.value === true}
                    onCheckedChange={(value) => field.onChange(value === true)}
                    disabled={disabled}
                    className="mt-0.5"
                  />
                </FormControl>
                <span className="text-[13px] leading-[1.5] text-[var(--ink-soft)]">
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
              </div>
              <FormMessage className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--accent)]" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          variant={status === "success" ? "pill-success" : "pill"}
          size="pill-lg"
          disabled={disabled}
          className="mt-1.5 w-full"
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
        </Button>

        <div className="mt-3 flex flex-wrap gap-4 font-mono text-[11px] tracking-[0.04em] text-[var(--muted)]">
          {["No credit card", "Cancel anytime", "SOC 2 Type II"].map((text) => (
            <span key={text} className="inline-flex items-center gap-1.5">
              <CheckIcon className="h-3 w-3" />
              {text}
            </span>
          ))}
        </div>
      </form>
    </Form>
  );
}
