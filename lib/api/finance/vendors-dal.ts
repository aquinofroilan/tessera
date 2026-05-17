import "server-only";

import { cache } from "react";

import { apiCreate, apiGetOrNull, apiList } from "@/lib/api/dal";
import type { CreateVendorRequest, VendorResponse } from "./vendors";

const VENDORS_PATH = "/finance/ap/vendors";

export const listVendors = (): Promise<VendorResponse[]> => apiList<VendorResponse>(VENDORS_PATH);

export const createVendor = (body: CreateVendorRequest): Promise<VendorResponse> =>
    apiCreate<VendorResponse>(VENDORS_PATH, body);

export const getVendor = cache(
    (id: string): Promise<VendorResponse | null> => apiGetOrNull<VendorResponse>(`${VENDORS_PATH}/${id}`),
);
