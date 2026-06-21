import "server-only";

import { notFound } from "next/navigation";

import { getMyPermissions } from "@/lib/api/me-dal";

export const hasPermission = async (permission: string): Promise<boolean> => {
    const me = await getMyPermissions();
    return me?.permissions.includes(permission) ?? false;
};

export const requirePermission = async (permission: string): Promise<void> => {
    if (!(await hasPermission(permission))) notFound();
};
