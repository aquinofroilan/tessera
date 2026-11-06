import { useQuery } from '@tanstack/react-query'
import { axios } from '@/src/lib/axios'
import type { ProductVariantResponse } from '../types/productVariants'

const PRODUCT_VARIANTS_ENDPOINT = '/api/v1/inventory/products'

export const getProductVariants = ( productId: string ): Promise<ProductVariantResponse[]> =>
    axios.get( `${ PRODUCT_VARIANTS_ENDPOINT }/${ encodeURIComponent( productId ) }/variants` )

export const useProductVariants = ( productId: string ) => useQuery( {
    queryKey: [ 'inventory', 'product', productId, 'variants' ],
    queryFn: () => getProductVariants( productId ),
    enabled: Boolean( productId ),
    retry: false,
} )
