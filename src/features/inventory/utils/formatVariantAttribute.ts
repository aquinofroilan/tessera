export function formatVariantAttribute ( value: unknown ): string {
    if ( typeof value === 'string' ) return value
    if ( value === null ) return 'null'
    if ( value === undefined ) return 'undefined'
    if ( typeof value === 'function' || typeof value === 'symbol' || typeof value === 'bigint' ) return value.toString()

    try {
        return JSON.stringify( value ) ?? '[Unserializable value]'
    } catch {
        return '[Unserializable value]'
    }
}
