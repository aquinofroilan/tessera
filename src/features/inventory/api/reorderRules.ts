import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axios } from '@/src/lib/axios';
import type {
  CreateReorderRuleRequest,
  ReorderRuleResponse,
  UpdateReorderRuleRequest,
} from '@/src/features/inventory/types/reorderRules';

const REORDER_RULES_ENDPOINT = '/api/v1/inventory/reorder-rules';
const REORDER_RULES_QUERY_KEY = ['inventory', 'reorder-rules'] as const;

export const getReorderRules = (): Promise<ReorderRuleResponse[]> =>
  axios.get(REORDER_RULES_ENDPOINT);

export const getReorderRule = (id: string): Promise<ReorderRuleResponse> =>
  axios.get(`${REORDER_RULES_ENDPOINT}/${encodeURIComponent(id)}`);

export const createReorderRule = (body: CreateReorderRuleRequest): Promise<ReorderRuleResponse> =>
  axios.post(REORDER_RULES_ENDPOINT, body);

export const updateReorderRule = (
  id: string,
  body: UpdateReorderRuleRequest,
): Promise<ReorderRuleResponse> =>
  axios.patch(`${REORDER_RULES_ENDPOINT}/${encodeURIComponent(id)}`, body);

export const deleteReorderRule = (id: string): Promise<void> =>
  axios.delete(`${REORDER_RULES_ENDPOINT}/${encodeURIComponent(id)}`);

export const useReorderRules = () =>
  useQuery({
    queryKey: REORDER_RULES_QUERY_KEY,
    queryFn: getReorderRules,
  });

export const useReorderRule = (id: string) =>
  useQuery({
    queryKey: [...REORDER_RULES_QUERY_KEY, id],
    queryFn: () => getReorderRule(id),
    enabled: Boolean(id),
  });

export const useCreateReorderRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReorderRule,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: REORDER_RULES_QUERY_KEY }),
  });
};

export const useUpdateReorderRule = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateReorderRuleRequest) => updateReorderRule(id, body),
    onSuccess: (rule) => {
      queryClient.setQueryData([...REORDER_RULES_QUERY_KEY, id], rule);
      void queryClient.invalidateQueries({ queryKey: REORDER_RULES_QUERY_KEY });
    },
  });
};

export const useDeleteReorderRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReorderRule,
    onSuccess: (_response, id) => {
      queryClient.removeQueries({ queryKey: [...REORDER_RULES_QUERY_KEY, id] });
      void queryClient.invalidateQueries({ queryKey: REORDER_RULES_QUERY_KEY });
    },
  });
};
