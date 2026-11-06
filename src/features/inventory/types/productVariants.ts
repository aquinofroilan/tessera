export type ProductVariantResponse = {
    id: string
    productId: string
    code: string
    name: string
    skuSuffix: string | null
    attributes: Record<string, string>
    isActive: boolean
}
