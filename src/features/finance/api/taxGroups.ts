import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axios } from '@/src/lib/axios';
import type {
  CreateTaxGroupRequest,
  DeactivateTaxGroupResponse,
  TaxGroupResponse,
  UpdateTaxGroupRequest,
} from '@/src/features/finance/types/taxGroups';

const TAX_GROUPS_ENDPOINT = '/api/v1/finance/tax/groups';

export type TaxGroupListParams = {
  activeOnly?: boolean;
};

export const getTaxGroups = ({ activeOnly = true }: TaxGroupListParams = {}): Promise<
  TaxGroupResponse[]
> => axios.get(TAX_GROUPS_ENDPOINT, { params: { active: activeOnly } });

export const useTaxGroups = (params: TaxGroupListParams = {}) =>
  useQuery({
    queryKey: ['finance', 'tax-groups', params],
    queryFn: () => getTaxGroups(params),
  });

export const getTaxGroup = (id: string): Promise<TaxGroupResponse> =>
  axios.get(`${TAX_GROUPS_ENDPOINT}/${id}`);

export const useTaxGroup = (id: string) =>
  useQuery({
    queryKey: ['finance', 'tax-groups', id],
    queryFn: () => getTaxGroup(id),
    enabled: Boolean(id),
  });

export const createTaxGroup = (body: CreateTaxGroupRequest): Promise<TaxGroupResponse> =>
  axios.post(TAX_GROUPS_ENDPOINT, body);

export const useCreateTaxGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTaxGroup,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['finance', 'tax-groups'] }),
  });
};

export const updateTaxGroup = (
  id: string,
  body: UpdateTaxGroupRequest,
): Promise<TaxGroupResponse> => axios.put(`${TAX_GROUPS_ENDPOINT}/${id}`, body);

export const useUpdateTaxGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateTaxGroupRequest }) =>
      updateTaxGroup(id, body),
    onSuccess: async (_updatedGroup, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['finance', 'tax-groups'] }),
        queryClient.invalidateQueries({
          queryKey: ['finance', 'tax-groups', variables.id],
        }),
      ]);
    },
  });
};

export const deactivateTaxGroup = (id: string): Promise<DeactivateTaxGroupResponse> =>
  axios.delete(`${TAX_GROUPS_ENDPOINT}/${id}`);

export const useDeactivateTaxGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deactivateTaxGroup,
    onSuccess: async (_response, id) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['finance', 'tax-groups'] }),
        queryClient.invalidateQueries({ queryKey: ['finance', 'tax-groups', id] }),
      ]);
    },
  });
};
