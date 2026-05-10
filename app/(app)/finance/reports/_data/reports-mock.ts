import type { BalanceSheetResponse, IncomeStatementResponse, ReportAccountLine } from "@/lib/api/finance/reports";
import { accounts } from "../../accounts/_data/accounts-mock";

const accountById = new Map(accounts.map((a) => [a.id, a]));

function line(accountId: string, amount: number, comparativeAmount: number | null = null): ReportAccountLine {
    const acc = accountById.get(accountId);
    if (!acc) throw new Error(`Unknown account ${accountId}`);
    return {
        accountId,
        accountCode: acc.code,
        accountName: acc.name,
        amount: amount.toFixed(2),
        comparativeAmount: comparativeAmount === null ? null : comparativeAmount.toFixed(2),
        isSynthetic: false,
    };
}

function syntheticLine(label: string, amount: number, comparativeAmount: number | null = null): ReportAccountLine {
    return {
        accountId: "__current_period_earnings__",
        accountCode: "—",
        accountName: label,
        amount: amount.toFixed(2),
        comparativeAmount: comparativeAmount === null ? null : comparativeAmount.toFixed(2),
        isSynthetic: true,
    };
}

const sum = (lines: ReportAccountLine[], key: "amount" | "comparativeAmount") =>
    lines.reduce((s, l) => s + Number(l[key] ?? 0), 0);

const revenue: ReportAccountLine[] = [
    line("acc_4000", 58420, 47120),
    line("acc_4010", 42180, 33240),
    line("acc_4020", 14820, 12180),
    line("acc_4100", 4980, 4280),
];

const expenses: ReportAccountLine[] = [
    line("acc_5000", 27160, 21880),
    line("acc_5010", 14620, 11640),
    line("acc_5020", 18420, 14820),
    line("acc_6100", 5180, 4890),
    line("acc_6200", 3960, 3960),
    line("acc_6300", 2540, 2080),
    line("acc_6400", 32480, 22480),
    line("acc_6500", 3720, 3720),
    line("acc_6600", 1180, 970),
];

const totalRevenue = sum(revenue, "amount");
const totalRevenueComp = sum(revenue, "comparativeAmount");
const totalExpenses = sum(expenses, "amount");
const totalExpensesComp = sum(expenses, "comparativeAmount");
const netIncome = totalRevenue - totalExpenses;
const netIncomeComp = totalRevenueComp - totalExpensesComp;

export const incomeStatementMock: IncomeStatementResponse = {
    startDate: "2026-04-01",
    endDate: "2026-05-10",
    comparativePeriod: { startDate: "2026-01-01", endDate: "2026-03-31" },
    revenue,
    totalRevenue: totalRevenue.toFixed(2),
    comparativeTotalRevenue: totalRevenueComp.toFixed(2),
    expenses,
    totalExpenses: totalExpenses.toFixed(2),
    comparativeTotalExpenses: totalExpensesComp.toFixed(2),
    netIncome: netIncome.toFixed(2),
    comparativeNetIncome: netIncomeComp.toFixed(2),
};

const assets: ReportAccountLine[] = [
    line("acc_1000", 42180, 35120),
    line("acc_1100", 38420, 31280),
    line("acc_1200", 22480, 19420),
    line("acc_1210", 8120, 6280),
    line("acc_1700", 32400, 32400),
    line("acc_1750", -7480, -3760),
];

const liabilities: ReportAccountLine[] = [
    line("acc_2100", 18620, 14820),
    line("acc_2150", 14820, 9120),
    line("acc_2200", 980, 720),
];

const equityBase: ReportAccountLine[] = [line("acc_3000", 60000, 60000), line("acc_3100", 30560, 22680)];

const totalAssets = sum(assets, "amount");
const totalAssetsComp = sum(assets, "comparativeAmount");
const totalLiabilities = sum(liabilities, "amount");
const totalLiabilitiesComp = sum(liabilities, "comparativeAmount");
const totalEquityBase = sum(equityBase, "amount");
const totalEquityBaseComp = sum(equityBase, "comparativeAmount");

const currentEarnings = netIncome;
const currentEarningsComp = netIncomeComp;

const equity: ReportAccountLine[] = [
    ...equityBase,
    syntheticLine("Current-period earnings", currentEarnings, currentEarningsComp),
];

const totalEquity = totalEquityBase + currentEarnings;
const totalEquityComp = totalEquityBaseComp + currentEarningsComp;

const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;
const totalLiabilitiesAndEquityComp = totalLiabilitiesComp + totalEquityComp;

const outOfBalanceAmount = totalAssets - totalLiabilitiesAndEquity;

export const balanceSheetMock: BalanceSheetResponse = {
    asOfDate: "2026-05-10",
    comparativeAsOfDate: "2026-03-31",
    assets,
    totalAssets: totalAssets.toFixed(2),
    comparativeTotalAssets: totalAssetsComp.toFixed(2),
    liabilities,
    totalLiabilities: totalLiabilities.toFixed(2),
    comparativeTotalLiabilities: totalLiabilitiesComp.toFixed(2),
    equity,
    totalEquity: totalEquity.toFixed(2),
    comparativeTotalEquity: totalEquityComp.toFixed(2),
    currentEarnings: currentEarnings.toFixed(2),
    comparativeCurrentEarnings: currentEarningsComp.toFixed(2),
    totalLiabilitiesAndEquity: totalLiabilitiesAndEquity.toFixed(2),
    comparativeTotalLiabilitiesAndEquity: totalLiabilitiesAndEquityComp.toFixed(2),
    isBalanced: Math.abs(outOfBalanceAmount) < 0.005,
    outOfBalanceAmount: outOfBalanceAmount.toFixed(2),
};
