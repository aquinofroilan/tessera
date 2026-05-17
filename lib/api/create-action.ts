import "server-only";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { ZodType } from "zod";

export type CreateActionResult = { ok: false; error: string };

type RunCreateActionOptions<V, B> = {
    values: V;
    schema: ZodType<V>;
    toBody: (values: V) => B;
    create: (body: B) => Promise<unknown>;
    path: string;
    errorMessage: string;
};

export const runCreateAction = async <V, B>(
    options: RunCreateActionOptions<V, B>,
): Promise<CreateActionResult | void> => {
    const parsed = options.schema.safeParse(options.values);
    if (!parsed.success) {
        return { ok: false, error: "Please check the form and try again." };
    }

    try {
        await options.create(options.toBody(parsed.data));
    } catch {
        return { ok: false, error: options.errorMessage };
    }

    revalidatePath(options.path);
    redirect(options.path);
};
