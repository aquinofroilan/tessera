import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axios } from '@/src/lib/axios';
import type {
  CountSessionResponse,
  CountSessionStatus,
  CreateCountSessionRequest,
  RecordCountRequest,
} from '@/src/features/inventory/types/countSessions';

const COUNTS_ENDPOINT = '/api/v1/inventory/counts';
const COUNTS_QUERY_KEY = ['inventory', 'count-sessions'] as const;

export const getCountSessions = (status?: CountSessionStatus): Promise<CountSessionResponse[]> =>
  axios.get(COUNTS_ENDPOINT, {
    params: status ? { status } : undefined,
  });

export const getCountSession = (id: string): Promise<CountSessionResponse> =>
  axios.get(`${COUNTS_ENDPOINT}/${encodeURIComponent(id)}`);

export const createCountSession = (
  body: CreateCountSessionRequest,
): Promise<CountSessionResponse> => axios.post(COUNTS_ENDPOINT, body);

export const recordCount = (
  countId: string,
  lineId: string,
  body: RecordCountRequest,
): Promise<CountSessionResponse> =>
  axios.post(
    `${COUNTS_ENDPOINT}/${encodeURIComponent(countId)}/lines/${encodeURIComponent(lineId)}/record-count`,
    body,
  );

export const postCountSession = (id: string): Promise<CountSessionResponse> =>
  axios.post(`${COUNTS_ENDPOINT}/${encodeURIComponent(id)}/post`);

export const cancelCountSession = (id: string): Promise<CountSessionResponse> =>
  axios.post(`${COUNTS_ENDPOINT}/${encodeURIComponent(id)}/cancel`);

export const useCountSessions = (status?: CountSessionStatus) =>
  useQuery({
    queryKey: [...COUNTS_QUERY_KEY, status ?? 'all'],
    queryFn: () => getCountSessions(status),
  });

export const useCountSession = (id: string) =>
  useQuery({
    queryKey: [...COUNTS_QUERY_KEY, id],
    queryFn: () => getCountSession(id),
    enabled: Boolean(id),
  });

const invalidateCountSessionQueries = (queryClient: ReturnType<typeof useQueryClient>) =>
  queryClient.invalidateQueries({ queryKey: COUNTS_QUERY_KEY });

export const useCreateCountSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCountSession,
    onSuccess: () => invalidateCountSessionQueries(queryClient),
  });
};

export const useRecordCount = (countId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lineId, body }: { lineId: string; body: RecordCountRequest }) =>
      recordCount(countId, lineId, body),
    onSuccess: (session) => {
      queryClient.setQueryData([...COUNTS_QUERY_KEY, countId], session);
      void invalidateCountSessionQueries(queryClient);
    },
  });
};

export const usePostCountSession = (countId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => postCountSession(countId),
    onSuccess: (session) => {
      queryClient.setQueryData([...COUNTS_QUERY_KEY, countId], session);
      void invalidateCountSessionQueries(queryClient);
    },
  });
};

export const useCancelCountSession = (countId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cancelCountSession(countId),
    onSuccess: (session) => {
      queryClient.setQueryData([...COUNTS_QUERY_KEY, countId], session);
      void invalidateCountSessionQueries(queryClient);
    },
  });
};
