export type DisposalType = "SALE" | "WRITE_OFF" | "SCRAP";
export type DisposalStatus = "DRAFT" | "POSTED" | "CANCELLED";

export type CreateAssetDisposalRequest = {
    assetId: string;
    disposalDate: string;
    disposalType: DisposalType;
    proceeds?: string;
    gainLossAccountId?: string | null;
    cashAccountId?: string | null;
    notes?: string | null;
};

export type AssetDisposalResponse = {
    id: string;
    assetId: string;
    disposalDate: string;
    disposalType: DisposalType;
    proceeds: string;
    status: DisposalStatus;
    journalEntryId: string | null;
    gainLossAccountId: string | null;
    cashAccountId: string | null;
    notes: string | null;
    postedAt: string | null;
    postedBy: string | null;
    organizationId: string;
    createdAt: string | null;
    updatedAt: string | null;
};
