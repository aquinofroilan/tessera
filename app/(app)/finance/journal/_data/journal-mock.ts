import type { JournalEntryLineResponse, JournalEntryResponse } from "@/lib/api/finance/journal";
import { MOCK_TODAY } from "../../_data/mock-anchor";

const ORG_ID = "org_hd_millwork";

const today = new Date(MOCK_TODAY);
const daysFromToday = (offset: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + offset);
    return d.toISOString().slice(0, 10);
};
const isoDateTime = (offset: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + offset);
    d.setHours(13, 22, 0, 0);
    return d.toISOString();
};

const line = (
    accountId: string,
    accountCode: string,
    accountName: string,
    debit: string,
    credit: string,
    description: string | null = null,
): JournalEntryLineResponse => ({
    accountId,
    accountCode,
    accountName,
    debit,
    credit,
    description,
});

type Seed = Omit<JournalEntryResponse, "organizationId" | "createdAt" | "updatedAt"> & { _createdOffset: number };

const seeds: Seed[] = [
    {
        id: "je_inv_01",
        entryNumber: "JE-2026-0418",
        date: daysFromToday(-21),
        description: "Invoice INV-2046 · Cedar & Co.",
        status: "POSTED",
        source: "SYSTEM",
        sourceReference: "inv_01",
        lines: [
            line("acc_1100", "1100", "Accounts receivable", "8420.00", "0.00"),
            line("acc_4000", "4000", "Sales — Cabinetry", "0.00", "5800.00"),
            line("acc_4020", "4020", "Sales — Installation", "0.00", "2620.00"),
        ],
        createdBy: "Emma Voss",
        postedAt: isoDateTime(-21),
        voidedAt: null,
        voidReason: null,
        _createdOffset: -21,
    },
    {
        id: "je_inv_02",
        entryNumber: "JE-2026-0420",
        date: daysFromToday(-13),
        description: "Invoice INV-2049 · Northwind Cabinetry",
        status: "POSTED",
        source: "SYSTEM",
        sourceReference: "inv_02",
        lines: [
            line("acc_1100", "1100", "Accounts receivable", "12480.50", "0.00"),
            line("acc_4010", "4010", "Sales — Custom millwork", "0.00", "12480.50"),
        ],
        createdBy: "Emma Voss",
        postedAt: isoDateTime(-13),
        voidedAt: null,
        voidReason: null,
        _createdOffset: -13,
    },
    {
        id: "je_bill_01",
        entryNumber: "JE-2026-0411",
        date: daysFromToday(-31),
        description: "Bill WL-44218 · Westline Hardwoods",
        status: "POSTED",
        source: "SYSTEM",
        sourceReference: "bill_01",
        lines: [
            line("acc_5000", "5000", "COGS — Lumber", "4860.00", "0.00"),
            line("acc_2100", "2100", "Accounts payable", "0.00", "4860.00"),
        ],
        createdBy: "Hadi Karimov",
        postedAt: isoDateTime(-31),
        voidedAt: null,
        voidReason: null,
        _createdOffset: -31,
    },
    {
        id: "je_bill_05",
        entryNumber: "JE-2026-0407",
        date: daysFromToday(-43),
        description: "Bill PPL-MAR2026 · Pacific Power & Light",
        status: "POSTED",
        source: "SYSTEM",
        sourceReference: "bill_05",
        lines: [
            line("acc_6100", "6100", "Utilities", "1820.16", "0.00"),
            line("acc_2100", "2100", "Accounts payable", "0.00", "1820.16"),
        ],
        createdBy: "Hadi Karimov",
        postedAt: isoDateTime(-43),
        voidedAt: null,
        voidReason: null,
        _createdOffset: -43,
    },
    {
        id: "je_adj_01",
        entryNumber: "JE-2026-0501",
        date: daysFromToday(-12),
        description: "Adjusting entry — accrued payroll Q1",
        status: "POSTED",
        source: "MANUAL",
        sourceReference: null,
        lines: [
            line("acc_6400", "6400", "Salaries & wages", "14820.00", "0.00"),
            line("acc_2150", "2150", "Accrued liabilities", "0.00", "14820.00"),
        ],
        createdBy: "Emma Voss",
        postedAt: isoDateTime(-12),
        voidedAt: null,
        voidReason: null,
        _createdOffset: -12,
    },
    {
        id: "je_dep_01",
        entryNumber: "JE-2026-0502",
        date: daysFromToday(-9),
        description: "Monthly depreciation — shop equipment",
        status: "POSTED",
        source: "MANUAL",
        sourceReference: null,
        lines: [
            line("acc_6500", "6500", "Depreciation", "1240.00", "0.00"),
            line("acc_1750", "1750", "Accumulated depreciation", "0.00", "1240.00"),
        ],
        createdBy: "Emma Voss",
        postedAt: isoDateTime(-9),
        voidedAt: null,
        voidReason: null,
        _createdOffset: -9,
    },
    {
        id: "je_correct_01",
        entryNumber: "JE-2026-0503",
        date: daysFromToday(-4),
        description: "Reclassify supplies expense — Apr accrual fix",
        status: "DRAFT",
        source: "MANUAL",
        sourceReference: null,
        lines: [
            line("acc_6600", "6600", "Office supplies", "318.40", "0.00"),
            line("acc_6300", "6300", "Freight & shipping", "0.00", "318.40"),
        ],
        createdBy: "Emma Voss",
        postedAt: null,
        voidedAt: null,
        voidReason: null,
        _createdOffset: -4,
    },
    {
        id: "je_void_01",
        entryNumber: "JE-2026-0398",
        date: daysFromToday(-44),
        description: "Bill BW-2026-0089 · Brassworks Co. (returned)",
        status: "VOIDED",
        source: "SYSTEM",
        sourceReference: "bill_11",
        lines: [
            line("acc_5010", "5010", "COGS — Hardware & finishes", "412.00", "0.00"),
            line("acc_2100", "2100", "Accounts payable", "0.00", "412.00"),
        ],
        createdBy: "Hadi Karimov",
        postedAt: isoDateTime(-49),
        voidedAt: isoDateTime(-44),
        voidReason: "Wrong finish on shipment, returned to vendor",
        _createdOffset: -49,
    },
];

export const journalEntries: JournalEntryResponse[] = seeds.map(({ _createdOffset, ...rest }) => ({
    ...rest,
    organizationId: ORG_ID,
    createdAt: isoDateTime(_createdOffset),
    updatedAt: isoDateTime(_createdOffset + 1),
}));
