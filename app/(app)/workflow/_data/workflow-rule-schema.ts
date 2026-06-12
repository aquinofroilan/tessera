import { z } from "zod";

export const workflowRuleFormSchema = z.object({
    name: z.string().trim().min(1, "Required").max(200, "Too long"),
    description: z.string().trim().max(1000, "Too long").optional(),
    eventKind: z.string().trim().min(1, "Pick an event"),
    actionType: z.enum(["NOTIFY_USER", "NOTIFY_ROLE"]),
    actionTarget: z.string().trim().min(1, "Required").max(200, "Too long"),
    enabled: z.boolean(),
});

export type WorkflowRuleFormValues = z.infer<typeof workflowRuleFormSchema>;

export const WORKFLOW_RULE_FORM_DEFAULTS: WorkflowRuleFormValues = {
    name: "",
    description: "",
    eventKind: "leave_request.approved",
    actionType: "NOTIFY_USER",
    actionTarget: "",
    enabled: true,
};
