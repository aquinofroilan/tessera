import { createRoute, lazyRouteComponent } from '@tanstack/react-router'
import { rootRoute } from '@/src/routes'

export const loginRoute = createRoute( {
    getParentRoute: () => rootRoute,
    path: '/auth/signin',
    component: lazyRouteComponent( () => import( '../pages/LoginPage' ), 'LoginPage' ),
} )
