import "server-only";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { ZodType } from "zod";

import type { CreateActionResult } from "./create-action";

type RunUpdateActionOptions<V, B> = {
    values: V;
    schema: ZodType<V>;
    toBody: (values: V) => B;
    update: (body: B) => Promise<unknown>;
    revalidate: string[];
    redirectTo: string;
    errorMessage: string;
};

export const runUpdateAction = async <V, B>(
    options: RunUpdateActionOptions<V, B>,
): Promise<CreateActionResult | void> => {
    const parsed = options.schema.safeParse(options.values);
    if (!parsed.success) {
        return { ok: false, error: "Please check the form and try again." };
    }

    try {
        await options.update(options.toBody(parsed.data));
    } catch {
        return { ok: false, error: options.errorMessage };
    }

    for (const path of options.revalidate) revalidatePath(path);
    redirect(options.redirectTo);
};
