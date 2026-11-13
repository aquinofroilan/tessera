import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { axios } from '@/src/lib/axios'
import type { CreateWarehouseLocationRequest, CreateWarehouseRequest, UpdateWarehouseRequest, WarehouseListParams, WarehouseLocationResponse, WarehouseResponse } from '@/src/features/inventory/types/warehouses'

const WAREHOUSES_ENDPOINT = '/api/v1/inventory/warehouses'
const LOCATIONS_ENDPOINT = '/api/v1/inventory/locations'
const WAREHOUSES_QUERY_KEY = [ 'inventory', 'warehouses' ] as const
const LOCATIONS_QUERY_KEY = [ 'inventory', 'warehouse-locations' ] as const

export const getWarehouses = ( { isActive = true, search }: WarehouseListParams = {} ): Promise<WarehouseResponse[]> =>
    axios.get( WAREHOUSES_ENDPOINT, { params: { isActive, search: search?.trim() || undefined } } )

export const getWarehouse = ( id: string ): Promise<WarehouseResponse> =>
    axios.get( `${ WAREHOUSES_ENDPOINT }/${ encodeURIComponent( id ) }` )

export const createWarehouse = ( body: CreateWarehouseRequest ): Promise<WarehouseResponse> =>
    axios.post( WAREHOUSES_ENDPOINT, body )

export const updateWarehouse = ( id: string, body: UpdateWarehouseRequest ): Promise<WarehouseResponse> =>
    axios.patch( `${ WAREHOUSES_ENDPOINT }/${ encodeURIComponent( id ) }`, body )

export const deactivateWarehouse = ( id: string ): Promise<WarehouseResponse> =>
    axios.delete( `${ WAREHOUSES_ENDPOINT }/${ encodeURIComponent( id ) }` )

export const getWarehouseLocations = ( warehouseId: string ): Promise<WarehouseLocationResponse[]> =>
    axios.get( LOCATIONS_ENDPOINT, { params: { warehouseId } } )

export const createWarehouseLocation = ( body: CreateWarehouseLocationRequest ): Promise<WarehouseLocationResponse> =>
    axios.post( LOCATIONS_ENDPOINT, body )

export const useWarehouses = ( params: WarehouseListParams = {} ) => useQuery( {
    queryKey: [ ...WAREHOUSES_QUERY_KEY, params ],
    queryFn: () => getWarehouses( params ),
    retry: false,
} )

export const useWarehouse = ( id: string ) => useQuery( {
    queryKey: [ ...WAREHOUSES_QUERY_KEY, id ],
    queryFn: () => getWarehouse( id ),
    enabled: Boolean( id ),
    retry: false,
} )

export const useWarehouseLocations = ( warehouseId: string ) => useQuery( {
    queryKey: [ ...LOCATIONS_QUERY_KEY, warehouseId ],
    queryFn: () => getWarehouseLocations( warehouseId ),
    enabled: Boolean( warehouseId ),
    retry: false,
} )

export const useCreateWarehouse = () => {
    const queryClient = useQueryClient()

    return useMutation( {
        mutationFn: createWarehouse,
        onSuccess: () => queryClient.invalidateQueries( { queryKey: WAREHOUSES_QUERY_KEY } ),
    } )
}

export const useUpdateWarehouse = ( id: string ) => {
    const queryClient = useQueryClient()

    return useMutation( {
        mutationFn: ( body: UpdateWarehouseRequest ) => updateWarehouse( id, body ),
        onSuccess: warehouse => {
            queryClient.setQueryData( [ ...WAREHOUSES_QUERY_KEY, id ], warehouse )
            queryClient.invalidateQueries( { queryKey: WAREHOUSES_QUERY_KEY } )
        },
    } )
}

export const useDeactivateWarehouse = ( id: string ) => {
    const queryClient = useQueryClient()

    return useMutation( {
        mutationFn: () => deactivateWarehouse( id ),
        onSuccess: warehouse => {
            queryClient.setQueryData( [ ...WAREHOUSES_QUERY_KEY, id ], warehouse )
            queryClient.invalidateQueries( { queryKey: WAREHOUSES_QUERY_KEY } )
        },
    } )
}

export const useCreateWarehouseLocation = () => {
    const queryClient = useQueryClient()

    return useMutation( {
        mutationFn: createWarehouseLocation,
        onSuccess: location => queryClient.invalidateQueries( { queryKey: [ ...LOCATIONS_QUERY_KEY, location.warehouseId ] } ),
    } )
}
