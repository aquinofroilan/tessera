export function formatVariantAttribute ( value: unknown ): string {
    if ( typeof value === 'string' ) return value
    if ( value === null ) return 'null'

    try {
        return JSON.stringify( value ) ?? String( value )
    } catch {
        return String( value )
    }
}
