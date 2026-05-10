import { AgingStrip as SharedAgingStrip } from "../../../_components/AgingStrip";
import type { ApAgingSummary } from "../_data/aging";

export function AgingStrip({ summary, currencyCode }: { summary: ApAgingSummary; currencyCode: string }) {
    return (
        <SharedAgingStrip
            summary={summary}
            currencyCode={currencyCode}
            ariaLabel="Accounts payable aging"
            totalLabel="Total owed"
            countNoun={{ one: "bill", other: "bills" }}
        />
    );
}
