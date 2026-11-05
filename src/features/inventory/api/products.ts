import { useMutation } from '@tanstack/react-query'
import { axios } from '@/src/lib/axios'
import type { CreateProductRequest, ProductResponse } from '../types/products'

const PRODUCTS_ENDPOINT = '/api/v1/inventory/products'

export const createProduct = ( body: CreateProductRequest ): Promise<ProductResponse> =>
    axios.post( PRODUCTS_ENDPOINT, body )

export const useCreateProduct = () => useMutation( {
    mutationFn: createProduct,
} )
