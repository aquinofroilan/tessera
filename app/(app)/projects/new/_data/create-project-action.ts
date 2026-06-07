"use server";

import { runCreateAction } from "@/lib/api/create-action";
import type { CreateProjectRequest } from "@/lib/api/projects/projects";
import { createProject } from "@/lib/api/projects/projects-dal";
import {
    projectFormSchema,
    type ProjectFormValues,
} from "../../_data/project-form-schema";

export const createProjectAction = async (values: ProjectFormValues) =>
    runCreateAction<ProjectFormValues, CreateProjectRequest>({
        values,
        schema: projectFormSchema,
        path: "/projects",
        errorMessage: "Couldn't create the project. Try again.",
        create: createProject,
        toBody: (v) => ({
            name: v.name.trim(),
            description: v.description?.trim() || null,
            customerId: v.customerId?.trim() || null,
            managerEmployeeId: v.managerEmployeeId?.trim() || null,
            startDate: v.startDate,
            endDate: v.endDate?.trim() || null,
            billingType: v.billingType,
        }),
    });
