import { NextResponse } from "next/server";

import { signinSchema } from "@/app/(auth)/signin/_components/signin-schema";
import { signin } from "@/lib/api/auth";
import { setSessionCookie } from "@/lib/auth/session";
import { HttpError, HttpTimeoutError } from "@/lib/http";

export const POST = async (request: Request) => {
    let payload: unknown;
    try {
        payload = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const parsed = signinSchema.safeParse(payload);
    if (!parsed.success) {
        return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
    }

    const { email, password, remember } = parsed.data;
    const rememberMe = remember ?? false;

    try {
        const result: unknown = await signin({ username: email, password, rememberMe });
        const token =
            result && typeof result === "object" && typeof (result as { token?: unknown }).token === "string"
                ? (result as { token: string }).token
                : "";
        if (!token) {
            return NextResponse.json({ error: "Sign-in failed. Try again." }, { status: 502 });
        }

        const response = NextResponse.json({ ok: true });
        setSessionCookie(response, token, rememberMe);
        return response;
    } catch (error) {
        if (error instanceof HttpTimeoutError) {
            return NextResponse.json({ error: "The server took too long. Try again." }, { status: 504 });
        }
        if (error instanceof HttpError) {
            if (error.status === 401 || error.status === 400) {
                return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
            }
            return NextResponse.json({ error: "Sign-in failed. Try again." }, { status: 502 });
        }
        return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
    }
};
