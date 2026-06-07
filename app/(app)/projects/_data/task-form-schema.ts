import { z } from "zod";

import { TASK_STATUSES, type TaskStatus } from "@/lib/api/projects/tasks";

const taskStatus = z.enum(TASK_STATUSES as readonly [TaskStatus, ...TaskStatus[]]);

const decimal = z
    .string()
    .trim()
    .regex(/^$|^\d+(\.\d{1,4})?$/, "Up to 4 decimal places")
    .optional();

export const taskFormSchema = z.object({
    name: z.string().trim().min(1, "Required").max(200, "Too long"),
    description: z.string().trim().max(2000, "Too long").optional(),
    parentTaskId: z.string().trim().optional(),
    assigneeEmployeeId: z.string().trim().optional(),
    estimatedHours: decimal,
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;

export const taskFormDefaults = (): TaskFormValues => ({
    name: "",
    description: "",
    parentTaskId: "",
    assigneeEmployeeId: "",
    estimatedHours: "",
});

export const taskUpdateSchema = z.object({
    name: z.string().trim().min(1, "Required").max(200, "Too long"),
    description: z.string().trim().max(2000, "Too long").optional(),
    assigneeEmployeeId: z.string().trim().optional(),
    estimatedHours: decimal,
    status: taskStatus,
});

export type TaskUpdateValues = z.infer<typeof taskUpdateSchema>;
