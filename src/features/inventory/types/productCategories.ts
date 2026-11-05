export type ProductCategoryResponse = {
    id: string
    name: string
    description: string | null
    isActive: boolean
}

export type CreateProductCategoryRequest = {
    name: string
    description?: string
}

export type UpdateProductCategoryRequest = {
    name?: string
    description?: string
    isActive?: boolean
}
