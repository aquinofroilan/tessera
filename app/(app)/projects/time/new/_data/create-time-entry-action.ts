"use server";

import type { CreateTimeEntryRequest } from "@/lib/api/projects/time-entries";
import { createTimeEntry } from "@/lib/api/projects/time-entries-dal";
import { runCreateAction } from "@/lib/api/create-action";
import {
    timeEntryFormSchema,
    type TimeEntryFormValues,
} from "../../../_data/time-entry-form-schema";

export const createTimeEntryAction = async (values: TimeEntryFormValues) =>
    runCreateAction<TimeEntryFormValues, CreateTimeEntryRequest>({
        values,
        schema: timeEntryFormSchema,
        path: "/projects/time",
        errorMessage: "Couldn't log the time entry. Try again.",
        create: createTimeEntry,
        toBody: (v) => ({
            employeeId: v.employeeId,
            projectId: v.projectId,
            taskId: v.taskId?.trim() || null,
            entryDate: v.entryDate,
            hours: v.hours,
            billable: v.billable,
            rate: v.rate?.trim() || null,
            notes: v.notes?.trim() || null,
        }),
    });
