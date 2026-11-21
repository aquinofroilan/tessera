export type ReorderRuleResponse = Readonly<{
  id: string;
  productId: string;
  warehouseId: string;
  reorderPoint: number;
  safetyStock: number;
  organizationId: string;
  createdAt: string;
  updatedAt: string | null;
}>;

export type CreateReorderRuleRequest = Readonly<{
  productId: string;
  warehouseId: string;
  reorderPoint: number;
  safetyStock: number;
}>;

export type UpdateReorderRuleRequest = Readonly<{
  reorderPoint?: number;
  safetyStock?: number;
}>;
