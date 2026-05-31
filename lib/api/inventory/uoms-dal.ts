import "server-only";

import { apiCreate, apiList } from "@/lib/api/dal";
import type { CreateUomRequest, UomResponse } from "./uoms";

const UOMS_PATH = "/inventory/uoms";

export const listUoms = (): Promise<UomResponse[]> => apiList<UomResponse>(UOMS_PATH);

export const createUom = (body: CreateUomRequest): Promise<UomResponse> =>
    apiCreate<UomResponse>(UOMS_PATH, body);
