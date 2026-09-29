import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../../../routes';
import { AuthLayout, InvitationAcceptForm } from '../components';
import { z } from 'zod';

const invitationSearchSchema = z.object({
    token: z.string().optional(),
});

export const invitationRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/join',
    validateSearch: invitationSearchSchema,
    component: () => {
        const { token } = invitationRoute.useSearch();
        
        if (!token) {
            return (
                <AuthLayout title="Invalid Link" description="The invitation link is invalid or missing a token.">
                    <div className="text-center mt-4">
                        <p className="text-sm text-muted-foreground">Please contact your administrator to request a new invitation.</p>
                    </div>
                </AuthLayout>
            );
        }

        return (
            <AuthLayout 
                title="Join Organization" 
                description="You've been invited to join an organization on Tessera."
            >
                <InvitationAcceptForm token={token} />
            </AuthLayout>
        );
    },
});
