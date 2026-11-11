import { IconBell, IconMenu2, IconPlus, IconSearch } from '@/components/ui/hugeicons'
import { useRouterState } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

type DashboardTopbarProps = Readonly<{
    onMenuClick: () => void
}>

export const DashboardTopbar = ( { onMenuClick }: DashboardTopbarProps ) => {
    const pathname = useRouterState( { select: state => state.location.pathname } )
    let breadcrumbs: string[]
    if ( pathname === '/inventory/products/new' ) {
        breadcrumbs = [ 'Inventory', 'Products', 'New' ]
    } else if ( pathname.startsWith( '/inventory' ) ) {
        breadcrumbs = [ 'Inventory', 'Products' ]
    } else {
        breadcrumbs = [ 'Overview' ]
    }

    return (
        <header className="sticky top-0 z-10 flex h-[58px] shrink-0 items-center gap-2 border-b border-(--rule) bg-(--paper)/80 px-4 backdrop-blur-xl sm:gap-5 sm:px-7">
            <Button
                variant="pill-ghost"
                size="icon"
                type="button"
                className="relative grid size-[34px] shrink-0 place-items-center rounded-lg border border-transparent text-(--ink-soft) transition-colors hover:border-(--rule) hover:bg-(--paper-2) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ink) lg:hidden"
                aria-label="Open navigation"
                onClick={ onMenuClick }
            >
                <IconMenu2 size={ 19 } aria-hidden="true" />
            </Button>

            <div className="flex min-w-0 items-center gap-2 overflow-hidden font-mono text-[10px] tracking-[0.08em] text-(--muted) uppercase sm:text-[11px]" aria-label="Breadcrumb">
                <span className="shrink-0">Workspace</span>
                { breadcrumbs.map( ( breadcrumb, index ) => (
                    <span key={ breadcrumb } className="flex min-w-0 items-center gap-2">
                        <span className="text-(--muted-2)" aria-hidden="true">/</span>
                        <strong className={ `truncate font-medium ${ index === breadcrumbs.length - 1 ? 'text-(--ink)' : 'text-(--muted)' }` }>{ breadcrumb }</strong>
                    </span>
                ) ) }
            </div>

            <div className="flex-1" />

            <Button type="button" variant="pill-ghost" size="icon" className="flex size-[34px] items-center justify-center gap-2 rounded-lg border border-(--rule) bg-(--paper-2) px-0 text-left text-(--muted) transition-colors hover:border-(--muted-2) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ink) sm:w-auto sm:min-w-[280px] sm:px-3" aria-label="Search workspace">
                <IconSearch size={ 16 } aria-hidden="true" />
                <span className="hidden text-[13px] sm:inline">Search workspace</span>
                <kbd className="ml-auto hidden rounded border border-(--rule) bg-(--paper) px-1.5 py-px font-mono text-[10px] text-(--muted) sm:inline">⌘ K</kbd>
            </Button>

            <Button type="button" variant="pill-ghost" size="icon" className="relative grid size-[34px] shrink-0 place-items-center rounded-lg border border-transparent text-(--ink-soft) transition-colors hover:border-(--rule) hover:bg-(--paper-2) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ink)" aria-label="View notifications">
                <IconBell size={ 18 } aria-hidden="true" />
                <span className="absolute right-[7px] top-[7px] size-[7px] rounded-full border-2 border-(--paper) bg-(--accent)" aria-hidden="true" />
            </Button>

            <Button type="button" variant="pill-ghost" size="sm" className="inline-flex items-center gap-1.5 rounded-lg bg-(--ink) px-2.5 py-2 text-[13px] font-medium text-(--paper) transition-colors hover:bg-(--accent) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ink) sm:px-3">
                <IconPlus size={ 16 } strokeWidth={ 2.2 } aria-hidden="true" />
                <span>New</span>
            </Button>
        </header>
    )
}
