import type { ProductResponse } from '@/src/features/inventory/types/products'

export function formatPrice ( product: ProductResponse ) {
    const amount = Number( product.listPrice )
    const currency = product.priceCurrency?.trim()

    if ( !currency ) return amount.toLocaleString( undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 } )

    try {
        return new Intl.NumberFormat( undefined, { style: 'currency', currency } ).format( amount )
    } catch {
        return `${ currency } ${ amount.toLocaleString( undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 } ) }`
    }
}
