export type StockMovementType =
    | 'RECEIPT'
    | 'ISSUE'
    | 'TRANSFER'
    | 'ADJUSTMENT'
    | 'OPENING_BALANCE'
    | 'WIP_ISSUE'
    | 'WIP_RECEIPT'

export const stockMovementTypes: readonly StockMovementType[] = [
    'RECEIPT',
    'ISSUE',
    'TRANSFER',
    'ADJUSTMENT',
    'OPENING_BALANCE',
    'WIP_ISSUE',
    'WIP_RECEIPT',
]

export type CreateStockMovementRequest = {
    productId: string
    warehouseId: string
    quantity: number
    type: StockMovementType
    transferToWarehouseId?: string
    sourceLocationId?: string
    destinationLocationId?: string
    lotNumber?: string
    serialNumbers?: string[]
    unitCost?: number
    reference?: string
    notes?: string
    occurredAt?: string
    expiryDate?: string
}

export type StockMovementResponse = Readonly<{
    id: string
    organizationId: string
    productId: string
    productName?: string | null
    productSku?: string | null
    warehouseId: string
    warehouseName?: string | null
    transferToWarehouseId?: string | null
    transferToWarehouseName?: string | null
    sourceLocationId?: string | null
    destinationLocationId?: string | null
    lotNumber?: string | null
    serialNumbers?: string[] | null
    type: StockMovementType
    quantity: number
    unitCost?: number | null
    reference?: string | null
    notes?: string | null
    occurredAt?: string | null
    expiryDate?: string | null
    createdBy?: string | null
    createdAt?: string | null
    reversalOfMovementId?: string | null
}>

export type StockMovementListParams = {
    productId?: string
    warehouseId?: string
    type?: StockMovementType
    from?: string
    to?: string
    lotNumber?: string
}

export type StockOnHandResponse = Readonly<{
    productId: string
    warehouseId: string
    lotNumber?: string | null
    quantity: number
}>

export type StockLotBalance = Readonly<{
    lotNumber: string
    quantity: number
    expiryDate?: string | null
}>

export type PickingSuggestion = Readonly<Record<string, unknown>>
