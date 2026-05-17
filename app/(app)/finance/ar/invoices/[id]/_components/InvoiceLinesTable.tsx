import type { InvoiceResponse } from "@/lib/api/finance/invoices";
import { DocumentLinesTable } from "../../../../_components/DocumentLinesTable";

export function InvoiceLinesTable({ invoice }: { invoice: InvoiceResponse }) {
    return (
        <DocumentLinesTable
            lines={invoice.lines}
            totalAmount={invoice.totalAmount}
            taxAmount={invoice.taxAmount}
            currencyCode={invoice.currencyCode}
        />
    );
}
