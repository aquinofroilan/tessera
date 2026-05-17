import type { BillResponse } from "@/lib/api/finance/bills";
import { DocumentLinesTable } from "../../../../_components/DocumentLinesTable";

export function BillLinesTable({ bill }: { bill: BillResponse }) {
    return (
        <DocumentLinesTable
            lines={bill.lines}
            totalAmount={bill.totalAmount}
            taxAmount={bill.taxAmount}
            currencyCode={bill.currencyCode}
        />
    );
}
