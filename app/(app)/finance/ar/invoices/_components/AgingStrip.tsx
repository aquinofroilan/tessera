import { AgingStrip as SharedAgingStrip } from "../../../_components/AgingStrip";
import type { AgingSummary } from "../_data/aging";

export function AgingStrip({ summary, currencyCode }: { summary: AgingSummary; currencyCode: string }) {
    return (
        <SharedAgingStrip
            summary={summary}
            currencyCode={currencyCode}
            ariaLabel="Accounts receivable aging"
            totalLabel="Total open"
            countNoun={{ one: "invoice", other: "invoices" }}
        />
    );
}
