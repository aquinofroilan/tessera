"use server";

import { revalidatePath } from "next/cache";

import { setTaskParent } from "@/lib/api/projects/tasks-dal";

type Result = { ok: true } | { ok: false; error: string };

export const reparentTaskAction = async (
    projectId: string,
    taskId: string,
    parentTaskId: string | null,
): Promise<Result> => {
    try {
        await setTaskParent(projectId, taskId, { parentTaskId });
    } catch {
        return {
            ok: false,
            error: "Couldn't reparent the task. The new parent may create a cycle or live in a different project.",
        };
    }
    revalidatePath(`/projects/${projectId}`);
    revalidatePath(`/projects/${projectId}/tasks/${taskId}/edit`);
    return { ok: true };
};
