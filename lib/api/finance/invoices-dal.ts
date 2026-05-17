import "server-only";

import { serverClient } from "@/lib/http";
import { authed, authHeaders } from "@/lib/api/auth-helpers";
import type { InvoiceStatus, InvoiceSummaryResponse } from "./invoices";

const INVOICES_PATH = "/finance/ar/invoices";

type ListInvoicesParams = { status?: InvoiceStatus; customerId?: string };

export const listInvoices = async (params?: ListInvoicesParams): Promise<InvoiceSummaryResponse[]> =>
    authed(async () =>
        serverClient.get<InvoiceSummaryResponse[]>(INVOICES_PATH, {
            query: { status: params?.status, customerId: params?.customerId },
            headers: await authHeaders(),
            cache: "no-store",
        }),
    );
