import "server-only";

import { apiCreate } from "@/lib/api/dal";
import type { InvoiceResponse } from "@/lib/api/finance/invoices";
import type { GenerateProjectInvoiceRequest } from "./billing";

export const generateProjectInvoice = (
    projectId: string,
    body: GenerateProjectInvoiceRequest,
): Promise<InvoiceResponse> =>
    apiCreate<InvoiceResponse>(`/projects/${projectId}/billing/invoice`, body);
