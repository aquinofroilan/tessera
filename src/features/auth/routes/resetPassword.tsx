import { createRoute, lazyRouteComponent } from '@tanstack/react-router'
import { rootRoute } from '@/src/routes'
import { z } from 'zod'

const resetPasswordSearchSchema = z.object( {
    token: z.string().optional(),
} )

export const resetPasswordRoute = createRoute( {
    getParentRoute: () => rootRoute,
    path: '/reset-password',
    validateSearch: resetPasswordSearchSchema,
    component: lazyRouteComponent( () => import( '../pages/ResetPasswordPage' ), 'ResetPasswordPage' ),
} )
