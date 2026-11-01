import { createRoute, lazyRouteComponent } from '@tanstack/react-router'
import { rootRoute } from '@/src/routes'

export const signupRoute = createRoute( {
    getParentRoute: () => rootRoute,
    path: '/auth/signup',
    component: lazyRouteComponent( () => import( '../pages/SignupPage' ), 'SignupPage' ),
} )
