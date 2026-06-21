import type { IsoDateTime, Money } from "../types";

export type DepreciationRunStatus = "DRAFT" | "POSTED" | "CANCELLED";

export type CreateDepreciationRunRequest = {
    periodYear: number;
    periodMonth: number;
};

export type DepreciationRunLineResponse = {
    id: string;
    assetId: string;
    depreciationAmount: Money;
    debitAccountId: string | null;
    creditAccountId: string | null;
};

export type DepreciationRunResponse = {
    id: string;
    periodYear: number;
    periodMonth: number;
    status: DepreciationRunStatus;
    totalDepreciation: Money;
    journalEntryId: string | null;
    postedAt: IsoDateTime | null;
    postedBy: string | null;
    organizationId: string;
    createdAt: IsoDateTime | null;
    updatedAt: IsoDateTime | null;
    lines?: DepreciationRunLineResponse[];
};
