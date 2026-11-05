import { createRoute, lazyRouteComponent } from '@tanstack/react-router'
import { rootRoute } from '@/src/routes'
import { z } from 'zod'

const invitationSearchSchema = z.object( {
    token: z.string().optional(),
} )

export const invitationRoute = createRoute( {
    getParentRoute: () => rootRoute,
    path: '/join',
    validateSearch: invitationSearchSchema,
    component: lazyRouteComponent( () => import( '../pages/InvitationPage' ), 'InvitationPage' ),
} )
