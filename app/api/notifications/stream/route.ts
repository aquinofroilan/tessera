import { authHeaders } from "@/lib/api/auth-helpers";
import { serverEnv } from "@/lib/env";

/**
 * Streams SSE from the backend through to the browser, forwarding the
 * session bearer token. Implemented as a plain transparent pipe — Next's
 * web ReadableStream handles backpressure and aborts when the client
 * disconnects.
 */
export async function GET(request: Request) {
    const { BACKEND_API_URL } = serverEnv();
    const base = BACKEND_API_URL.endsWith("/") ? BACKEND_API_URL : `${BACKEND_API_URL}/`;
    const url = new URL("notifications/stream", base);

    const headers = new Headers(await authHeaders());
    headers.set("accept", "text/event-stream");

    let upstream: Response;
    try {
        upstream = await fetch(url.toString(), {
            method: "GET",
            headers,
            // EventSource has no timeout; we rely on the backend's emitter
            // timeout (~30 min) and the browser's auto-reconnect to refresh.
            signal: request.signal,
            cache: "no-store",
        });
    } catch {
        return new Response("upstream unreachable", { status: 502 });
    }

    if (!upstream.ok || !upstream.body) {
        return new Response(upstream.statusText || "upstream error", {
            status: upstream.status || 502,
        });
    }

    return new Response(upstream.body, {
        status: 200,
        headers: {
            "content-type": "text/event-stream; charset=utf-8",
            "cache-control": "no-store, no-transform",
            connection: "keep-alive",
            // Disable Vercel's proxy buffering so messages flush to the client
            // as they arrive instead of getting held until the response ends.
            "x-accel-buffering": "no",
        },
    });
}
