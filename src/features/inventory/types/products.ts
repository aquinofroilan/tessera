export type CreateProductRequest = {
    sku: string
    name: string
    description?: string
    categoryId?: string | null
    imageUrl?: string
    listPrice: number
    priceCurrency?: string
    taxGroupId?: string | null
    isLotTracked: boolean
    isSerialized: boolean
    hasExpiry: boolean
}

export type ProductResponse = {
    id: string
    sku: string
    name: string
    description: string | null
    categoryId: string | null
    imageUrl: string | null
    listPrice: number
    priceCurrency: string | null
    taxGroupId: string | null
    organizationId: string
    isLotTracked: boolean
    isSerialized: boolean
    hasExpiry: boolean
    isActive: boolean
    createdAt: string
    updatedAt: string
}
