"use server";

import {
    approveTimeEntry,
    rejectTimeEntry,
    submitTimeEntry,
} from "@/lib/api/projects/time-entries-dal";
import { createTransitionAction } from "../../../../hr/_data/create-transition-action";

const revalidate = () => ["/projects/time", "/projects/time/approvals"];

export const submitTimeEntryAction = createTransitionAction({
    call: (id: string) => submitTimeEntry(id),
    revalidate,
    errorMessage: "Couldn't submit. Only draft entries can be submitted.",
});

export const approveTimeEntryAction = createTransitionAction({
    call: (id: string) => approveTimeEntry(id),
    revalidate,
    errorMessage: "Couldn't approve. Only submitted entries can be approved.",
});

export const rejectTimeEntryAction = createTransitionAction({
    call: (id: string) => rejectTimeEntry(id),
    revalidate,
    errorMessage: "Couldn't reject. Only submitted entries can be rejected.",
});
