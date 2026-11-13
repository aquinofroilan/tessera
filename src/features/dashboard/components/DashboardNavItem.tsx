import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowDown01Icon } from '@/components/ui/hugeicons'

type DashboardNavItemProps = Readonly<{
    label: string
    icon: ReactNode
    active?: boolean
    expanded?: boolean
    hasSubmenu?: boolean
    ariaControls?: string
    ariaCurrent?: 'page' | 'location'
    badge?: string
    onClick?: () => void
}>

export const DashboardNavItem = ( {
    label,
    icon,
    active = false,
    expanded = false,
    hasSubmenu = false,
    ariaControls,
    ariaCurrent,
    badge,
    onClick,
}: DashboardNavItemProps ) => {
    let stateClassName = ''
    let iconStateClassName = ''
    let chevronStateClassName = 'text-(--muted)'

    if ( active ) {
        stateClassName = 'bg-(--ink) font-medium text-(--paper) hover:bg-(--ink) hover:text-(--paper)'
        iconStateClassName = 'text-(--paper)'
        chevronStateClassName = 'text-(--paper)'
    } else if ( expanded ) {
        stateClassName = 'bg-(--paper) font-medium text-(--ink)'
        iconStateClassName = 'text-(--ink)'
        chevronStateClassName = 'text-(--ink)'
    }

    return (
        <Button
            variant="pill-ghost"
            size="sm"
            type="button"
            className={ `group h-auto flex w-full items-center justify-start gap-[11px] rounded-lg px-2.5 py-2 text-left text-[13.5px] tracking-[-0.003em] text-(--ink-soft) transition-colors duration-150 hover:bg-(--paper) hover:text-(--ink) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ink) ${ stateClassName }` }
            aria-current={ ariaCurrent ?? ( active ? 'page' : undefined ) }
            aria-expanded={ hasSubmenu ? expanded : undefined }
            aria-controls={ hasSubmenu && expanded ? ariaControls : undefined }
            onClick={ onClick }
        >
            <span className={ `grid size-[18px] shrink-0 place-items-center text-(--muted) ${ iconStateClassName }` } aria-hidden="true">{ icon }</span>
            <span>{ label }</span>
            { badge && <span className={ `ml-auto rounded-full bg-(--rule) px-1.5 py-px font-mono text-[10px] tracking-[0.02em] text-(--ink-soft) ${ active ? 'bg-(--accent) text-(--paper)' : '' }` }>{ badge }</span> }
            { hasSubmenu ? <ArrowDown01Icon className={ `ml-auto shrink-0 transition-transform duration-150 ${ chevronStateClassName } ${ expanded ? 'rotate-180' : '' }` } size={ 14 } aria-hidden="true" /> : null }
        </Button>
    )
}
