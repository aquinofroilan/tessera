import { useEffect, useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { useConsumeMagicLink } from "@/src/features/auth/api/magicLink"
import { Button } from "@/components/ui/button"
import { toastApiError } from "@/src/lib/api-error"

type MagicLinkConsumeProps = Readonly<{
    token: string
}>

export const MagicLinkConsume = ( { token }: MagicLinkConsumeProps ) =>
{
    const navigate = useNavigate()
    const consumeMutation = useConsumeMagicLink()
    const [hasFailed, setHasFailed] = useState( false )

    useEffect( () =>
    {
        // Automatically consume token on mount
        consumeMutation.mutate(
            { token },
            {
                onSuccess: () =>
                {
                    navigate( { to: "/dashboard" } )
                },
                onError: ( error: any ) =>
                {
                    toastApiError( error, "This magic link is invalid or has expired." )
                    setHasFailed( true )
                }
            }
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token] )

    if ( hasFailed )
    {
        return (
            <div className="text-center space-y-4">
                <Button variant="outline" onClick={ () => navigate( { to: "/magic-link" } ) }>
                    Request a new link
                </Button>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-muted-foreground text-sm">Authenticating your magic link...</p>
        </div>
    )
}
