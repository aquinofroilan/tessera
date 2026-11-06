import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { axios } from '@/src/lib/axios'
import type { CreateProductRequest, ProductResponse, UpdateProductRequest } from '../types/products'

const PRODUCTS_ENDPOINT = '/api/v1/inventory/products'

export type ProductListParams = {
    categoryId?: string
    isActive?: boolean
    search?: string
}

export const getProducts = ( params: ProductListParams = {} ): Promise<ProductResponse[]> =>
    axios.get( PRODUCTS_ENDPOINT, {
        params: {
            ...params,
            categoryId: params.categoryId?.trim() || undefined,
            search: params.search?.trim() || undefined,
            isActive: params.isActive ?? true,
        },
    } )

export const getProduct = ( id: string ): Promise<ProductResponse> =>
    axios.get( `${ PRODUCTS_ENDPOINT }/${ encodeURIComponent( id ) }` )

export const useProduct = ( id: string ) => useQuery( {
    queryKey: [ 'inventory', 'product', id ],
    queryFn: () => getProduct( id ),
    enabled: Boolean( id ),
    retry: false,
} )

export const useProducts = ( params: ProductListParams = {} ) => useQuery( {
    queryKey: [ 'inventory', 'products', params ],
    queryFn: () => getProducts( params ),
} )

export const createProduct = ( body: CreateProductRequest ): Promise<ProductResponse> =>
    axios.post( PRODUCTS_ENDPOINT, body )

export const updateProduct = ( id: string, body: UpdateProductRequest ): Promise<ProductResponse> =>
    axios.patch( `${ PRODUCTS_ENDPOINT }/${ encodeURIComponent( id ) }`, body )

export const useCreateProduct = () => useMutation( {
    mutationFn: createProduct,
} )

export const useUpdateProduct = () => {
    const queryClient = useQueryClient()

    return useMutation( {
        mutationFn: ( { id, ...body }: UpdateProductRequest & { id: string } ) => updateProduct( id, body ),
        onSuccess: ( product ) => {
            queryClient.setQueryData( [ 'inventory', 'product', product.id ], product )
            queryClient.invalidateQueries( { queryKey: [ 'inventory', 'products' ] } )
        },
    } )
}
