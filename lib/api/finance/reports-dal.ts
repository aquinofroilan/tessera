import "server-only";

import { serverClient } from "@/lib/http";
import { authed, authHeaders } from "@/lib/api/auth-helpers";
import type { BalanceSheetResponse, IncomeStatementResponse } from "./reports";

const REPORTS_PATH = "/finance/reports";

type IncomeStatementParams = {
    startDate: string;
    endDate: string;
    compareStartDate?: string;
    compareEndDate?: string;
};

type BalanceSheetParams = {
    asOfDate: string;
    compareAsOfDate?: string;
};

export const getIncomeStatement = async (params: IncomeStatementParams): Promise<IncomeStatementResponse> =>
    authed(async () =>
        serverClient.get<IncomeStatementResponse>(`${REPORTS_PATH}/income-statement`, {
            query: {
                startDate: params.startDate,
                endDate: params.endDate,
                compareStartDate: params.compareStartDate,
                compareEndDate: params.compareEndDate,
            },
            headers: await authHeaders(),
            cache: "no-store",
        }),
    );

export const getBalanceSheet = async (params: BalanceSheetParams): Promise<BalanceSheetResponse> =>
    authed(async () =>
        serverClient.get<BalanceSheetResponse>(`${REPORTS_PATH}/balance-sheet`, {
            query: { asOfDate: params.asOfDate, compareAsOfDate: params.compareAsOfDate },
            headers: await authHeaders(),
            cache: "no-store",
        }),
    );
