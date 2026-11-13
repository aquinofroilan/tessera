import Axios from 'axios'
import { toast } from 'sonner'

type ApiProblemDetails = {
    type?: string
    title?: string
    status?: number
    detail?: string
    instance?: string
    code?: string
    traceId?: string
    message?: string
    error?: string
}

type ApiErrorToastOptions = {
    id?: string
    action?: { label: string, onClick: () => void }
}

const handledApiErrorToasts = new WeakSet<object>()

export function markApiErrorToastHandled ( error: unknown ) {
    if ( error && typeof error === 'object' ) handledApiErrorToasts.add( error )
}

function getString ( value: unknown ): string | undefined {
    return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

function getApiProblemDetails ( error: unknown ): ApiProblemDetails | undefined {
    if ( !Axios.isAxiosError( error ) ) return undefined

    const body: unknown = error.response?.data
    if ( !body || typeof body !== 'object' ) return undefined

    const record = body as Record<string, unknown>
    return {
        type: getString( record.type ),
        title: getString( record.title ),
        status: typeof record.status === 'number' ? record.status : error.response?.status,
        detail: getString( record.detail ),
        instance: getString( record.instance ),
        code: getString( record.code ),
        traceId: getString( record.traceId ),
        message: getString( record.message ),
        error: getString( record.error ),
    }
}

export function getApiErrorStatus ( error: unknown ): number | undefined {
    if ( !Axios.isAxiosError( error ) ) return undefined
    return getApiProblemDetails( error )?.status ?? error.response?.status
}

export function getApiErrorMessage (
    error: unknown,
    fallback: string,
    statusMessages: Partial<Record<number, string>> = {},
): string {
    const status = getApiErrorStatus( error )
    if ( status !== undefined && statusMessages[ status ] ) return statusMessages[ status ]

    const details = getApiProblemDetails( error )
    if ( details?.detail ) return details.detail
    if ( details?.message ) return details.message
    if ( details?.error ) return details.error
    if ( details?.title ) return details.title

    return fallback
}

export function toastApiError (
    error: unknown,
    fallback: string,
    statusMessages: Partial<Record<number, string>> = {},
    options: ApiErrorToastOptions = {},
) {
    if ( error && typeof error === 'object' && handledApiErrorToasts.has( error ) ) return

    const details = getApiProblemDetails( error )
    const description = getApiErrorMessage( error, fallback, statusMessages )
    const message = `Error: ${ description.charAt( 0 ).toUpperCase() }${ description.slice( 1 ) }`
    const diagnostic = [ details?.code, details?.traceId ? `Trace ID: ${ details.traceId }` : undefined ].filter( Boolean ).join( ' · ' )

    toast.error( diagnostic ? `${ message } (${ diagnostic })` : message, {
        ...options,
    } )
}
