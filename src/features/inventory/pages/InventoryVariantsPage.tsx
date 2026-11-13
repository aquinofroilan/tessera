import { DashboardShell } from '@/src/features/dashboard/components/DashboardShell'
import { InventoryVariantsTable } from '@/src/features/inventory/components/InventoryVariantsTable'

export function InventoryVariantsPage () {
    return (
        <DashboardShell>
            <div className="w-full">
                <header className="mb-7 border-b border-(--rule) pb-6">
                    <h1 className="font-display text-[clamp(36px,4vw,48px)] font-light leading-none tracking-[-0.03em]">Product variants</h1>
                    <p className="mt-2.5 max-w-2xl text-[15px] text-(--ink-soft)">Review variants and their attributes across all products in this organization.</p>
                </header>

                <InventoryVariantsTable className="mt-0" showHeading={ false } />
            </div>
        </DashboardShell>
    )
}
