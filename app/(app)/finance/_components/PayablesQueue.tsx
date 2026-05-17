import { dashboardPayables } from "../_data/mock";
import { DocumentQueue } from "./DocumentQueue";

export function PayablesQueue() {
    return <DocumentQueue rows={dashboardPayables} headers={{ number: "Bill", party: "Vendor" }} />;
}
