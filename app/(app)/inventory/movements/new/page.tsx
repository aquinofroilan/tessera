import type { Metadata } from "next";

import { AppTopbar } from "../../../_components/AppTopbar";
import { PageHeader } from "../../../_components/PageHeader";
import { listItems } from "@/lib/api/inventory/items-dal";
import { listWarehouses } from "@/lib/api/inventory/warehouses-dal";
import type { MovementType } from "@/lib/api/inventory/movements";
import { MovementForm } from "./_components/MovementForm";
import { MovementTypePicker } from "./_components/MovementTypePicker";

export const metadata: Metadata = {
    title: "New movement · Tessera",
};

type Props = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const parseType = (sp: Record<string, string | string[] | undefined>): MovementType => {
    const raw = Array.isArray(sp.type) ? sp.type[0] : sp.type;
    if (
        raw === "RECEIPT" ||
        raw === "ISSUE" ||
        raw === "TRANSFER" ||
        raw === "ADJUSTMENT_IN" ||
        raw === "ADJUSTMENT_OUT"
    ) {
        return raw;
    }
    return "RECEIPT";
};

const NewMovementPage = async ({ searchParams }: Props) => {
    const sp = await searchParams;
    const type = parseType(sp);
    const billId = Array.isArray(sp.sourceBillId) ? sp.sourceBillId[0] : sp.sourceBillId;
    const invoiceId = Array.isArray(sp.sourceInvoiceId) ? sp.sourceInvoiceId[0] : sp.sourceInvoiceId;

    const [items, warehouses] = await Promise.all([
        listItems({ status: "ACTIVE", kind: "STOCK" }),
        listWarehouses(),
    ]);

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "Inventory", href: "/inventory" },
                    { label: "Movements", href: "/inventory/movements" },
                    { label: "New" },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="Inventory · Movements · New"
                        title="New movement"
                        description="Pick a type and post the line. Movements are immutable — corrections post as opposite-direction entries."
                    />
                    <MovementTypePicker active={type} />
                    <MovementForm
                        key={type}
                        type={type}
                        items={items.map((i) => ({ id: i.id, sku: i.sku, name: i.name }))}
                        warehouses={warehouses.map((w) => ({ id: w.id, code: w.code, name: w.name }))}
                        source={billId || invoiceId ? { billId, invoiceId } : undefined}
                    />
                </div>
            </div>
        </>
    );
};

export default NewMovementPage;
