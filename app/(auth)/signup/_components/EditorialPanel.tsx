import { DashboardPreview, defaultDashKpis } from "@/components/organisms/dashboard-preview";
import { EditorialPanel as EditorialPanelOrganism } from "@/components/organisms/editorial-panel";
import { customerQuote, floatingStats, trialIncludes } from "./signup-data";

export function EditorialPanel() {
    return (
        <EditorialPanelOrganism
            className="hidden md:flex"
            statusChip="Tessera v4.2 · Shipped this week"
            kicker="A note from a customer"
            quote={{ body: customerQuote.body, emphasis: customerQuote.emphasis }}
            attribution={{
                initials: customerQuote.initials,
                name: customerQuote.name,
                role: customerQuote.role,
                gradient: customerQuote.gradient,
            }}
            floatingStats={floatingStats}
            dashboard={<DashboardPreview greeting="Good morning," name="Emma" kpis={defaultDashKpis} />}
            list={{ label: "Every 30-day trial includes", items: trialIncludes }}
        />
    );
}
