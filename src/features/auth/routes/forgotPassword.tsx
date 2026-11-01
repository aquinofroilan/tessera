import { createRoute, lazyRouteComponent } from '@tanstack/react-router'
import { rootRoute } from '@/src/routes'

export const forgotPasswordRoute = createRoute( {
    getParentRoute: () => rootRoute,
    path: '/auth/forgot-password',
    component: lazyRouteComponent( () => import( '../pages/ForgotPasswordPage' ), 'ForgotPasswordPage' ),
} )
