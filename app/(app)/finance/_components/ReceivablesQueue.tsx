import { invoiceQueue } from "../_data/mock";
import { DocumentQueue, type DocumentQueueRow } from "./DocumentQueue";

const headers = { number: "Invoice", party: "Customer" };

export function ReceivablesQueue() {
    const rows: DocumentQueueRow[] = invoiceQueue.map((row) => ({
        id: row.id,
        number: row.invoiceNumber,
        party: row.customerName,
        dueDate: row.dueDate,
        daysOverdue: row.daysOverdue,
        outstanding: (Number(row.totalAmount) - Number(row.amountReceived)).toFixed(2),
        currencyCode: row.currencyCode,
        status: row.status,
        href: `/finance/ar/invoices/${row.id}`,
    }));
    return <DocumentQueue rows={rows} headers={headers} />;
}
