"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { deleteWorkflowRule } from "@/lib/api/workflow-rules-dal";

export type DeleteRuleResult = { ok: false; error: string };

export async function deleteWorkflowRuleAction(id: string): Promise<DeleteRuleResult | void> {
    try {
        await deleteWorkflowRule(id);
    } catch {
        return { ok: false, error: "Couldn't delete the rule. Try again." };
    }
    revalidatePath("/workflow/rules");
    redirect("/workflow/rules");
}
