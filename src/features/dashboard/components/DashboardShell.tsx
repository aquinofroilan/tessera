import { useState, type ReactNode } from 'react'
import { DashboardSidebar } from './DashboardSidebar'
import { DashboardTopbar } from './DashboardTopbar'

type DashboardShellProps = {
    children: ReactNode
}

export const DashboardShell = ( { children }: DashboardShellProps ) => {
    const [sidebarOpen, setSidebarOpen] = useState( false )

    return (
        <div className="grid h-dvh grid-cols-1 overflow-hidden bg-(--paper) text-(--ink) lg:grid-cols-[248px_minmax(0,1fr)]">
            <DashboardSidebar open={ sidebarOpen } onClose={ () => setSidebarOpen( false ) } />
            <div className="flex h-dvh min-h-0 min-w-0 w-full flex-col">
                <DashboardTopbar onMenuClick={ () => setSidebarOpen( true ) } />
                <main className="min-h-0 min-w-0 w-full flex-1 overflow-y-auto overscroll-contain px-4 py-6 sm:px-6 lg:px-7 lg:py-7">{ children }</main>
            </div>
        </div>
    )
}
