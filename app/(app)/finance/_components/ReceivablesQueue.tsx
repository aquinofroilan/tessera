import { dashboardReceivables } from "../_data/mock";
import { DocumentQueue } from "./DocumentQueue";

export function ReceivablesQueue() {
    return <DocumentQueue rows={dashboardReceivables} headers={{ number: "Invoice", party: "Customer" }} />;
}
