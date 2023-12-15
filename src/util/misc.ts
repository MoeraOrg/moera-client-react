// @ts-ignore
import charCategory from 'general-category';

const DIGITS = /^\d+$/;
const EMAIL = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export function range(length: number): number[] {
    return [...Array(length).keys()];
}

export function parseBool(val: boolean | string): boolean {
    if (typeof val === "boolean") {
        return val;
    }
    const ival = val.toLowerCase();
    return ival === "yes" || ival === "true" || ival === "1";
}

export function isNumericString(value: string | null): boolean {
    return value != null && value.match(DIGITS) != null;
}

export function isNumber(value: unknown): value is number {
    return typeof value === "number" && isFinite(value);
}

export function isBoolean(value: unknown): value is boolean {
    return typeof value === "boolean";
}

export function isSpaces(value: string | null | undefined): boolean {
    if (value == null) {
        return true;
    }
    for (const c of value) {
        switch (charCategory(c)) {
            case "Cc":
            case "Zl":
            case "Zp":
            case "Zs":
                break;
            default:
                return false;
        }
    }
    return true;
}

export function isEmail(value: string | null | undefined): boolean {
    if (value == null) {
        return false;
    }
    return value.match(EMAIL) != null;
}

export function now(): number {
    return Math.floor(Date.now() / 1000);
}

export function commaSeparatedFlags(flags: Partial<Record<string, boolean>>): string | null {
    const names = Object.entries(flags).filter(([name, value]) => value != null).map(([name]) => name);
    return names.length > 0 ? names.join(',') : null;
}
