export type InventorySearchParams = {
    search?: string
    categoryId?: string
    activeFilter?: 'true' | 'false'
}

export type InventoryPageProps = {
    searchParams: InventorySearchParams
    updateSearchParams: ( updates: InventorySearchParams ) => void
    clearSearchParams: () => void
}
