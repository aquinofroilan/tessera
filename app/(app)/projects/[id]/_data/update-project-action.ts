"use server";

import { runUpdateAction } from "@/lib/api/update-action";
import type { UpdateProjectRequest } from "@/lib/api/projects/projects";
import { updateProject } from "@/lib/api/projects/projects-dal";
import {
    projectUpdateSchema,
    type ProjectUpdateValues,
} from "../../_data/project-form-schema";

export const updateProjectAction = async (id: string, values: ProjectUpdateValues) =>
    runUpdateAction<ProjectUpdateValues, UpdateProjectRequest>({
        values,
        schema: projectUpdateSchema,
        revalidate: ["/projects", `/projects/${id}`],
        redirectTo: `/projects/${id}`,
        errorMessage: "Couldn't update the project. Try again.",
        update: (body) => updateProject(id, body),
        toBody: (v) => ({
            name: v.name.trim(),
            description: v.description?.trim() || null,
            customerId: v.customerId?.trim() || null,
            managerEmployeeId: v.managerEmployeeId?.trim() || null,
            endDate: v.endDate?.trim() || null,
            billingType: v.billingType,
        }),
    });
