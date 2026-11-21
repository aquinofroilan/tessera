export type CountSessionStatus = 'DRAFT' | 'COUNTING' | 'POSTED' | 'CANCELLED';

export type CountSessionLineResponse = Readonly<{
  id: string;
  lineNumber: number;
  productId: string;
  productSku: string;
  productName: string;
  expectedQuantity: number;
  countedQuantity: number | null;
  varianceQuantity: number | null;
  adjustmentMovementId: string | null;
  notes: string | null;
}>;

export type CountSessionResponse = Readonly<{
  id: string;
  code: string;
  warehouseId: string;
  status: CountSessionStatus;
  scheduledFor: string | null;
  startedAt: string | null;
  postedAt: string | null;
  notes: string | null;
  lines: readonly CountSessionLineResponse[];
}>;

export type CreateCountSessionRequest = Readonly<{
  code: string;
  warehouseId: string;
  scheduledFor?: string;
  notes?: string;
}>;

export type RecordCountRequest = Readonly<{
  countedQuantity: number;
  notes?: string;
}>;
