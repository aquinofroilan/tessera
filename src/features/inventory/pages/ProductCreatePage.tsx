import { DashboardShell } from '@/src/features/dashboard/components/DashboardShell'
import { ProductCreateForm } from '@/src/features/inventory/components/ProductCreateForm'

export const ProductCreatePage = () => (
    <DashboardShell>
        <ProductCreateForm />
    </DashboardShell>
)
