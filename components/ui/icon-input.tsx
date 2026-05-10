import type { ComponentProps, ReactNode } from "react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

type IconInputProps = ComponentProps<"input"> & {
  startIcon?: ReactNode
  endAdornment?: ReactNode
}

function IconInput({
  className,
  startIcon,
  endAdornment,
  ...props
}: IconInputProps) {
  return (
    <div data-slot="icon-input" className="relative">
      {startIcon ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-3.5 top-1/2 grid -translate-y-1/2 place-items-center text-[var(--muted)]"
        >
          {startIcon}
        </span>
      ) : null}
      <Input
        className={cn(startIcon && "pl-10", endAdornment && "pr-11", className)}
        {...props}
      />
      {endAdornment ? (
        <span
          data-slot="icon-input-end"
          className="absolute right-2.5 top-1/2 -translate-y-1/2"
        >
          {endAdornment}
        </span>
      ) : null}
    </div>
  )
}

export { IconInput, type IconInputProps }
