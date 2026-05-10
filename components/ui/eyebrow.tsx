import type { ComponentProps, ReactNode } from "react"

import { cn } from "@/lib/utils"

type EyebrowProps = ComponentProps<"div"> & {
  tag?: ReactNode
  tagTone?: "moss" | "paper" | "accent"
}

const tagToneClass: Record<NonNullable<EyebrowProps["tagTone"]>, string> = {
  moss: "bg-[var(--moss-soft)] text-[var(--moss)]",
  paper: "bg-[var(--paper-3)] text-[var(--ink-soft)]",
  accent: "bg-[var(--accent)] text-[var(--paper)]",
}

function Eyebrow({
  className,
  children,
  tag,
  tagTone = "moss",
  ...props
}: EyebrowProps) {
  return (
    <div
      data-slot="eyebrow"
      className={cn(
        "inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--ink-soft)]",
        className,
      )}
      {...props}
    >
      <span>{children}</span>
      {tag ? (
        <span
          className={cn(
            "rounded-full px-2.5 py-[3px] text-[10px] tracking-[0.1em]",
            tagToneClass[tagTone],
          )}
        >
          {tag}
        </span>
      ) : null}
    </div>
  )
}

export { Eyebrow, type EyebrowProps }
