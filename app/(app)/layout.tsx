import type { ReactNode } from "react";
import { AppSidebar } from "./_components/AppSidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen w-full">
            <AppSidebar />
            <div className="flex min-w-0 flex-1 flex-col">{children}</div>
        </div>
    );
}
