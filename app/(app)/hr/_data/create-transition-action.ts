import "server-only";

import { revalidatePath } from "next/cache";

type Result = { ok: true } | { ok: false; error: string };

type Options<Args extends unknown[]> = {
    call: (id: string, ...args: Args) => Promise<unknown>;
    revalidate: (id: string) => string[];
    errorMessage: string;
};

export const createTransitionAction =
    <Args extends unknown[]>({ call, revalidate, errorMessage }: Options<Args>) =>
    async (id: string, ...args: Args): Promise<Result> => {
        try {
            await call(id, ...args);
        } catch {
            return { ok: false, error: errorMessage };
        }
        for (const path of revalidate(id)) revalidatePath(path);
        return { ok: true };
    };
