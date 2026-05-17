"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import type { CreateBillRequest } from "@/lib/api/finance/bills";
import { createBill } from "@/lib/api/finance/bills-dal";
import { newBillSchema, type NewBillValues } from "./new-bill-schema";

export type CreateBillResult = { ok: false; error: string };

export const createBillAction = async (values: NewBillValues): Promise<CreateBillResult | void> => {
    const parsed = newBillSchema.safeParse(values);
    if (!parsed.success) {
        return { ok: false, error: "Please check the form and try again." };
    }

    const v = parsed.data;
    const body: CreateBillRequest = {
        vendorId: v.vendorId,
        date: v.date,
        dueDate: v.dueDate,
        referenceNumber: v.referenceNumber?.trim() || null,
        currencyCode: v.currencyCode || null,
        lines: v.lines.map((line) => ({
            accountId: line.accountId,
            amount: line.amount,
            description: line.description?.trim() || null,
        })),
    };

    try {
        await createBill(body);
    } catch {
        return { ok: false, error: "Couldn't create the bill. Try again." };
    }

    revalidatePath("/finance/ap/bills");
    redirect("/finance/ap/bills");
};
