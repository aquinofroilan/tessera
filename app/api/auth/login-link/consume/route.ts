import { NextResponse } from "next/server";
import { z } from "zod";

import { consumeLoginLink } from "@/lib/api/auth";
import { setSessionCookie } from "@/lib/auth/session";
import { HttpError, HttpTimeoutError } from "@/lib/http";

const schema = z.object({
    token: z.string().trim().min(1, "Missing token"),
});

export const POST = async (request: Request) => {
    let payload: unknown;
    try {
        payload = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const parsed = schema.safeParse(payload);
    if (!parsed.success) {
        return NextResponse.json({ error: "Missing or invalid token." }, { status: 400 });
    }

    try {
        const result: unknown = await consumeLoginLink({ token: parsed.data.token });
        const token =
            result && typeof result === "object" && typeof (result as { token?: unknown }).token === "string"
                ? (result as { token: string }).token
                : "";
        if (!token) {
            return NextResponse.json({ error: "Sign-in failed. Try again." }, { status: 502 });
        }

        const response = NextResponse.json({ ok: true });
        setSessionCookie(response, token, true);
        return response;
    } catch (error) {
        if (error instanceof HttpTimeoutError) {
            return NextResponse.json({ error: "The server took too long. Try again." }, { status: 504 });
        }
        if (error instanceof HttpError) {
            if (error.status === 401 || error.status === 400) {
                return NextResponse.json({ error: "Invalid or expired login link." }, { status: 401 });
            }
            return NextResponse.json({ error: "Sign-in failed. Try again." }, { status: 502 });
        }
        return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
    }
};
