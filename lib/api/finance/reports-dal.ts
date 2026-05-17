import "server-only";

import { apiGet } from "@/lib/api/dal";
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

export const getIncomeStatement = (params: IncomeStatementParams): Promise<IncomeStatementResponse> =>
    apiGet<IncomeStatementResponse>(`${REPORTS_PATH}/income-statement`, {
        startDate: params.startDate,
        endDate: params.endDate,
        compareStartDate: params.compareStartDate,
        compareEndDate: params.compareEndDate,
    });

export const getBalanceSheet = (params: BalanceSheetParams): Promise<BalanceSheetResponse> =>
    apiGet<BalanceSheetResponse>(`${REPORTS_PATH}/balance-sheet`, {
        asOfDate: params.asOfDate,
        compareAsOfDate: params.compareAsOfDate,
    });
