import { NextResponse } from "next/server";

import { signupSchema } from "@/app/(auth)/signup/_components/signup-schema";
import { signup } from "@/lib/api/auth";
import { setSessionCookie } from "@/lib/auth/session";
import { HttpError, HttpTimeoutError } from "@/lib/http";

const deriveUsername = (email: string) => {
    const local = email.split("@")[0].toLowerCase().replace(/[^a-z0-9._-]/g, "");
    const base = local.length >= 3 ? local : `${local}usr`;
    return base.slice(0, 50);
};

const slugify = (value: string) => {
    const slug = value
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 50);
    return slug || "org";
};

const readTimezone = (payload: unknown) => {
    const tz = (payload as { timezone?: unknown })?.timezone;
    return typeof tz === "string" && tz.length > 0 ? tz : "UTC";
};

export const POST = async (request: Request) => {
    let payload: unknown;
    try {
        payload = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const parsed = signupSchema.safeParse(payload);
    if (!parsed.success) {
        return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
    }

    const { firstName, lastName, email, company, password, baseCurrency } = parsed.data;

    try {
        const result = await signup({
            username: deriveUsername(email),
            password,
            email,
            firstName,
            lastName,
            orgName: company,
            orgSlug: slugify(company),
            orgDescription: null,
            orgBaseCurrency: baseCurrency,
            orgFiscalYearStart: `${new Date().getFullYear()}-01-01T00:00:00`,
            orgTimezone: readTimezone(payload),
            orgLegalName: company,
            orgTradeName: company,
        });

        const response = NextResponse.json({ ok: true });
        if (result.token) {
            setSessionCookie(response, result.token, false);
        }
        return response;
    } catch (error) {
        if (error instanceof HttpTimeoutError) {
            return NextResponse.json({ error: "The server took too long. Try again." }, { status: 504 });
        }
        if (error instanceof HttpError) {
            if (error.status === 409) {
                return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
            }
            if (error.status === 400) {
                return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
            }
            return NextResponse.json({ error: "Sign-up failed. Try again." }, { status: 502 });
        }
        return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
    }
};
