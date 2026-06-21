import { NextResponse } from "next/server";
import { z } from "zod";

import { requestLoginLink } from "@/lib/api/auth";
import { HttpError, HttpTimeoutError } from "@/lib/http";

const schema = z.object({
    email: z.email("Enter a valid email").trim().toLowerCase(),
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
        return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
    }

    try {
        await requestLoginLink({ email: parsed.data.email });
        return NextResponse.json({ ok: true });
    } catch (error) {
        if (error instanceof HttpTimeoutError) {
            return NextResponse.json({ error: "The server took too long. Try again." }, { status: 504 });
        }
        if (error instanceof HttpError) {
            return NextResponse.json({ error: "Couldn't send the link. Try again." }, { status: 502 });
        }
        return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
    }
};
