// Backend serializes BigDecimal as a JSON string; keep it as a string to avoid float drift.
export type Money = string;

export type IsoDate = string;
export type IsoDateTime = string;
