export type CallerPermissionsResponse = {
    userId: string;
    organizationId: string | null;
    roles: string[];
    permissions: string[];
};
