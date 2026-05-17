import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { HttpError } from "@/lib/http";
import { SESSION_COOKIE } from "@/lib/auth/session";

export const authHeaders = async (): Promise<HeadersInit> => {
    const token = (await cookies()).get(SESSION_COOKIE)?.value;
    return token ? { authorization: `Bearer ${token}` } : {};
};

export const authed = async <T>(call: () => Promise<T>): Promise<T> => {
    try {
        return await call();
    } catch (error) {
        if (error instanceof HttpError && error.status === 401) redirect("/signin");
        throw error;
    }
};
