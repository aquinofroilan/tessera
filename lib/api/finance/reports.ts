import type { IsoDate, Money } from "../types";

export const CURRENT_PERIOD_EARNINGS = "__current_period_earnings__";

export type ReportAccountLine = {
    accountId: string;
    accountCode: string;
    accountName: string;
    amount: Money;
    comparativeAmount: Money | null;
    isSynthetic: boolean;
};

export type ComparativePeriodMeta = {
    startDate: IsoDate;
    endDate: IsoDate;
};

export type IncomeStatementResponse = {
    startDate: IsoDate;
    endDate: IsoDate;
    comparativePeriod: ComparativePeriodMeta | null;
    revenue: ReportAccountLine[];
    totalRevenue: Money;
    comparativeTotalRevenue: Money | null;
    expenses: ReportAccountLine[];
    totalExpenses: Money;
    comparativeTotalExpenses: Money | null;
    netIncome: Money;
    comparativeNetIncome: Money | null;
};

export type BalanceSheetResponse = {
    asOfDate: IsoDate;
    comparativeAsOfDate: IsoDate | null;
    assets: ReportAccountLine[];
    totalAssets: Money;
    comparativeTotalAssets: Money | null;
    liabilities: ReportAccountLine[];
    totalLiabilities: Money;
    comparativeTotalLiabilities: Money | null;
    equity: ReportAccountLine[];
    totalEquity: Money;
    comparativeTotalEquity: Money | null;
    currentEarnings: Money;
    comparativeCurrentEarnings: Money | null;
    totalLiabilitiesAndEquity: Money;
    comparativeTotalLiabilitiesAndEquity: Money | null;
    isBalanced: boolean;
    outOfBalanceAmount: Money;
};
