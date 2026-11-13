export type InventorySearchParams = {
    search?: string
    categoryId?: string
    activeFilter?: 'true' | 'false'
}

export type ProductCatalogPageProps = Readonly<{
    searchParams: InventorySearchParams
    updateSearchParams: ( updates: InventorySearchParams ) => void
    clearSearchParams: () => void
}>
