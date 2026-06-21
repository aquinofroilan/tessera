import { redirect } from "next/navigation";

const ProcurementPage = () => {
    redirect("/procurement/purchase-requests");
};

export default ProcurementPage;
