import "server-only";

import type { NextResponse } from "next/server";

export const SESSION_COOKIE = "loom_session";

const REMEMBER_MAX_AGE = 60 * 60 * 24 * 30;

export const setSessionCookie = (response: NextResponse, token: string, remember: boolean) => {
    response.cookies.set({
        name: SESSION_COOKIE,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        ...(remember ? { maxAge: REMEMBER_MAX_AGE } : {}),
    });
};

export const clearSessionCookie = (response: NextResponse) => {
    response.cookies.set({ name: SESSION_COOKIE, value: "", path: "/", maxAge: 0 });
};
