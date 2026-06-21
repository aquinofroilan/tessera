import type { IsoDate } from "../types";

export type GenerateProjectInvoiceRequest = {
    revenueAccountId?: string | null;
    date?: IsoDate | null;
    dueDate?: IsoDate | null;
    currencyCode?: string | null;
};
