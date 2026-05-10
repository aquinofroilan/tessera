import { DashboardPreview } from "@/components/organisms/dashboard-preview";
import { EditorialPanel as EditorialPanelOrganism } from "@/components/organisms/editorial-panel";
import { customerQuote, dashKpis, floatingStats, trialIncludes } from "./signup-data";

export function EditorialPanel() {
    return (
        <EditorialPanelOrganism
            statusChip="Loom v4.2 · Shipped this week"
            kicker="A note from a customer"
            quote={{ body: customerQuote.body, emphasis: customerQuote.emphasis }}
            attribution={{
                initials: customerQuote.initials,
                name: customerQuote.name,
                role: customerQuote.role,
                gradient: customerQuote.gradient,
            }}
            floatingStats={floatingStats}
            dashboard={<DashboardPreview greeting="Good morning," name="Emma" kpis={dashKpis} />}
            list={{ label: "Every 30-day trial includes", items: trialIncludes }}
        />
    );
}
