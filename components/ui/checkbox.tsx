"use client"

import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative grid size-[18px] shrink-0 place-items-center rounded-[5px] border-[1.5px] border-[var(--rule)] bg-[var(--card)] transition-colors outline-none",
        "hover:border-[var(--muted-2)]",
        "focus-visible:border-[var(--ink)] focus-visible:ring-3 focus-visible:ring-[rgb(23_22_15_/_15%)]",
        "data-checked:border-[var(--ink)] data-checked:bg-[var(--ink)] data-checked:text-[var(--paper)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-[var(--accent)]",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none [&>svg]:size-3"
      >
        <CheckIcon strokeWidth={2.5} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
