export type WarehouseResponse = {
    id: string
    code: string
    name: string
    description: string | null
    addressLine: string | null
    city: string | null
    country: string | null
    allowNegativeStock: boolean
    organizationId: string
    isActive: boolean
    createdAt: string
    updatedAt: string | null
}

export type CreateWarehouseRequest = {
    code: string
    name: string
    description?: string
    addressLine?: string
    city?: string
    country?: string
    allowNegativeStock?: boolean
}

export type UpdateWarehouseRequest = {
    name?: string
    description?: string | null
    addressLine?: string | null
    city?: string | null
    country?: string | null
    allowNegativeStock?: boolean
}

export type WarehouseLocationType = 'ZONE' | 'AISLE' | 'RACK' | 'SHELF' | 'BIN'

export type WarehouseLocationResponse = {
    id: string
    warehouseId: string
    parentLocationId: string | null
    code: string
    type: WarehouseLocationType
    barcode: string | null
}

export type CreateWarehouseLocationRequest = {
    warehouseId: string
    parentLocationId?: string | null
    code: string
    type: WarehouseLocationType
    barcode?: string
}

export type WarehouseListParams = {
    isActive?: boolean
    search?: string
}

export type WarehouseSearchParams = {
    search?: string
    activeFilter?: 'true' | 'false'
}

export type WarehouseListPageProps = Readonly<{
    searchParams: WarehouseSearchParams
    updateSearchParams: ( updates: WarehouseSearchParams ) => void
    clearSearchParams: () => void
}>
