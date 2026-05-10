import type { VendorResponse } from "@/lib/api/finance/vendors";
import { MOCK_TODAY } from "../../../_data/mock-anchor";

const ORG_ID = "org_hd_millwork";

const isoDateTime = (offset: number) => {
    const d = new Date(MOCK_TODAY);
    d.setDate(d.getDate() + offset);
    d.setHours(10, 4, 0, 0);
    return d.toISOString();
};

type Seed = Omit<VendorResponse, "organizationId" | "createdAt" | "updatedAt"> & { _createdOffset: number };

const seeds: Seed[] = [
    {
        id: "vend_01",
        name: "Westline Hardwoods",
        contactName: "Karim Westline",
        contactEmail: "orders@westlinehw.com",
        contactPhone: "+1 360 555 0181",
        paymentTermDays: 30,
        defaultExpenseAccountId: "acc_5000",
        isActive: true,
        _createdOffset: -540,
    },
    {
        id: "vend_02",
        name: "Brassworks Co.",
        contactName: "Lina Polk",
        contactEmail: "lina@brassworks.co",
        contactPhone: "+1 718 555 0114",
        paymentTermDays: 30,
        defaultExpenseAccountId: "acc_5010",
        isActive: true,
        _createdOffset: -420,
    },
    {
        id: "vend_03",
        name: "Halberd Finishing Supplies",
        contactName: "Owen Halberd",
        contactEmail: "owen@halberdfinish.com",
        contactPhone: "+1 503 555 0166",
        paymentTermDays: 14,
        defaultExpenseAccountId: "acc_5010",
        isActive: true,
        _createdOffset: -300,
    },
    {
        id: "vend_04",
        name: "Drayton Freight",
        contactName: "Marisol Drayton",
        contactEmail: "ap@draytonfreight.com",
        contactPhone: "+1 206 555 0128",
        paymentTermDays: 30,
        defaultExpenseAccountId: "acc_6300",
        isActive: true,
        _createdOffset: -260,
    },
    {
        id: "vend_05",
        name: "Pacific Power & Light",
        contactName: null,
        contactEmail: "billing@ppl.coop",
        contactPhone: "+1 800 555 0100",
        paymentTermDays: 30,
        defaultExpenseAccountId: "acc_6100",
        isActive: true,
        _createdOffset: -1200,
    },
    {
        id: "vend_06",
        name: "Hadley Insurance Group",
        contactName: "Renata Hadley",
        contactEmail: "renata@hadleyins.com",
        contactPhone: "+1 415 555 0192",
        paymentTermDays: 30,
        defaultExpenseAccountId: "acc_6200",
        isActive: true,
        _createdOffset: -360,
    },
    {
        id: "vend_07",
        name: "Granite & Co. Stone",
        contactName: "Pieter Granite",
        contactEmail: "orders@graniteco.stone",
        contactPhone: "+1 415 555 0173",
        paymentTermDays: 45,
        defaultExpenseAccountId: "acc_5010",
        isActive: true,
        _createdOffset: -180,
    },
    {
        id: "vend_08",
        name: "Mills Custom Metalwork",
        contactName: "Jaime Mills",
        contactEmail: "jaime@millsmetal.studio",
        contactPhone: "+1 503 555 0140",
        paymentTermDays: 30,
        defaultExpenseAccountId: "acc_5020",
        isActive: true,
        _createdOffset: -130,
    },
    {
        id: "vend_09",
        name: "Birch Coffee Roasters",
        contactName: "Tess Birch",
        contactEmail: "billing@birchroasters.co",
        contactPhone: null,
        paymentTermDays: 30,
        defaultExpenseAccountId: "acc_6100",
        isActive: false,
        _createdOffset: -800,
    },
];

export const vendors: VendorResponse[] = seeds.map(({ _createdOffset, ...rest }) => ({
    ...rest,
    organizationId: ORG_ID,
    createdAt: isoDateTime(_createdOffset),
    updatedAt: isoDateTime(_createdOffset + 5),
}));
