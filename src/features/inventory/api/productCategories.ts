import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { axios } from '@/src/lib/axios'
import type { CreateProductCategoryRequest, ProductCategoryResponse, UpdateProductCategoryRequest } from '@/src/features/inventory/types/productCategories'

const CATEGORIES_ENDPOINT = '/api/v1/inventory/categories'

export type ProductCategoryListParams = {
    activeOnly?: boolean
}

export const getProductCategories = ( { activeOnly = true }: ProductCategoryListParams = {} ): Promise<ProductCategoryResponse[]> =>
    axios.get( CATEGORIES_ENDPOINT, { params: { activeOnly } } )

export const useProductCategories = ( params: ProductCategoryListParams = {} ) => useQuery( {
    queryKey: [ 'inventory', 'product-categories', params ],
    queryFn: () => getProductCategories( params ),
} )

export const createProductCategory = ( body: CreateProductCategoryRequest ): Promise<ProductCategoryResponse> =>
    axios.post( CATEGORIES_ENDPOINT, body )

export const updateProductCategory = ( id: string, body: UpdateProductCategoryRequest ): Promise<ProductCategoryResponse> =>
    axios.patch( `${ CATEGORIES_ENDPOINT }/${ id }`, body )

export const deactivateProductCategory = ( id: string ): Promise<ProductCategoryResponse> =>
    axios.delete( `${ CATEGORIES_ENDPOINT }/${ id }` )

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
