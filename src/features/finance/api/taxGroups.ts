import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { axios } from '@/src/lib/axios'
import type { CreateTaxGroupRequest, TaxGroupResponse } from '@/src/features/finance/types/taxGroups'

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

export const createTaxGroup = ( body: CreateTaxGroupRequest ): Promise<TaxGroupResponse> =>
    axios.post( TAX_GROUPS_ENDPOINT, body )

export const useCreateTaxGroup = () => {
    const queryClient = useQueryClient()

    return useMutation( {
        mutationFn: createTaxGroup,
        onSuccess: () => queryClient.invalidateQueries( { queryKey: [ 'finance', 'tax-groups' ] } ),
    } )
}
