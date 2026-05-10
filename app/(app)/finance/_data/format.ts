import type { Money } from "./types";

const moneyFormatters = new Map<string, Intl.NumberFormat>();

function moneyFormatter(currencyCode: string) {
    if (!currencyCode) {
        return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
    }
    let formatter = moneyFormatters.get(currencyCode);
    if (!formatter) {
        formatter = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currencyCode,
            maximumFractionDigits: 2,
        });
        moneyFormatters.set(currencyCode, formatter);
    }
    return formatter;
}

export function formatMoney(value: Money, currencyCode: string) {
    return moneyFormatter(currencyCode).format(Number(value));
}

export function formatMoneyShort(value: Money, currencyCode: string) {
    const n = Number(value);
    const abs = Math.abs(n);
    const sign = n < 0 ? "-" : "";
    const symbol = currencyCode === "USD" ? "$" : "";
    if (abs >= 1_000_000) return `${sign}${symbol}${(abs / 1_000_000).toFixed(1)}M`;
    if (abs >= 10_000) return `${sign}${symbol}${(abs / 1_000).toFixed(0)}k`;
    if (abs >= 1_000) return `${sign}${symbol}${(abs / 1_000).toFixed(1)}k`;
    return formatMoney(value, currencyCode);
}

export function formatDelta(delta: number) {
    const sign = delta >= 0 ? "+" : "";
    return `${sign}${(delta * 100).toFixed(1)}%`;
}

export function formatDateShort(iso: string) {
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(iso));
}
