import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { axios } from '@/src/lib/axios'
import type { CreateTaxRateRequest, DeactivateTaxRateResponse, TaxRateResponse, UpdateTaxRateRequest } from '@/src/features/finance/types/taxRates'

const TAX_RATES_ENDPOINT = '/api/v1/finance/tax/rates'
const TAX_RATES_QUERY_KEY = [ 'finance', 'tax-rates' ] as const

export type TaxRateListParams = {
    activeOnly?: boolean | null
}

export const getTaxRates = ( { activeOnly = true }: TaxRateListParams = {} ): Promise<TaxRateResponse[]> =>
    axios.get( TAX_RATES_ENDPOINT, activeOnly === null ? undefined : { params: { active: activeOnly } } )

export const useTaxRates = ( params: TaxRateListParams = {} ) => useQuery( {
    queryKey: [ 'finance', 'tax-rates', params ],
    queryFn: () => getTaxRates( params ),
} )

export const createTaxRate = ( body: CreateTaxRateRequest ): Promise<TaxRateResponse> =>
    axios.post( TAX_RATES_ENDPOINT, body )

export const useCreateTaxRate = () => {
    const queryClient = useQueryClient()

    return useMutation( {
        mutationFn: createTaxRate,
        onSuccess: () => queryClient.invalidateQueries( { queryKey: TAX_RATES_QUERY_KEY } ),
    } )
}

export const updateTaxRate = ( id: string, body: UpdateTaxRateRequest ): Promise<TaxRateResponse> =>
    axios.put( `${ TAX_RATES_ENDPOINT }/${ id }`, body )

export const useUpdateTaxRate = () => {
    const queryClient = useQueryClient()

    return useMutation( {
        mutationFn: ( { id, body }: { id: string, body: UpdateTaxRateRequest } ) => updateTaxRate( id, body ),
        onSuccess: async () => {
            await Promise.all( [
                queryClient.invalidateQueries( { queryKey: TAX_RATES_QUERY_KEY } ),
                queryClient.invalidateQueries( { queryKey: [ 'finance', 'tax-groups' ] } ),
            ] )
        },
    } )
}

export const deactivateTaxRate = ( id: string ): Promise<DeactivateTaxRateResponse> =>
    axios.delete( `${ TAX_RATES_ENDPOINT }/${ id }` )

export const useDeactivateTaxRate = () => {
    const queryClient = useQueryClient()

    return useMutation( {
        mutationFn: deactivateTaxRate,
        onSuccess: async () => {
            await Promise.all( [
                queryClient.invalidateQueries( { queryKey: TAX_RATES_QUERY_KEY } ),
                queryClient.invalidateQueries( { queryKey: [ 'finance', 'tax-groups' ] } ),
            ] )
        },
    } )
}
