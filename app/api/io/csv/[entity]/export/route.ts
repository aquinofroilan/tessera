import { NextResponse } from "next/server";

import { authHeaders } from "@/lib/api/auth-helpers";
import { serverEnv } from "@/lib/env";

const EXPORT_ENTITIES = new Set(["products", "customers", "vendors"]);

type Props = { params: Promise<{ entity: string }> };

export const GET = async (_request: Request, { params }: Props) => {
    const { entity } = await params;
    if (!EXPORT_ENTITIES.has(entity)) {
        return NextResponse.json({ error: "Unknown export entity." }, { status: 404 });
    }

    const { BACKEND_API_URL, BACKEND_API_TIMEOUT_MS } = serverEnv();
    const base = BACKEND_API_URL.endsWith("/") ? BACKEND_API_URL : `${BACKEND_API_URL}/`;
    const url = new URL(`io/csv/${entity}/export`, base);

    const headers = new Headers(await authHeaders());
    headers.set("accept", "text/csv");

    try {
        const upstream = await fetch(url.toString(), {
            method: "GET",
            headers,
            signal: AbortSignal.timeout(BACKEND_API_TIMEOUT_MS),
            cache: "no-store",
        });

        if (upstream.status === 401) {
            return NextResponse.json({ error: "Sign in to export." }, { status: 401 });
        }
        if (!upstream.ok) {
            return NextResponse.json({ error: "Export failed. Try again." }, { status: 502 });
        }

        const body = await upstream.arrayBuffer();
        const filename = upstream.headers.get("content-disposition") ?? `attachment; filename="${entity}.csv"`;

        return new NextResponse(body, {
            status: 200,
            headers: {
                "content-type": "text/csv; charset=utf-8",
                "content-disposition": filename,
                "cache-control": "no-store",
            },
        });
    } catch {
        return NextResponse.json({ error: "Export failed. Try again." }, { status: 502 });
    }
};
