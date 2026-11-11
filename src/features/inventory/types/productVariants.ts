export type ProductVariantResponse = {
    id: string
    organizationId: string
    productId: string
    code: string
    name: string
    skuSuffix: string | null
    attributes: Record<string, unknown>
    isActive: boolean
    createdAt: string | null
    updatedAt: string | null
}

export type CreateProductVariantRequest = {
    code: string
    name: string
    skuSuffix?: string
    attributes: Record<string, unknown>
}

export type UpdateProductVariantRequest = {
    name: string
    skuSuffix: string | null
    attributes: Record<string, unknown>
    isActive: boolean
}
