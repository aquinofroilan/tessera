import Axios from 'axios'

type ApiErrorBody = {
    message?: unknown
}

export function getApiErrorStatus ( error: unknown ): number | undefined {
    return Axios.isAxiosError( error ) ? error.response?.status : undefined
}

export function getApiErrorMessage (
    error: unknown,
    fallback: string,
    statusMessages: Partial<Record<number, string>> = {},
): string {
    const status = getApiErrorStatus( error )
    if ( status !== undefined && statusMessages[ status ] ) return statusMessages[ status ]

    if ( Axios.isAxiosError<ApiErrorBody>( error ) ) {
        const message = error.response?.data?.message
        if ( typeof message === 'string' && message.trim() ) return message
    }

    return fallback
}
