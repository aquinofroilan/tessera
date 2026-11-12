export type DepreciationRunStatus = "DRAFT" | "POSTED" | "CANCELLED";

export type CreateDepreciationRunRequest = {
    periodYear: number;
    periodMonth: number;
};

export type DepreciationRunLineResponse = {
    id: string;
    assetId: string;
    depreciationAmount: string;
    debitAccountId: string | null;
    creditAccountId: string | null;
};

export type DepreciationRunResponse = {
    id: string;
    periodYear: number;
    periodMonth: number;
    status: DepreciationRunStatus;
    totalDepreciation: string;
    journalEntryId: string | null;
    postedAt: string | null;
    postedBy: string | null;
    organizationId: string;
    createdAt: string | null;
    updatedAt: string | null;
    lines?: DepreciationRunLineResponse[];
};
