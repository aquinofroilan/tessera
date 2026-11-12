import { DashboardShell } from '@/src/features/dashboard/components/DashboardShell'
import { TaxGroupCreateForm } from '@/src/features/finance/components/TaxGroupCreateForm'

export function TaxGroupCreatePage () {
    return (
        <DashboardShell>
            <TaxGroupCreateForm />
        </DashboardShell>
    )
}
