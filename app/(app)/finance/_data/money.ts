import type { Money } from "./types";

const fractionLen = (v: string) => {
    const i = v.indexOf(".");
    return i === -1 ? 0 : v.length - i - 1;
};

const toMinor = (v: string, scale: number): bigint => {
    const t = v.trim();
    const neg = t.startsWith("-");
    const [intPart, frac = ""] = t.replace(/^[-+]/, "").split(".");
    const padded = (frac + "0".repeat(scale)).slice(0, scale);
    const n = BigInt((intPart || "0") + padded);
    return neg ? -n : n;
};

const fromMinor = (n: bigint, scale: number): Money => {
    const neg = n < 0n;
    const digits = (neg ? -n : n).toString().padStart(scale + 1, "0");
    const cut = digits.length - scale;
    const intPart = digits.slice(0, cut);
    const frac = scale > 0 ? `.${digits.slice(cut)}` : "";
    return `${neg ? "-" : ""}${intPart}${frac}`;
};

export const sumMoney = (values: Money[]): Money => {
    const scale = values.reduce((m, v) => Math.max(m, fractionLen(v)), 0);
    const total = values.reduce((acc, v) => acc + toMinor(v, scale), 0n);
    return fromMinor(total, scale);
};

export const subtractMoney = (a: Money, b: Money): Money => {
    const scale = Math.max(fractionLen(a), fractionLen(b));
    return fromMinor(toMinor(a, scale) - toMinor(b, scale), scale);
};
