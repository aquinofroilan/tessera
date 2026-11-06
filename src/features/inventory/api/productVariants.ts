import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { axios } from '@/src/lib/axios'
import type { CreateProductVariantRequest, ProductVariantResponse } from '../types/productVariants'

const PRODUCT_VARIANTS_ENDPOINT = '/api/v1/inventory/products'

export const getProductVariants = ( productId: string ): Promise<ProductVariantResponse[]> =>
    axios.get( `${ PRODUCT_VARIANTS_ENDPOINT }/${ encodeURIComponent( productId ) }/variants` )

export const getProductVariant = ( productId: string, variantId: string ): Promise<ProductVariantResponse> =>
    axios.get( `${ PRODUCT_VARIANTS_ENDPOINT }/${ encodeURIComponent( productId ) }/variants/${ encodeURIComponent( variantId ) }` )

export const createProductVariant = ( productId: string, body: CreateProductVariantRequest ): Promise<ProductVariantResponse> =>
    axios.post( `${ PRODUCT_VARIANTS_ENDPOINT }/${ encodeURIComponent( productId ) }/variants`, body )

export const useProductVariants = ( productId: string ) => useQuery( {
    queryKey: [ 'inventory', 'product', productId, 'variants' ],
    queryFn: () => getProductVariants( productId ),
    enabled: Boolean( productId ),
    retry: false,
} )

export const useProductVariant = ( productId: string, variantId: string ) => useQuery( {
    queryKey: [ 'inventory', 'product', productId, 'variant', variantId ],
    queryFn: () => getProductVariant( productId, variantId ),
    enabled: Boolean( productId && variantId ),
    retry: false,
} )

export const useCreateProductVariant = ( productId: string ) => {
    const queryClient = useQueryClient()

    return useMutation( {
        mutationFn: ( body: CreateProductVariantRequest ) => createProductVariant( productId, body ),
        onSuccess: ( variant ) => {
            queryClient.setQueryData<ProductVariantResponse[]>( [ 'inventory', 'product', productId, 'variants' ], previous => [ ...( previous ?? [] ), variant ] )
            queryClient.invalidateQueries( { queryKey: [ 'inventory', 'product', productId, 'variants' ] } )
        },
    } )
}
