import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'

type DashboardNavItemProps = {
    label: string
    icon: ReactNode
    active?: boolean
    badge?: string
    onClick?: () => void
}

export const DashboardNavItem = ( {
    label,
    icon,
    active = false,
    badge,
    onClick,
}: DashboardNavItemProps ) => (
    <Button
        variant="pill-ghost"
        size="sm"
        type="button"
        className={ `group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13.5px] tracking-[-0.003em] text-(--ink-soft) transition-colors duration-150 hover:bg-(--paper) hover:text-(--ink) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ink) ${ active ? 'bg-(--ink) font-medium text-(--paper) hover:bg-(--ink) hover:text-(--paper)' : '' }` }
        aria-current={ active ? 'page' : undefined }
        onClick={ onClick }
    >
        <span className={ `grid size-[18px] shrink-0 place-items-center text-(--muted) ${ active ? 'text-(--paper)' : '' }` } aria-hidden="true">{ icon }</span>
        <span>{ label }</span>
        { badge ? <span className={ `ml-auto rounded-full bg-(--rule) px-1.5 py-px font-mono text-[10px] tracking-[0.02em] text-(--ink-soft) ${ active ? 'bg-(--accent) text-(--paper)' : '' }` }>{ badge }</span> : null }
    </Button>
)
