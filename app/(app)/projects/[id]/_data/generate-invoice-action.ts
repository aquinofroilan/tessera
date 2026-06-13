"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { HttpError } from "@/lib/http";
import { generateProjectInvoice } from "@/lib/api/projects/billing-dal";

type Result = { ok: false; error: string };

const friendly = (raw: string): string => {
    if (raw.includes("no customer")) return "This project has no customer assigned. Add one from Edit project before billing.";
    if (raw.includes("revenue account"))
        return "No revenue account is set. Set a default on the customer, or pick one when generating.";
    if (raw.includes("No billable time"))
        return "Nothing to bill yet — only APPROVED billable entries with a rate, not already invoiced, qualify.";
    return raw;
};

export const generateProjectInvoiceAction = async (
    projectId: string,
    revenueAccountId: string | null,
): Promise<Result | void> => {
    let invoiceId: string;
    try {
        const invoice = await generateProjectInvoice(projectId, {
            revenueAccountId: revenueAccountId?.trim() || null,
        });
        invoiceId = invoice.id;
    } catch (error) {
        if (error instanceof HttpError && error.status === 400) {
            const body = error.body as { error?: string } | undefined;
            const raw = typeof body?.error === "string" ? body.error : "Couldn't generate the invoice.";
            return { ok: false, error: friendly(raw) };
        }
        return { ok: false, error: "Couldn't generate the invoice. Try again." };
    }

    revalidatePath(`/projects/${projectId}`);
    revalidatePath("/projects/time");
    revalidatePath("/finance/ar/invoices");
    redirect(`/finance/ar/invoices/${invoiceId}`);
};
