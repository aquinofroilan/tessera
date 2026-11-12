import { useQuery } from '@tanstack/react-query'
import { axios } from '@/src/lib/axios'
import type { TaxRateResponse } from '@/src/features/finance/types/taxGroups'

const TAX_RATES_ENDPOINT = '/api/v1/finance/tax/rates'

export type TaxRateListParams = {
    activeOnly?: boolean
}

export const getTaxRates = ( { activeOnly = true }: TaxRateListParams = {} ): Promise<TaxRateResponse[]> =>
    axios.get( TAX_RATES_ENDPOINT, { params: { active: activeOnly } } )

export const useTaxRates = ( params: TaxRateListParams = {} ) => useQuery( {
    queryKey: [ 'finance', 'tax-rates', params ],
    queryFn: () => getTaxRates( params ),
} )
