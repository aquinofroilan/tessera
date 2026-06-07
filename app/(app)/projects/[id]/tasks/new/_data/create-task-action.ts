"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import type { CreateProjectTaskRequest } from "@/lib/api/projects/tasks";
import { createTask } from "@/lib/api/projects/tasks-dal";
import {
    taskFormSchema,
    type TaskFormValues,
} from "../../../../_data/task-form-schema";

type Result = { ok: false; error: string };

export const createTaskAction = async (
    projectId: string,
    values: TaskFormValues,
): Promise<Result | void> => {
    const parsed = taskFormSchema.safeParse(values);
    if (!parsed.success) {
        return { ok: false, error: "Please check the form and try again." };
    }

    const body: CreateProjectTaskRequest = {
        name: parsed.data.name.trim(),
        description: parsed.data.description?.trim() || null,
        parentTaskId: parsed.data.parentTaskId?.trim() || null,
        assigneeEmployeeId: parsed.data.assigneeEmployeeId?.trim() || null,
        estimatedHours: parsed.data.estimatedHours?.trim() || null,
    };

    try {
        await createTask(projectId, body);
    } catch {
        return { ok: false, error: "Couldn't create the task. Try again." };
    }

    revalidatePath(`/projects/${projectId}`);
    redirect(`/projects/${projectId}`);
};
