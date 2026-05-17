"use server";

import { runCreateAction } from "@/lib/api/create-action";
import type { CreateBillRequest } from "@/lib/api/finance/bills";
import { createBill } from "@/lib/api/finance/bills-dal";
import { newBillSchema, type NewBillValues } from "./new-bill-schema";

export const createBillAction = async (values: NewBillValues) =>
    runCreateAction<NewBillValues, CreateBillRequest>({
        values,
        schema: newBillSchema,
        path: "/finance/ap/bills",
        errorMessage: "Couldn't create the bill. Try again.",
        create: createBill,
        toBody: (v) => ({
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
        }),
    });
