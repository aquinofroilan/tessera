import type { CustomerResponse } from "@/lib/api/finance/customers";
import { MOCK_TODAY } from "../../../_data/mock-anchor";

const ORG_ID = "org_hd_millwork";

const isoDateTime = (offset: number) => {
    const d = new Date(MOCK_TODAY);
    d.setDate(d.getDate() + offset);
    d.setHours(9, 12, 0, 0);
    return d.toISOString();
};

type Seed = Omit<CustomerResponse, "organizationId" | "createdAt" | "updatedAt"> & { _createdOffset: number };

const seeds: Seed[] = [
    {
        id: "cust_01",
        name: "Cedar & Co.",
        contactName: "Mira Cedar",
        contactEmail: "billing@cedarandco.com",
        contactPhone: "+1 503 555 0144",
        paymentTermDays: 30,
        defaultRevenueAccountId: "acc_4000",
        isActive: true,
        _createdOffset: -420,
    },
    {
        id: "cust_02",
        name: "Northwind Cabinetry",
        contactName: "Jonas Holm",
        contactEmail: "ap@northwindcab.com",
        contactPhone: "+1 206 555 0188",
        paymentTermDays: 45,
        defaultRevenueAccountId: "acc_4010",
        isActive: true,
        _createdOffset: -360,
    },
    {
        id: "cust_03",
        name: "Marston Architecture",
        contactName: "Eli Marston",
        contactEmail: "studio@marston.archi",
        contactPhone: "+1 415 555 0102",
        paymentTermDays: 30,
        defaultRevenueAccountId: "acc_4010",
        isActive: true,
        _createdOffset: -290,
    },
    {
        id: "cust_04",
        name: "Brookfield Interiors",
        contactName: "Sasha Brookfield",
        contactEmail: "sasha@brookfield.studio",
        contactPhone: "+1 212 555 0177",
        paymentTermDays: 30,
        defaultRevenueAccountId: "acc_4000",
        isActive: true,
        _createdOffset: -210,
    },
    {
        id: "cust_05",
        name: "Bramble Home Goods",
        contactName: "Pearl Vasquez",
        contactEmail: "ops@bramblehome.co",
        contactPhone: "+1 503 555 0166",
        paymentTermDays: 60,
        defaultRevenueAccountId: "acc_4100",
        isActive: true,
        _createdOffset: -180,
    },
    {
        id: "cust_06",
        name: "Halverson Studio",
        contactName: "Tomas Halverson",
        contactEmail: "tomas@halverson.studio",
        contactPhone: "+1 612 555 0119",
        paymentTermDays: 30,
        defaultRevenueAccountId: "acc_4010",
        isActive: true,
        _createdOffset: -140,
    },
    {
        id: "cust_07",
        name: "Riverstone Hotels",
        contactName: "Dana Pell",
        contactEmail: "ap@riverstone.hospitality",
        contactPhone: "+1 305 555 0144",
        paymentTermDays: 60,
        defaultRevenueAccountId: "acc_4020",
        isActive: true,
        _createdOffset: -90,
    },
    {
        id: "cust_08",
        name: "Aldgate Properties",
        contactName: "Henry Aldgate",
        contactEmail: "billing@aldgate.re",
        contactPhone: null,
        paymentTermDays: 45,
        defaultRevenueAccountId: "acc_4000",
        isActive: true,
        _createdOffset: -60,
    },
    {
        id: "cust_09",
        name: "Linden Workshop",
        contactName: "Asha Linden",
        contactEmail: "asha@lindenworks.co",
        contactPhone: "+1 503 555 0203",
        paymentTermDays: 14,
        defaultRevenueAccountId: "acc_4010",
        isActive: false,
        _createdOffset: -730,
    },
];

export const customers: CustomerResponse[] = seeds.map(({ _createdOffset, ...rest }) => ({
    ...rest,
    organizationId: ORG_ID,
    createdAt: isoDateTime(_createdOffset),
    updatedAt: isoDateTime(_createdOffset + 5),
}));
