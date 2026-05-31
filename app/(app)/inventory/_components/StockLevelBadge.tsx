type StockLevelBadgeProps = {
    onHand: number;
    reorderPoint: number | null;
};

export const StockLevelBadge = ({ onHand, reorderPoint }: StockLevelBadgeProps) => {
    if (reorderPoint == null || onHand > reorderPoint) return null;

    const isOut = onHand <= 0;
    const reorderLabel = Number.isInteger(reorderPoint) ? reorderPoint.toString() : reorderPoint.toFixed(2);
    return (
        <span
            className={
                isOut
                    ? "inline-flex items-center rounded-full bg-(--accent)/15 px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] text-(--accent) uppercase"
                    : "inline-flex items-center rounded-full bg-(--accent)/8 px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] text-(--accent) uppercase"
            }
            title={`At or below reorder point (${reorderLabel})`}>
            {isOut ? "Out" : "Low"}
        </span>
    );
};
