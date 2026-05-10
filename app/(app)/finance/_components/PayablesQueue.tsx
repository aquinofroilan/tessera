import { billQueue } from "../_data/mock";
import { DocumentQueue, type DocumentQueueRow } from "./DocumentQueue";

const headers = { number: "Bill", party: "Vendor" };

export function PayablesQueue() {
    const rows: DocumentQueueRow[] = billQueue.map((row) => ({
        id: row.id,
        number: row.billNumber,
        party: row.vendorName,
        dueDate: row.dueDate,
        daysOverdue: row.daysOverdue,
        outstanding: (Number(row.totalAmount) - Number(row.amountPaid)).toFixed(2),
        currencyCode: row.currencyCode,
        status: row.status,
        href: `/finance/ap/bills/${row.id}`,
    }));
    return <DocumentQueue rows={rows} headers={headers} />;
}
