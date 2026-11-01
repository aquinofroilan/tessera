import { createRoute, lazyRouteComponent } from '@tanstack/react-router'
import { rootRoute } from '@/src/routes'
import { z } from 'zod'

const magicLinkSearchSchema = z.object( {
    token: z.string().optional(),
} )

export const magicLinkRoute = createRoute( {
    getParentRoute: () => rootRoute,
    path: '/magic-link',
    validateSearch: magicLinkSearchSchema,
    component: lazyRouteComponent( () => import( '../pages/MagicLinkPage' ), 'MagicLinkPage' ),
} )
