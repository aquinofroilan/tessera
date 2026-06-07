"use server";

import type { UpdateTimeEntryRequest } from "@/lib/api/projects/time-entries";
import { updateTimeEntry } from "@/lib/api/projects/time-entries-dal";
import { runUpdateAction } from "@/lib/api/update-action";
import {
    timeEntryUpdateSchema,
    type TimeEntryUpdateValues,
} from "../../../_data/time-entry-form-schema";

export const updateTimeEntryAction = async (id: string, values: TimeEntryUpdateValues) =>
    runUpdateAction<TimeEntryUpdateValues, UpdateTimeEntryRequest>({
        values,
        schema: timeEntryUpdateSchema,
        revalidate: ["/projects/time", `/projects/time/${id}/edit`],
        redirectTo: "/projects/time",
        errorMessage: "Couldn't update the entry. Only draft entries can be edited.",
        update: (body) => updateTimeEntry(id, body),
        toBody: (v) => ({
            taskId: v.taskId?.trim() || null,
            entryDate: v.entryDate,
            hours: v.hours,
            billable: v.billable,
            rate: v.rate?.trim() || null,
            notes: v.notes?.trim() || null,
        }),
    });
