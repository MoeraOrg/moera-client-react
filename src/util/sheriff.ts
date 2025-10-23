import { SheriffMark } from "api";
import { findPreferredLanguage } from "i18n";

interface SheriffControlled {
    sheriffs?: string[] | null;
    sheriffMarks?: SheriffMark[] | null;
}

export function isSheriffGoverned(
    object: SheriffControlled | null | undefined,
    sheriffName: string | null | undefined
): boolean {
    return sheriffName != null && (object?.sheriffs?.includes(sheriffName) ?? false);
}

export function isSheriffMarked(
    object: SheriffControlled | null | undefined,
    sheriffName: string | null | undefined
): boolean {
    return sheriffName != null && object?.sheriffMarks?.find(sm => sm.sheriffName === sheriffName) != null;
}

export function deserializeSheriffs(value: string | null | undefined): string[] {
    if (value == null || value.trim().length === 0) {
        return [];
    }
    return value.split(",").map(name => name.trim());
}

export function serializeSheriffs(sheriffs: string[]): string {
    return sheriffs.join(",");
}

export const getSheriffPolicyHref = (lang: string): string =>
    `https://moera.org/license/sheriff-policy-${getSheriffPolicyLanguage(lang)}.html`;

function getSheriffPolicyLanguage(lang: string): string {
    if (lang === "auto") {
        lang = findPreferredLanguage();
    }
    return ["en", "ru", "uk"].includes(lang) ? lang : "en";
}
