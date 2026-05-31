import "server-only";

import { revalidatePath } from "next/cache";

type Result = { ok: true } | { ok: false; error: string };

type Options = {
    deactivate: (id: string) => Promise<unknown>;
    revalidate: (id: string) => string[];
    errorMessage: string;
};

export const createDeactivateAction =
    ({ deactivate, revalidate, errorMessage }: Options) =>
    async (id: string): Promise<Result> => {
        try {
            await deactivate(id);
        } catch {
            return { ok: false, error: errorMessage };
        }
        for (const path of revalidate(id)) revalidatePath(path);
        return { ok: true };
    };
