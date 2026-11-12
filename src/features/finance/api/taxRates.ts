import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { axios } from '@/src/lib/axios'
import type { CreateTaxRateRequest, TaxRateResponse } from '@/src/features/finance/types/taxRates'

const TAX_RATES_ENDPOINT = '/api/v1/finance/tax/rates'
const TAX_RATES_QUERY_KEY = [ 'finance', 'tax-rates' ] as const

export type TaxRateListParams = {
    activeOnly?: boolean
}

export const getTaxRates = ( { activeOnly = true }: TaxRateListParams = {} ): Promise<TaxRateResponse[]> =>
    axios.get( TAX_RATES_ENDPOINT, { params: { active: activeOnly } } )

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
