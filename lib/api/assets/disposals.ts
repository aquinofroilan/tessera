import type { IsoDate, IsoDateTime, Money } from "../types";

export type DisposalType = "SALE" | "WRITE_OFF" | "SCRAP";
export type DisposalStatus = "DRAFT" | "POSTED" | "CANCELLED";

export type CreateAssetDisposalRequest = {
    assetId: string;
    disposalDate: IsoDate;
    disposalType: DisposalType;
    proceeds?: Money;
    gainLossAccountId?: string | null;
    cashAccountId?: string | null;
    notes?: string | null;
};

export type AssetDisposalResponse = {
    id: string;
    assetId: string;
    disposalDate: IsoDate;
    disposalType: DisposalType;
    proceeds: Money;
    status: DisposalStatus;
    journalEntryId: string | null;
    gainLossAccountId: string | null;
    cashAccountId: string | null;
    notes: string | null;
    postedAt: IsoDateTime | null;
    postedBy: string | null;
    organizationId: string;
    createdAt: IsoDateTime | null;
    updatedAt: IsoDateTime | null;
};
