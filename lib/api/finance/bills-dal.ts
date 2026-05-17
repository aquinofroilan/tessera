import "server-only";

import { cache } from "react";

import { apiCreate, apiGetOrNull, apiList } from "@/lib/api/dal";
import type {
    BillPaymentResponse,
    BillResponse,
    BillStatus,
    BillSummaryResponse,
    CreateBillRequest,
} from "./bills";

const BILLS_PATH = "/finance/ap/bills";

type ListBillsParams = { status?: BillStatus; vendorId?: string };

export const listBills = (params?: ListBillsParams): Promise<BillSummaryResponse[]> =>
    apiList<BillSummaryResponse>(BILLS_PATH, { status: params?.status, vendorId: params?.vendorId });

export const getBill = cache(
    (id: string): Promise<BillResponse | null> => apiGetOrNull<BillResponse>(`${BILLS_PATH}/${id}`),
);

export const getBillPayments = (id: string): Promise<BillPaymentResponse[]> =>
    apiList<BillPaymentResponse>(`${BILLS_PATH}/${id}/payments`);

export const createBill = (body: CreateBillRequest): Promise<BillResponse> =>
    apiCreate<BillResponse>(BILLS_PATH, body);
