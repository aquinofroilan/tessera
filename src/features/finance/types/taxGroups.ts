import type { TaxRateResponse } from '@/src/features/finance/types/taxRates'

export type { TaxRateResponse } from '@/src/features/finance/types/taxRates'

export type TaxGroupResponse = {
    id: string
    name: string
    code: string
    taxRates: TaxRateResponse[]
    combinedRate: number
    organizationId: string
    isActive: boolean
    createdAt: string | null
    updatedAt: string | null
}

export type CreateTaxGroupRequest = {
    name: string
    code: string
    taxRateIds: string[]
}
