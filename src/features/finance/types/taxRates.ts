export type TaxRateResponse = {
    id: string
    name: string
    code: string
    percentage: number
    authority: string
    organizationId: string
    isActive: boolean
    createdAt: string | null
    updatedAt: string | null
}

export type CreateTaxRateRequest = Pick<TaxRateResponse, 'name' | 'code' | 'percentage' | 'authority'>
