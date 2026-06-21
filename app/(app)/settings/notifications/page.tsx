import type { Metadata } from "next";

import { listMyNotificationPreferences } from "@/lib/api/notification-preferences-dal";
import { AppTopbar } from "../../_components/AppTopbar";
import { Block } from "../../_components/Block";
import { PageHeader } from "../../_components/PageHeader";
import { PreferencesForm } from "./_components/PreferencesForm";

export const metadata: Metadata = {
    title: "Notification preferences · Tessera",
    description: "Choose which notifications reach you on which channel.",
};

const NotificationPreferencesPage = async () => {
    const preferences = await listMyNotificationPreferences();

    return (
        <>
            <AppTopbar
                crumbs={[{ label: "Settings" }, { label: "Notifications" }]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-300 p-9">
                    <PageHeader
                        eyebrow="Settings"
                        title={
                            <>
                                Notification preferences<em className="text-(--accent) italic">.</em>
                            </>
                        }
                        description="Pick what reaches you on which channel. Defaults to everything on; only your opt-outs are persisted."
                    />

                    <Block
                        title="Channels"
                        description={`${preferences.length} explicit deviation${preferences.length === 1 ? "" : "s"} saved.`}>
                        <PreferencesForm initialPreferences={preferences} />
                    </Block>
                </div>
            </div>
        </>
    );
};

export default NotificationPreferencesPage;
