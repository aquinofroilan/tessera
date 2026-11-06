export type ProductVariantResponse = {
    id: string
    productId: string
    code: string
    name: string
    skuSuffix: string | null
    attributes: Record<string, string>
    isActive: boolean
}

export type CreateProductVariantRequest = {
    code: string
    name: string
    skuSuffix?: string
    attributes: Record<string, string>
}

export type UpdateProductVariantRequest = {
    name: string
    skuSuffix: string | null
    attributes: Record<string, string>
    isActive: boolean
}
