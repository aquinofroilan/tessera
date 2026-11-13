import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { axios } from '@/src/lib/axios'
import type { CreateProductCategoryRequest, ProductCategoryResponse, UpdateProductCategoryRequest } from '@/src/features/inventory/types/productCategories'

const CATEGORIES_ENDPOINT = '/api/v1/inventory/categories'

type ProductCategoryApiResponse = Omit<ProductCategoryResponse, 'isActive'> & {
    active?: boolean
    isActive?: boolean
}

const normalizeProductCategory = ( category: ProductCategoryApiResponse ): ProductCategoryResponse => ( {
    id: category.id,
    name: category.name,
    description: category.description,
    isActive: category.active ?? category.isActive ?? false,
} )

export type ProductCategoryListParams = {
    activeOnly?: boolean
}

export const getProductCategories = async ( { activeOnly = true }: ProductCategoryListParams = {} ): Promise<ProductCategoryResponse[]> => {
    const categories: ProductCategoryApiResponse[] = await axios.get( CATEGORIES_ENDPOINT, { params: { activeOnly } } )
    return categories.map( normalizeProductCategory )
}

export const useProductCategories = ( params: ProductCategoryListParams = {}, enabled = true ) => useQuery( {
    queryKey: [ 'inventory', 'product-categories', params ],
    queryFn: () => getProductCategories( params ),
    enabled,
} )

export const createProductCategory = async ( body: CreateProductCategoryRequest ): Promise<ProductCategoryResponse> => {
    const category: ProductCategoryApiResponse = await axios.post( CATEGORIES_ENDPOINT, body )
    return normalizeProductCategory( category )
}

export const updateProductCategory = async ( id: string, body: UpdateProductCategoryRequest ): Promise<ProductCategoryResponse> => {
    const category: ProductCategoryApiResponse = await axios.patch( `${ CATEGORIES_ENDPOINT }/${ id }`, body )
    return normalizeProductCategory( category )
}

export const deactivateProductCategory = async ( id: string ): Promise<ProductCategoryResponse> => {
    const category: ProductCategoryApiResponse = await axios.delete( `${ CATEGORIES_ENDPOINT }/${ id }` )
    return normalizeProductCategory( category )
}

export const useCreateProductCategory = () => {
    const queryClient = useQueryClient()
    return useMutation( {
        mutationFn: createProductCategory,
        onSuccess: () => queryClient.invalidateQueries( { queryKey: [ 'inventory', 'product-categories' ] } ),
    } )
}

export const useUpdateProductCategory = () => {
    const queryClient = useQueryClient()
    return useMutation( {
        mutationFn: ( { id, ...body }: UpdateProductCategoryRequest & { id: string } ) => updateProductCategory( id, body ),
        onSuccess: () => queryClient.invalidateQueries( { queryKey: [ 'inventory', 'product-categories' ] } ),
    } )
}

export const useDeactivateProductCategory = () => {
    const queryClient = useQueryClient()
    return useMutation( {
        mutationFn: deactivateProductCategory,
        onSuccess: () => queryClient.invalidateQueries( { queryKey: [ 'inventory', 'product-categories' ] } ),
    } )
}
