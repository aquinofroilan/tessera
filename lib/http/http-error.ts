export class HttpError extends Error {
    readonly status: number;
    readonly statusText: string;
    readonly url: string;
    readonly body: unknown;

    constructor(args: { status: number; statusText: string; url: string; body: unknown; message?: string }) {
        super(args.message ?? `Backend request failed: ${args.status} ${args.statusText}`);
        this.name = "HttpError";
        this.status = args.status;
        this.statusText = args.statusText;
        this.url = args.url;
        this.body = args.body;
    }

    get isClientError(): boolean {
        return this.status >= 400 && this.status < 500;
    }

    get isServerError(): boolean {
        return this.status >= 500;
    }
}

export class HttpTimeoutError extends Error {
    readonly url: string;
    readonly timeoutMs: number;

    constructor(url: string, timeoutMs: number) {
        super(`Backend request to ${url} timed out after ${timeoutMs}ms`);
        this.name = "HttpTimeoutError";
        this.url = url;
        this.timeoutMs = timeoutMs;
    }
}
