import "server-only";

import { apiList } from "@/lib/api/dal";
import type { InvoiceStatus, InvoiceSummaryResponse } from "./invoices";

const INVOICES_PATH = "/finance/ar/invoices";

type ListInvoicesParams = { status?: InvoiceStatus; customerId?: string };

export const listInvoices = (params?: ListInvoicesParams): Promise<InvoiceSummaryResponse[]> =>
    apiList<InvoiceSummaryResponse>(INVOICES_PATH, { status: params?.status, customerId: params?.customerId });
