import { NextResponse } from "next/server";

import { authHeaders } from "@/lib/api/auth-helpers";
import { serverEnv } from "@/lib/env";

const IMPORT_ENTITIES = new Set(["products", "customers"]);
const MAX_BYTES = 5 * 1024 * 1024;

type Props = { params: Promise<{ entity: string }> };

export const POST = async (request: Request, { params }: Props) => {
    const { entity } = await params;
    if (!IMPORT_ENTITIES.has(entity)) {
        return NextResponse.json({ error: "Unknown import entity." }, { status: 404 });
    }

    let incoming: FormData;
    try {
        incoming = await request.formData();
    } catch {
        return NextResponse.json({ error: "Expected a multipart upload." }, { status: 400 });
    }

    const file = incoming.get("file");
    if (!(file instanceof File)) {
        return NextResponse.json({ error: "Attach a CSV file in the 'file' field." }, { status: 400 });
    }
    if (file.size === 0) {
        return NextResponse.json({ error: "The file is empty." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
        return NextResponse.json({ error: "File too large. Max 5 MB." }, { status: 413 });
    }

    const { BACKEND_API_URL, BACKEND_API_TIMEOUT_MS } = serverEnv();
    const base = BACKEND_API_URL.endsWith("/") ? BACKEND_API_URL : `${BACKEND_API_URL}/`;
    const url = new URL(`io/csv/${entity}/import`, base);

    const outgoing = new FormData();
    outgoing.append("file", file, file.name || `${entity}.csv`);

    const headers = new Headers(await authHeaders());
    headers.set("accept", "application/json");

    try {
        const upstream = await fetch(url.toString(), {
            method: "POST",
            headers,
            body: outgoing,
            signal: AbortSignal.timeout(BACKEND_API_TIMEOUT_MS),
            cache: "no-store",
        });

        const data = (await upstream.json().catch(() => null)) as unknown;

        if (upstream.status === 401) {
            return NextResponse.json({ error: "Sign in to import." }, { status: 401 });
        }
        if (!upstream.ok) {
            const error =
                data && typeof data === "object" && "error" in data && typeof (data as { error: unknown }).error === "string"
                    ? (data as { error: string }).error
                    : "Import failed. Try again.";
            return NextResponse.json({ error }, { status: 502 });
        }

        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ error: "Import failed. Try again." }, { status: 502 });
    }
};
