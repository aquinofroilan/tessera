import { DashboardPreview, defaultDashKpis } from "@/components/organisms/dashboard-preview";
import { EditorialPanel as EditorialPanelOrganism } from "@/components/organisms/editorial-panel";
import { changelogItems, customerQuote, floatingStats } from "./signin-data";

export function EditorialPanel() {
    return (
        <EditorialPanelOrganism
            className="hidden md:flex"
            statusChip="All systems operational"
            kicker="14 months on Tessera"
            quote={{ body: customerQuote.body, emphasis: customerQuote.emphasis }}
            attribution={{
                initials: customerQuote.initials,
                name: customerQuote.name,
                role: customerQuote.role,
                gradient: customerQuote.gradient,
            }}
            floatingStats={floatingStats}
            washes={{
                topRight: "radial-gradient(circle, rgb(62 106 140 / 24%) 0%, transparent 60%)",
                bottomLeft: "radial-gradient(circle, rgb(185 58 29 / 18%) 0%, transparent 60%)",
            }}
            dashboard={<DashboardPreview greeting="Welcome back," name="Marcus" kpis={defaultDashKpis} />}
            list={{ label: "Shipped in v4.2", items: changelogItems }}
        />
    );
}
