import { useEffect } from 'react'
import {
    Analytics01Icon,
    ArrowDown01Icon,
    Briefcase01Icon,
    Building01Icon,
    Building03Icon,
    Chart01Icon,
    CloudServerIcon,
    DashboardSquare01Icon,
    HelpCircleIcon,
    Logout01Icon,
    Notification01Icon,
    PackageIcon,
    SecurityCheckIcon,
    Settings01Icon,
    ShoppingCart01Icon,
    ToolsIcon,
    Tag,
    UserGroupIcon,
    UserShield01Icon,
    Wallet01Icon,
    WorkflowSquare01Icon,
} from '@/components/ui/hugeicons'
import { useNavigate, useRouterState } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useUser } from '@/src/features/auth/api/getUser'
import { useAuthStore } from '@/src/features/auth/stores/authStore'
import { DashboardNavItem } from './DashboardNavItem'

type DashboardSidebarProps = Readonly<{
    open: boolean
    onClose: () => void
}>

const moduleNavigation = [
    { label: 'Overview', icon: <DashboardSquare01Icon size={ 18 } /> },
    { label: 'Assets / Fixed Assets', icon: <Building01Icon size={ 18 } /> },
    { label: 'Authentication & Users', icon: <SecurityCheckIcon size={ 18 } /> },
    { label: 'CRM', icon: <UserGroupIcon size={ 18 } /> },
    { label: 'Finance & Accounting', icon: <Wallet01Icon size={ 18 } /> },
    { label: 'Human Resources', icon: <UserShield01Icon size={ 18 } /> },
    { label: 'Inventory', icon: <PackageIcon size={ 18 } /> },
    { label: 'Manufacturing', icon: <ToolsIcon size={ 18 } /> },
    { label: 'Notifications', icon: <Notification01Icon size={ 18 } /> },
    { label: 'Organization Management', icon: <Building03Icon size={ 18 } /> },
    { label: 'Platform Services', icon: <CloudServerIcon size={ 18 } /> },
    { label: 'Procurement', icon: <ShoppingCart01Icon size={ 18 } /> },
    { label: 'Projects', icon: <Briefcase01Icon size={ 18 } /> },
    { label: 'Reporting', icon: <Analytics01Icon size={ 18 } /> },
    { label: 'Sales', icon: <Chart01Icon size={ 18 } /> },
    { label: 'Workflow', icon: <WorkflowSquare01Icon size={ 18 } /> },
]

const isRouteWithin = ( pathname: string, route: string ) => pathname === route || pathname.startsWith( `${ route }/` )

const isInventoryProductSectionRoute = ( pathname: string ) => (
    isRouteWithin( pathname, '/inventory/products' )
    || ( pathname.startsWith( '/inventory/item/' ) && !pathname.includes( '/variant/' ) )
)

const isInventoryVariantSectionRoute = ( pathname: string ) => (
    isRouteWithin( pathname, '/inventory/variants' )
    || ( pathname.includes( '/inventory/item/' ) && pathname.includes( '/variant/' ) )
)

const isInventoryUomRoute = ( pathname: string ) => isRouteWithin( pathname, '/inventory/settings/uoms' )

const getItemAriaCurrent = ( pathname: string, route: string ): 'page' | 'location' => (
    pathname === route ? 'page' : 'location'
)

const getModuleSubnavId = ( label: string ) => {
    if ( label === 'Inventory' ) return 'inventory-module-subnav'
    if ( label === 'Finance & Accounting' ) return 'finance-module-subnav'
    return undefined
}

export const DashboardSidebar = ( { open, onClose }: DashboardSidebarProps ) => {
    const navigate = useNavigate()
    const pathname = useRouterState( { select: state => state.location.pathname } )
    const { user, setUser, logout } = useAuthStore()
    const { data: sessionUser } = useUser()

    useEffect( () => {
        if ( sessionUser && localStorage.getItem( 'tessera_token' ) ) setUser( sessionUser )
    }, [ sessionUser, setUser ] )

    const displayName = user ? `${ user.firstName } ${ user.lastName }`.trim() : 'Your account'
    const initials = user ? `${ user.firstName[ 0 ] ?? '' }${ user.lastName[ 0 ] ?? '' }`.toUpperCase() : 'TA'
    const isInventoryRoute = isRouteWithin( pathname, '/inventory' )
    const isFinanceRoute = isRouteWithin( pathname, '/finance' )

    const handleLogout = () => {
        logout()
        navigate( { to: '/auth/signin', replace: true } )
    }

    return (
        <>
            <Button
                variant="pill-ghost"
                size="icon"
                type="button"
                className={ `fixed inset-0 z-[19] bg-(--ink)/30 transition-opacity duration-200 lg:hidden ${ open ? 'visible opacity-100' : 'invisible opacity-0' }` }
                aria-label="Close navigation"
                onClick={ onClose }
            />
            <aside className={ `fixed inset-y-0 left-0 z-20 flex w-[min(290px,calc(100vw-48px))] -translate-x-full flex-col border-r border-(--rule) bg-(--paper-2) p-3.5 transition-transform duration-200 lg:sticky lg:top-0 lg:z-auto lg:h-dvh lg:min-h-0 lg:w-[248px] lg:translate-x-0 ${ open ? 'translate-x-0' : '' }` } aria-label="Main navigation">
                <div className="mb-1.5 flex items-center gap-2 px-2.5 pb-3.5 pt-2">
                    <span className="font-display text-2xl font-medium italic tracking-[-0.02em]">Tessera</span>
                    <span className="mb-1 size-1.5 rounded-full bg-(--accent)" aria-hidden="true" />
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button type="button" variant="pill-ghost" size="sm" className="mb-[18px] h-auto flex w-full items-center justify-start gap-2.5 rounded-[10px] border border-(--rule) bg-(--paper) px-2.5 py-1 text-left transition-colors duration-150 hover:border-(--muted-2) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ink)" aria-label="Choose workspace">
                            <span className="grid size-7 shrink-0 place-items-center rounded-[7px] bg-(--accent) font-display text-sm font-medium italic text-(--paper)" aria-hidden="true">H</span>
                            <span className="flex min-w-0 flex-1 flex-col">
                                <strong className="truncate text-[13px] font-medium tracking-[-0.005em]">Hollis &amp; Dray</strong>
                                <small className="truncate font-mono text-[10px] tracking-[0.03em] text-(--muted)">Millwork · workspace</small>
                            </span>
                            <ArrowDown01Icon className="shrink-0 text-(--muted)" size={ 16 } aria-hidden="true" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="start" className="w-[232px]">
                        <DropdownMenuLabel>Current workspace</DropdownMenuLabel>
                        <DropdownMenuItem disabled className="cursor-default opacity-100 focus:bg-transparent">
                            <span className="grid size-7 shrink-0 place-items-center rounded-[7px] bg-(--accent) font-display text-sm font-medium italic text-(--paper)" aria-hidden="true">H</span>
                            <span className="flex min-w-0 flex-col">
                                <strong className="truncate text-[13px] font-medium">Hollis &amp; Dray</strong>
                                <small className="truncate text-[11px] text-(--muted)">Millwork</small>
                            </span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <nav className="min-h-0 flex-1 space-y-[18px] overflow-y-auto">
                    <div className="grid gap-0.5">
                        <p className="px-2.5 pb-1.5 font-mono text-[10px] tracking-[0.14em] text-(--muted) uppercase">Modules</p>
                        { moduleNavigation.map( ( item ) => (
                            <div key={ item.label }>
                                <DashboardNavItem
                                    { ...item }
                                    active={ item.label === 'Overview' && pathname === '/dashboard' }
                                    expanded={ ( item.label === 'Inventory' && isInventoryRoute ) || ( item.label === 'Finance & Accounting' && isFinanceRoute ) }
                                    hasSubmenu={ item.label === 'Inventory' || item.label === 'Finance & Accounting' }
                                    ariaControls={ getModuleSubnavId( item.label ) }
                                    onClick={ () => {
                                        onClose()
                                        if ( item.label === 'Inventory' ) navigate( { to: '/inventory' } )
                                        if ( item.label === 'Finance & Accounting' ) navigate( { to: '/finance' } )
                                    } }
                                />
                                { item.label === 'Inventory' && isInventoryRoute ? (
                                    <div id="inventory-module-subnav" className="ml-5 grid border-l border-(--rule) pl-2">
                                        <DashboardNavItem
                                            label="Overview"
                                            icon={ <DashboardSquare01Icon size={ 17 } /> }
                                            active={ pathname === '/inventory' }
                                            ariaCurrent={ pathname === '/inventory' ? 'page' : undefined }
                                            onClick={ () => {
                                                onClose()
                                                navigate( { to: '/inventory' } )
                                            } }
                                        />
                                        <DashboardNavItem
                                            label="Products"
                                            icon={ <PackageIcon size={ 17 } /> }
                                            active={ isInventoryProductSectionRoute( pathname ) }
                                            ariaCurrent={ isInventoryProductSectionRoute( pathname ) ? getItemAriaCurrent( pathname, '/inventory/products' ) : undefined }
                                            onClick={ () => {
                                                onClose()
                                                navigate( { to: '/inventory/products' } )
                                            } }
                                        />
                                        <DashboardNavItem
                                            label="Product variants"
                                            icon={ <PackageIcon size={ 17 } /> }
                                            active={ isInventoryVariantSectionRoute( pathname ) }
                                            ariaCurrent={ isInventoryVariantSectionRoute( pathname ) ? getItemAriaCurrent( pathname, '/inventory/variants' ) : undefined }
                                            onClick={ () => {
                                                onClose()
                                                navigate( { to: '/inventory/variants' } )
                                            } }
                                        />
                                        <DashboardNavItem
                                            label="Product categories"
                                            icon={ <Tag size={ 17 } /> }
                                            active={ isRouteWithin( pathname, '/inventory/settings/product-categories' ) }
                                            ariaCurrent={ isRouteWithin( pathname, '/inventory/settings/product-categories' ) ? getItemAriaCurrent( pathname, '/inventory/settings/product-categories' ) : undefined }
                                            onClick={ () => {
                                                onClose()
                                                navigate( { to: '/inventory/settings/product-categories' } )
                                            } }
                                        />
                                        <DashboardNavItem
                                            label="Units of measure"
                                            icon={ <Tag size={ 17 } /> }
                                            active={ isInventoryUomRoute( pathname ) }
                                            ariaCurrent={ isInventoryUomRoute( pathname ) ? getItemAriaCurrent( pathname, '/inventory/settings/uoms' ) : undefined }
                                            onClick={ () => {
                                                onClose()
                                                navigate( { to: '/inventory/settings/uoms' } )
                                            } }
                                        />
                                    </div>
                                ) : null }
                                { item.label === 'Finance & Accounting' && isFinanceRoute ? (
                                    <div id="finance-module-subnav" className="ml-5 grid border-l border-(--rule) pl-2">
                                        <DashboardNavItem
                                            label="Overview"
                                            icon={ <DashboardSquare01Icon size={ 17 } /> }
                                            active={ pathname === '/finance' }
                                            onClick={ () => {
                                                onClose()
                                                navigate( { to: '/finance' } )
                                            } }
                                        />
                                        <DashboardNavItem
                                            label="Tax groups"
                                            icon={ <Tag size={ 17 } /> }
                                            active={ isRouteWithin( pathname, '/finance/tax/groups' ) }
                                            ariaCurrent={ isRouteWithin( pathname, '/finance/tax/groups' ) ? getItemAriaCurrent( pathname, '/finance/tax/groups' ) : undefined }
                                            onClick={ () => {
                                                onClose()
                                                navigate( { to: '/finance/tax/groups' } )
                                            } }
                                        />
                                        <DashboardNavItem
                                            label="Tax rates"
                                            icon={ <Tag size={ 17 } /> }
                                            active={ isRouteWithin( pathname, '/finance/tax/rates' ) }
                                            ariaCurrent={ isRouteWithin( pathname, '/finance/tax/rates' ) ? getItemAriaCurrent( pathname, '/finance/tax/rates' ) : undefined }
                                            onClick={ () => {
                                                onClose()
                                                navigate( { to: '/finance/tax/rates' } )
                                            } }
                                        />
                                    </div>
                                ) : null }
                            </div>
                        ) ) }
                    </div>

                    <div className="grid gap-0.5">
                        <p className="px-2.5 pb-1.5 font-mono text-[10px] tracking-[0.14em] text-(--muted) uppercase">Account</p>
                        <DashboardNavItem label="Settings" icon={ <Settings01Icon size={ 18 } /> } onClick={ onClose } />
                        <DashboardNavItem label="Help center" icon={ <HelpCircleIcon size={ 18 } /> } onClick={ onClose } />
                    </div>
                </nav>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button type="button" variant="pill-ghost" size="sm" className="h-auto flex w-full items-center justify-start gap-2.5 rounded-[10px] border border-(--rule) bg-(--paper) px-2.5 py-1 text-left transition-colors duration-150 hover:border-(--muted-2) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ink)" aria-label={`Account menu for ${displayName}`}>
                            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-linear-to-br from-(--plum) to-(--accent) font-display text-[13px] font-medium text-(--paper) shadow-[inset_0_0_0_2px_rgb(255_255_255_/_20%)]" aria-hidden="true">{ initials }</span>
                            <span className="flex min-w-0 flex-1 flex-col">
                                <strong className="truncate text-[13px] font-medium tracking-[-0.003em]">{ displayName }</strong>
                                <small className="truncate text-[11px] text-(--muted)">{ user?.role ?? 'Workspace member' }</small>
                            </span>
                            <ArrowDown01Icon className="shrink-0 text-(--muted)" size={ 16 } aria-hidden="true" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="top" align="end" className="w-[232px]">
                        <DropdownMenuLabel className="normal-case tracking-normal">
                            <span className="block truncate text-[13px] font-medium text-(--ink)">{ displayName }</span>
                            { user?.email ? <span className="mt-0.5 block truncate text-[11px] normal-case tracking-normal text-(--muted)">{ user.email }</span> : null }
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onSelect={ handleLogout }>
                            <Logout01Icon size={ 16 } aria-hidden="true" />
                            Sign out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </aside>
        </>
    )
}
