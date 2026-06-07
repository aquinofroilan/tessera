"use server";

import {
    activateProject,
    cancelProject,
    closeProject,
    holdProject,
} from "@/lib/api/projects/projects-dal";
import { createTransitionAction } from "../../../hr/_data/create-transition-action";

const revalidate = (id: string) => ["/projects", `/projects/${id}`];

export const activateProjectAction = createTransitionAction({
    call: (id: string) => activateProject(id),
    revalidate,
    errorMessage: "Couldn't activate the project. Only planned or on-hold projects can be activated.",
});

export const holdProjectAction = createTransitionAction({
    call: (id: string) => holdProject(id),
    revalidate,
    errorMessage: "Couldn't put the project on hold. Only active projects can be held.",
});

export const closeProjectAction = createTransitionAction({
    call: (id: string) => closeProject(id),
    revalidate,
    errorMessage: "Couldn't close the project. Only active or on-hold projects can be closed.",
});

export const cancelProjectAction = createTransitionAction({
    call: (id: string) => cancelProject(id),
    revalidate,
    errorMessage: "Couldn't cancel the project.",
});
