import type { BillResponse } from "@/lib/api/finance/bills";
import { DocumentSummaryCard } from "../../../../_components/DocumentSummaryCard";
import { calculateOutstanding } from "../../../../_data/format";

export function BillSummaryCard({ bill }: { bill: BillResponse }) {
    const outstanding = calculateOutstanding(bill.totalAmount, bill.amountPaid);
    return (
        <DocumentSummaryCard
            summary={{
                partyLabel: "Vendor",
                partyName: bill.vendorName,
                partyHref: `/finance/ap/vendors/${bill.vendorId}`,
                referenceNumber: bill.referenceNumber,
                date: bill.date,
                dueDate: bill.dueDate,
                totalAmount: bill.totalAmount,
                taxAmount: bill.taxAmount,
                settledLabel: "Paid",
                settledAmount: bill.amountPaid,
                outstanding,
                currencyCode: bill.currencyCode,
                createdBy: bill.createdBy,
                approvedAt: bill.approvedAt,
                approvedBy: bill.approvedBy,
                settledOn: { label: "Paid on", value: bill.paidAt },
                voidedAt: bill.voidedAt,
                voidedBy: bill.voidedBy,
                voidReason: bill.voidReason,
            }}
        />
    );
}
