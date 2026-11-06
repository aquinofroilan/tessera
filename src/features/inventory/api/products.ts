import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { axios } from '@/src/lib/axios'
import type { CreateProductRequest, ProductResponse, UpdateProductRequest } from '../types/products'

const PRODUCTS_ENDPOINT = '/api/v1/inventory/products'

type ProductApiResponse = Omit<ProductResponse, 'isActive' | 'isLotTracked' | 'isSerialized' | 'hasExpiry'> & {
    active?: boolean
    isActive?: boolean
    lotTracked?: boolean
    isLotTracked?: boolean
    serialized?: boolean
    isSerialized?: boolean
    hasExpiry?: boolean
}

const mapProductResponse = ( product: ProductApiResponse ): ProductResponse => ( {
    ...product,
    isActive: product.isActive ?? product.active ?? false,
    isLotTracked: product.isLotTracked ?? product.lotTracked ?? false,
    isSerialized: product.isSerialized ?? product.serialized ?? false,
    hasExpiry: product.hasExpiry ?? false,
} )

export type ProductListParams = {
    categoryId?: string
    isActive?: boolean
    search?: string
}

export const getProducts = async ( params: ProductListParams = {} ): Promise<ProductResponse[]> => {
    const products: ProductApiResponse[] = await axios.get( PRODUCTS_ENDPOINT, {
        params: {
            ...params,
            categoryId: params.categoryId?.trim() || undefined,
            search: params.search?.trim() || undefined,
            isActive: params.isActive ?? true,
        },
    } )
    return products.map( mapProductResponse )
}

export const getProduct = async ( id: string ): Promise<ProductResponse> => {
    const product: ProductApiResponse = await axios.get( `${ PRODUCTS_ENDPOINT }/${ encodeURIComponent( id ) }` )
    return mapProductResponse( product )
}

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

export const createProduct = async ( body: CreateProductRequest ): Promise<ProductResponse> => {
    const product: ProductApiResponse = await axios.post( PRODUCTS_ENDPOINT, body )
    return mapProductResponse( product )
}

export const updateProduct = async ( id: string, body: UpdateProductRequest ): Promise<ProductResponse> => {
    const product: ProductApiResponse = await axios.patch( `${ PRODUCTS_ENDPOINT }/${ encodeURIComponent( id ) }`, body )
    return mapProductResponse( product )
}

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
