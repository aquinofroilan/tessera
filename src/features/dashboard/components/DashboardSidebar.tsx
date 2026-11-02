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
    UserGroupIcon,
    UserShield01Icon,
    Wallet01Icon,
    WorkflowSquare01Icon,
} from 'hugeicons-react'
import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/src/features/auth/stores/authStore'
import { DashboardNavItem } from './DashboardNavItem'

type DashboardSidebarProps = {
    open: boolean
    onClose: () => void
}

const moduleNavigation = [
    { label: 'Overview', icon: <DashboardSquare01Icon size={ 18 } />, active: true },
    { label: 'Assets / Fixed Assets', icon: <Building01Icon size={ 18 } /> },
    { label: 'Authentication & Users', icon: <SecurityCheckIcon size={ 18 } /> },
    { label: 'CRM', icon: <UserGroupIcon size={ 18 } /> },
    { label: 'Finance & Accounting', icon: <Wallet01Icon size={ 18 } /> },
    { label: 'Human Resources', icon: <UserShield01Icon size={ 18 } /> },
    { label: 'Inventory', icon: <PackageIcon size={ 18 } />, badge: '24' },
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

export const DashboardSidebar = ( { open, onClose }: DashboardSidebarProps ) => {
    const navigate = useNavigate()
    const { user, logout } = useAuthStore()
    const displayName = user ? `${ user.firstName } ${ user.lastName }`.trim() : 'Your account'
    const initials = user ? `${ user.firstName[ 0 ] ?? '' }${ user.lastName[ 0 ] ?? '' }`.toUpperCase() : 'TA'

    const handleLogout = () => {
        logout()
        navigate( { to: '/auth/signin', replace: true } )
    }

    return (
        <>
            <button
                type="button"
                className={ `fixed inset-0 z-[19] bg-(--ink)/30 transition-opacity duration-200 lg:hidden ${ open ? 'visible opacity-100' : 'invisible opacity-0' }` }
                aria-label="Close navigation"
                onClick={ onClose }
            />
            <aside className={ `fixed inset-y-0 left-0 z-20 flex w-[min(290px,calc(100vw-48px))] -translate-x-full flex-col border-r border-(--rule) bg-(--paper-2) p-3.5 transition-transform duration-200 lg:static lg:z-auto lg:w-[248px] lg:min-h-screen lg:translate-x-0 ${ open ? 'translate-x-0' : '' }` } aria-label="Main navigation">
                <div className="mb-1.5 flex items-center gap-2 px-2.5 pb-3.5 pt-2">
                    <span className="font-display text-2xl font-medium italic tracking-[-0.02em]">Tessera</span>
                    <span className="mb-1 size-1.5 rounded-full bg-(--accent)" aria-hidden="true" />
                </div>

                <button type="button" className="mb-[18px] flex w-full items-center gap-2.5 rounded-[10px] border border-(--rule) bg-(--paper) p-2.5 text-left transition-colors duration-150 hover:border-(--muted-2) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ink)">
                    <span className="grid size-7 shrink-0 place-items-center rounded-[7px] bg-(--accent) font-display text-sm font-medium italic text-(--paper)" aria-hidden="true">H</span>
                    <span className="flex min-w-0 flex-1 flex-col">
                        <strong className="truncate text-[13px] font-medium tracking-[-0.005em]">Hollis &amp; Dray</strong>
                        <small className="truncate font-mono text-[10px] tracking-[0.03em] text-(--muted)">Millwork · workspace</small>
                    </span>
                    <ArrowDown01Icon className="shrink-0 text-(--muted)" size={ 16 } aria-hidden="true" />
                </button>

                <nav className="min-h-0 flex-1 space-y-[18px] overflow-y-auto">
                    <div className="grid gap-0.5">
                        <p className="px-2.5 pb-1.5 font-mono text-[10px] tracking-[0.14em] text-(--muted) uppercase">Modules</p>
                        { moduleNavigation.map( ( item ) => (
                            <DashboardNavItem key={ item.label } { ...item } onClick={ onClose } />
                        ) ) }
                    </div>

                    <div className="grid gap-0.5">
                        <p className="px-2.5 pb-1.5 font-mono text-[10px] tracking-[0.14em] text-(--muted) uppercase">Account</p>
                        <DashboardNavItem label="Settings" icon={ <Settings01Icon size={ 18 } /> } onClick={ onClose } />
                        <DashboardNavItem label="Help center" icon={ <HelpCircleIcon size={ 18 } /> } onClick={ onClose } />
                    </div>
                </nav>

                <div className="flex-1" />

                <button type="button" className="flex w-full items-center gap-2.5 rounded-[10px] border border-(--rule) bg-(--paper) p-2.5 text-left transition-colors duration-150 hover:border-(--muted-2) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ink)" onClick={ handleLogout }>
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-linear-to-br from-(--plum) to-(--accent) font-display text-[13px] font-medium text-(--paper) shadow-[inset_0_0_0_2px_rgb(255_255_255_/_20%)]" aria-hidden="true">{ initials }</span>
                    <span className="flex min-w-0 flex-1 flex-col">
                        <strong className="truncate text-[13px] font-medium tracking-[-0.003em]">{ displayName }</strong>
                        <small className="truncate text-[11px] text-(--muted)">{ user?.role ?? 'Workspace member' }</small>
                    </span>
                    <Logout01Icon className="shrink-0 text-(--muted)" size={ 16 } aria-label="Sign out" />
                </button>
            </aside>
        </>
    )
}
