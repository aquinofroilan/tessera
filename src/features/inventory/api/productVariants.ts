import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { axios } from '@/src/lib/axios'
import type { ProductVariantResponse, UpdateProductVariantRequest } from '../types/productVariants'

const PRODUCT_VARIANTS_ENDPOINT = '/api/v1/inventory/products'

export const getProductVariants = ( productId: string ): Promise<ProductVariantResponse[]> =>
    axios.get( `${ PRODUCT_VARIANTS_ENDPOINT }/${ encodeURIComponent( productId ) }/variants` )

export const getProductVariant = ( productId: string, variantId: string ): Promise<ProductVariantResponse> =>
    axios.get( `${ PRODUCT_VARIANTS_ENDPOINT }/${ encodeURIComponent( productId ) }/variants/${ encodeURIComponent( variantId ) }` )

export const updateProductVariant = ( productId: string, variantId: string, body: UpdateProductVariantRequest ): Promise<ProductVariantResponse> =>
    axios.put( `${ PRODUCT_VARIANTS_ENDPOINT }/${ encodeURIComponent( productId ) }/variants/${ encodeURIComponent( variantId ) }`, body )

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

export const useUpdateProductVariant = ( productId: string, variantId: string ) => {
    const queryClient = useQueryClient()

    return useMutation( {
        mutationFn: ( body: UpdateProductVariantRequest ) => updateProductVariant( productId, variantId, body ),
        onSuccess: variant => {
            queryClient.setQueryData( [ 'inventory', 'product', productId, 'variant', variantId ], variant )
            queryClient.setQueryData<ProductVariantResponse[]>( [ 'inventory', 'product', productId, 'variants' ], previous =>
                previous?.map( item => item.id === variant.id ? variant : item ),
            )
            queryClient.invalidateQueries( { queryKey: [ 'inventory', 'product', productId, 'variants' ] } )
        },
    } )
}
