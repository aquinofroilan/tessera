import { DashboardShell } from '@/src/features/dashboard/components/DashboardShell'
import { TaxRateCreateForm } from '@/src/features/finance/components/TaxRateCreateForm'

export const TaxRateCreatePage = () => (
    <DashboardShell>
        <TaxRateCreateForm />
    </DashboardShell>
)
