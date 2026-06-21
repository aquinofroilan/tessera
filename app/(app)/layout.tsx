import type { ReactNode } from "react";

import { getMyPermissions } from "@/lib/api/me-dal";
import { AppSidebar } from "./_components/AppSidebar";

export default async function AppLayout({ children }: { children: ReactNode }) {
    const me = await getMyPermissions();
    return (
        <div className="flex h-screen w-full overflow-hidden">
            <AppSidebar permissions={me?.permissions ?? []} />
            <div className="flex min-w-0 flex-1 flex-col">{children}</div>
        </div>
    );
}
