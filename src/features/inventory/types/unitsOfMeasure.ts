export type UnitOfMeasureResponse = {
    id: string
    code: string
    name: string
    description: string | null
    baseUomId: string | null
    conversionFactor: number
    isActive: boolean
}

export type CreateUnitOfMeasureRequest = {
    code: string
    name: string
    description?: string
    baseUomId?: string | null
    conversionFactor?: number
}

export type UpdateUnitOfMeasureRequest = {
    name?: string
    description?: string | null
    baseUomId?: string | null
    conversionFactor?: number
    isActive?: boolean
}

export type UnitConversionRequest = {
    quantity: number
    fromUomId: string
    toUomId: string
}

export type UnitConversionResponse = {
    converted: number
    fromUomId: string
    toUomId: string
}
