import { IconCash, IconCircleCheck, IconCircleX, IconEye, IconPencil } from "@tabler/icons-react";

import type { RowAction } from "./RowActionsMenu";

type DocumentStatus = "DRAFT" | "APPROVED" | "PARTIALLY_PAID" | "PAID" | "VOID";

type DocumentRowActionsOptions = {
    id: string;
    basePath: string;
    status: DocumentStatus;
    payKey: string;
    payLabel: string;
    voidLabel: string;
    push: (href: string) => void;
};

export const buildDocumentRowActions = (options: DocumentRowActionsOptions): RowAction[] => {
    const { id, basePath, status, payKey, payLabel, voidLabel, push } = options;
    const isDraft = status === "DRAFT";
    const isOpen = status === "APPROVED" || status === "PARTIALLY_PAID";

    return [
        { key: "view", label: "View", icon: <IconEye />, onSelect: () => push(`${basePath}/${id}`) },
        ...(isDraft
            ? [
                  {
                      key: "edit",
                      label: "Edit",
                      icon: <IconPencil />,
                      onSelect: () => push(`${basePath}/${id}/edit`),
                  },
                  {
                      key: "approve",
                      label: "Approve",
                      icon: <IconCircleCheck />,
                      onSelect: () => console.info("[mock] approve", id),
                  },
              ]
            : []),
        ...(isOpen
            ? [
                  {
                      key: payKey,
                      label: payLabel,
                      icon: <IconCash />,
                      onSelect: () => console.info(`[mock] ${payKey}`, id),
                  },
                  {
                      key: "void",
                      label: voidLabel,
                      icon: <IconCircleX />,
                      destructive: true,
                      separatorBefore: true,
                      onSelect: () => console.info("[mock] void", id),
                  },
              ]
            : []),
    ];
};
