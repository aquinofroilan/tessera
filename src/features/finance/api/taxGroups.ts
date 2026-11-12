import { useQuery } from '@tanstack/react-query'
import { axios } from '@/src/lib/axios'
import type { TaxGroupResponse } from '@/src/features/finance/types/taxGroups'

const TAX_GROUPS_ENDPOINT = '/api/v1/finance/tax/groups'

export type TaxGroupListParams = {
    activeOnly?: boolean
}

export const getTaxGroups = ( { activeOnly = true }: TaxGroupListParams = {} ): Promise<TaxGroupResponse[]> =>
    axios.get( TAX_GROUPS_ENDPOINT, { params: { active: activeOnly } } )

export const useTaxGroups = ( params: TaxGroupListParams = {} ) => useQuery( {
    queryKey: [ 'finance', 'tax-groups', params ],
    queryFn: () => getTaxGroups( params ),
} )
