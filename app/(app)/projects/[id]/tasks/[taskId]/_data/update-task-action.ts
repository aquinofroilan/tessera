"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import type { UpdateProjectTaskRequest } from "@/lib/api/projects/tasks";
import { updateTask } from "@/lib/api/projects/tasks-dal";
import {
    taskUpdateSchema,
    type TaskUpdateValues,
} from "../../../../_data/task-form-schema";

type Result = { ok: false; error: string };

export const updateTaskAction = async (
    projectId: string,
    taskId: string,
    values: TaskUpdateValues,
): Promise<Result | void> => {
    const parsed = taskUpdateSchema.safeParse(values);
    if (!parsed.success) {
        return { ok: false, error: "Please check the form and try again." };
    }

    const body: UpdateProjectTaskRequest = {
        name: parsed.data.name.trim(),
        description: parsed.data.description?.trim() || null,
        assigneeEmployeeId: parsed.data.assigneeEmployeeId?.trim() || null,
        estimatedHours: parsed.data.estimatedHours?.trim() || null,
        status: parsed.data.status,
    };

    try {
        await updateTask(projectId, taskId, body);
    } catch {
        return { ok: false, error: "Couldn't update the task. Try again." };
    }

    revalidatePath(`/projects/${projectId}`);
    revalidatePath(`/projects/${projectId}/tasks/${taskId}/edit`);
    redirect(`/projects/${projectId}`);
};
