export const CURRENT_PERIOD_EARNINGS = "__current_period_earnings__";

export type ReportAccountLine = {
    accountId: string;
    accountCode: string;
    accountName: string;
    amount: string;
    comparativeAmount: string | null;
    isSynthetic: boolean;
};

export type ComparativePeriodMeta = {
    startDate: string;
    endDate: string;
};

export type IncomeStatementResponse = {
    startDate: string;
    endDate: string;
    comparativePeriod: ComparativePeriodMeta | null;
    revenue: ReportAccountLine[];
    totalRevenue: string;
    comparativeTotalRevenue: string | null;
    expenses: ReportAccountLine[];
    totalExpenses: string;
    comparativeTotalExpenses: string | null;
    netIncome: string;
    comparativeNetIncome: string | null;
};

export type BalanceSheetResponse = {
    asOfDate: string;
    comparativeAsOfDate: string | null;
    assets: ReportAccountLine[];
    totalAssets: string;
    comparativeTotalAssets: string | null;
    liabilities: ReportAccountLine[];
    totalLiabilities: string;
    comparativeTotalLiabilities: string | null;
    equity: ReportAccountLine[];
    totalEquity: string;
    comparativeTotalEquity: string | null;
    currentEarnings: string;
    comparativeCurrentEarnings: string | null;
    totalLiabilitiesAndEquity: string;
    comparativeTotalLiabilitiesAndEquity: string | null;
    isBalanced: boolean;
    outOfBalanceAmount: string;
};
