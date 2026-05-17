import "server-only";

import { cache } from "react";

import { apiCreate, apiGetOrNull, apiList } from "@/lib/api/dal";
import type { CreateCustomerRequest, CustomerResponse } from "./customers";

const CUSTOMERS_PATH = "/finance/ar/customers";

export const listCustomers = (): Promise<CustomerResponse[]> => apiList<CustomerResponse>(CUSTOMERS_PATH);

export const createCustomer = (body: CreateCustomerRequest): Promise<CustomerResponse> =>
    apiCreate<CustomerResponse>(CUSTOMERS_PATH, body);

export const getCustomer = cache(
    (id: string): Promise<CustomerResponse | null> => apiGetOrNull<CustomerResponse>(`${CUSTOMERS_PATH}/${id}`),
);
