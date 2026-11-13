import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { axios } from '@/src/lib/axios'
import type { CreateUnitOfMeasureRequest, UnitConversionRequest, UnitConversionResponse, UnitOfMeasureResponse, UpdateUnitOfMeasureRequest } from '@/src/features/inventory/types/unitsOfMeasure'

const UNITS_OF_MEASURE_ENDPOINT = '/api/v1/inventory/uoms'
const UNITS_OF_MEASURE_QUERY_KEY = [ 'inventory', 'units-of-measure' ] as const

export type UnitOfMeasureListParams = {
    activeOnly?: boolean
}

export const getUnitsOfMeasure = ( { activeOnly = true }: UnitOfMeasureListParams = {} ): Promise<UnitOfMeasureResponse[]> =>
    axios.get( UNITS_OF_MEASURE_ENDPOINT, { params: { activeOnly } } )

export const getUnitOfMeasure = ( id: string ): Promise<UnitOfMeasureResponse> =>
    axios.get( `${ UNITS_OF_MEASURE_ENDPOINT }/${ encodeURIComponent( id ) }` )

export const createUnitOfMeasure = ( body: CreateUnitOfMeasureRequest ): Promise<UnitOfMeasureResponse> =>
    axios.post( UNITS_OF_MEASURE_ENDPOINT, body )

export const updateUnitOfMeasure = ( id: string, body: UpdateUnitOfMeasureRequest ): Promise<UnitOfMeasureResponse> =>
    axios.put( `${ UNITS_OF_MEASURE_ENDPOINT }/${ encodeURIComponent( id ) }`, body )

export const deactivateUnitOfMeasure = ( id: string ): Promise<UnitOfMeasureResponse> =>
    axios.delete( `${ UNITS_OF_MEASURE_ENDPOINT }/${ encodeURIComponent( id ) }` )

export const convertUnitOfMeasure = ( params: UnitConversionRequest ): Promise<UnitConversionResponse> =>
    axios.get( `${ UNITS_OF_MEASURE_ENDPOINT }/convert`, { params } )

export const useUnitsOfMeasure = ( params: UnitOfMeasureListParams = {} ) => useQuery( {
    queryKey: [ ...UNITS_OF_MEASURE_QUERY_KEY, params ],
    queryFn: () => getUnitsOfMeasure( params ),
    retry: false,
} )

export const useUnitOfMeasure = ( id: string ) => useQuery( {
    queryKey: [ ...UNITS_OF_MEASURE_QUERY_KEY, id ],
    queryFn: () => getUnitOfMeasure( id ),
    enabled: Boolean( id ),
    retry: false,
} )

export const useCreateUnitOfMeasure = () => {
    const queryClient = useQueryClient()

    return useMutation( {
        mutationFn: createUnitOfMeasure,
        onSuccess: () => queryClient.invalidateQueries( { queryKey: UNITS_OF_MEASURE_QUERY_KEY } ),
    } )
}

export const useUpdateUnitOfMeasure = ( id: string ) => {
    const queryClient = useQueryClient()

    return useMutation( {
        mutationFn: ( body: UpdateUnitOfMeasureRequest ) => updateUnitOfMeasure( id, body ),
        onSuccess: unit => {
            queryClient.setQueryData( [ ...UNITS_OF_MEASURE_QUERY_KEY, id ], unit )
            queryClient.invalidateQueries( { queryKey: UNITS_OF_MEASURE_QUERY_KEY } )
        },
    } )
}

export const useDeactivateUnitOfMeasure = ( id: string ) => {
    const queryClient = useQueryClient()

    return useMutation( {
        mutationFn: () => deactivateUnitOfMeasure( id ),
        onSuccess: unit => {
            queryClient.setQueryData( [ ...UNITS_OF_MEASURE_QUERY_KEY, id ], unit )
            queryClient.invalidateQueries( { queryKey: UNITS_OF_MEASURE_QUERY_KEY } )
        },
    } )
}

export const useConvertUnitOfMeasure = () => useMutation( {
    mutationFn: convertUnitOfMeasure,
} )
