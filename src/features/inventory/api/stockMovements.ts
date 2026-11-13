import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { axios } from '@/src/lib/axios'
import type {
    CreateStockMovementRequest,
    PickingSuggestion,
    StockLotBalance,
    StockMovementListParams,
    StockMovementResponse,
    StockOnHandResponse,
} from '@/src/features/inventory/types/stockMovements'

const MOVEMENTS_ENDPOINT = '/api/v1/inventory/movements'
const STOCK_ON_HAND_ENDPOINT = '/api/v1/inventory/stock-on-hand'
const STOCK_LOTS_ENDPOINT = '/api/v1/inventory/stock-on-hand/lots'
const MOVEMENTS_KEY = [ 'inventory', 'stock-movements' ] as const
const STOCK_KEY = [ 'inventory', 'stock-on-hand' ] as const
const LOT_BALANCES_KEY = [ 'inventory', 'stock-lots' ] as const
const GENEALOGY_KEY = [ 'inventory', 'lot-genealogy' ] as const
const PICKING_SUGGESTIONS_KEY = [ 'inventory', 'picking-suggestions' ] as const

export const getStockMovements = ( params: StockMovementListParams = {} ): Promise<StockMovementResponse[]> =>
    axios.get( MOVEMENTS_ENDPOINT, { params: { ...params, lotNumber: params.lotNumber?.trim() || undefined } } )

export const createStockMovement = ( body: CreateStockMovementRequest ): Promise<StockMovementResponse> =>
    axios.post( MOVEMENTS_ENDPOINT, body )

export const reverseStockMovement = ( id: string ): Promise<StockMovementResponse> =>
    axios.post( `${ MOVEMENTS_ENDPOINT }/${ encodeURIComponent( id ) }/reverse` )

export const getStockOnHand = ( productId: string, warehouseId: string, lotNumber?: string ): Promise<StockOnHandResponse> =>
    axios.get( STOCK_ON_HAND_ENDPOINT, { params: { productId, warehouseId, lotNumber: lotNumber?.trim() || undefined } } )

export const getStockLotBalances = ( productId: string, warehouseId: string ): Promise<StockLotBalance[]> =>
    axios.get( STOCK_LOTS_ENDPOINT, { params: { productId, warehouseId } } )

export const getLotGenealogy = ( lotNumber: string ): Promise<StockMovementResponse[]> =>
    axios.get( `/api/v1/inventory/lots/${ encodeURIComponent( lotNumber ) }/genealogy` )

export const getPickingSuggestions = ( productId: string, warehouseId: string, quantity: number ): Promise<PickingSuggestion[]> =>
    axios.get( '/api/v1/inventory/picking-suggestions', { params: { productId, warehouseId, quantity } } )

export const useStockMovements = ( params: StockMovementListParams = {} ) => useQuery( {
    queryKey: [ ...MOVEMENTS_KEY, params ],
    queryFn: () => getStockMovements( params ),
    retry: false,
} )

export const useCreateStockMovement = () => {
    const queryClient = useQueryClient()

    return useMutation( {
        mutationFn: createStockMovement,
        onSuccess: () => {
            void queryClient.invalidateQueries( { queryKey: MOVEMENTS_KEY } )
            void queryClient.invalidateQueries( { queryKey: STOCK_KEY } )
            void queryClient.invalidateQueries( { queryKey: LOT_BALANCES_KEY } )
            void queryClient.invalidateQueries( { queryKey: GENEALOGY_KEY } )
            void queryClient.invalidateQueries( { queryKey: PICKING_SUGGESTIONS_KEY } )
        },
    } )
}

export const useReverseStockMovement = () => {
    const queryClient = useQueryClient()

    return useMutation( {
        mutationFn: reverseStockMovement,
        onSuccess: () => {
            void queryClient.invalidateQueries( { queryKey: MOVEMENTS_KEY } )
            void queryClient.invalidateQueries( { queryKey: STOCK_KEY } )
            void queryClient.invalidateQueries( { queryKey: LOT_BALANCES_KEY } )
            void queryClient.invalidateQueries( { queryKey: GENEALOGY_KEY } )
            void queryClient.invalidateQueries( { queryKey: PICKING_SUGGESTIONS_KEY } )
        },
    } )
}

export const useStockOnHand = ( productId: string, warehouseId: string, lotNumber?: string ) => useQuery( {
    queryKey: [ ...STOCK_KEY, { productId, warehouseId, lotNumber } ],
    queryFn: () => getStockOnHand( productId, warehouseId, lotNumber ),
    enabled: Boolean( productId && warehouseId ),
    retry: false,
} )

export const useStockLotBalances = ( productId: string, warehouseId: string ) => useQuery( {
    queryKey: [ ...LOT_BALANCES_KEY, productId, warehouseId ],
    queryFn: () => getStockLotBalances( productId, warehouseId ),
    enabled: Boolean( productId && warehouseId ),
    retry: false,
} )

export const useLotGenealogy = ( lotNumber: string ) => useQuery( {
    queryKey: [ ...GENEALOGY_KEY, lotNumber ],
    queryFn: () => getLotGenealogy( lotNumber ),
    enabled: Boolean( lotNumber.trim() ),
    retry: false,
} )

export const usePickingSuggestions = ( productId: string, warehouseId: string, quantity: number, enabled: boolean ) => useQuery( {
    queryKey: [ ...PICKING_SUGGESTIONS_KEY, { productId, warehouseId, quantity } ],
    queryFn: () => getPickingSuggestions( productId, warehouseId, quantity ),
    enabled: enabled && Boolean( productId && warehouseId ) && Number.isFinite( quantity ),
    retry: false,
} )
