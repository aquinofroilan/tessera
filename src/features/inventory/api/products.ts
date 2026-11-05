import { useMutation, useQuery } from '@tanstack/react-query'
import { axios } from '@/src/lib/axios'
import type { CreateProductRequest, ProductResponse } from '../types/products'

const PRODUCTS_ENDPOINT = '/api/v1/inventory/products'

export type ProductListParams = {
    category?: string
    isActive?: boolean
    search?: string
}

export const getProducts = ( params: ProductListParams = {} ): Promise<ProductResponse[]> =>
    axios.get( PRODUCTS_ENDPOINT, {
        params: {
            ...params,
            category: params.category?.trim() || undefined,
            search: params.search?.trim() || undefined,
            isActive: params.isActive ?? true,
        },
    } )

export const useProducts = ( params: ProductListParams = {} ) => useQuery( {
    queryKey: [ 'inventory', 'products', params ],
    queryFn: () => getProducts( params ),
} )

export const createProduct = ( body: CreateProductRequest ): Promise<ProductResponse> =>
    axios.post( PRODUCTS_ENDPOINT, body )

export const useCreateProduct = () => useMutation( {
    mutationFn: createProduct,
} )
