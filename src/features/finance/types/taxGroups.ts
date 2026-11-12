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
