import { SMILEY_LIKE, SMILEYS } from "smileys";

const URLS = /https?:\/\/[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9]{1,6}\b(?:[-a-zA-Z0-9()!@:%_+.~#?&/=]*[-a-zA-Z0-9@:%_+~#&/=])?/ig;

export function replaceSmileys(text: string, removeEscapes = true): string {
    if (text == null) {
        return text;
    }
    return text.replace(SMILEY_LIKE, (match, p1, p2) => {
        if (p2.startsWith("\\")) {
            return removeEscapes ? p1 + p2.substring(1) : match;
        }
        for (const smiley of SMILEYS) {
            if (smiley.repeatGroup) {
                const m = p2.match(smiley.regex);
                if (m) {
                    const count = m[smiley.repeatGroup] ? m[smiley.repeatGroup].length : 1;
                    return p1 + String.fromCodePoint(smiley.emoji).repeat(count);
                }
            } else {
                if (smiley.regex.test(p2)) {
                    return p1 + String.fromCodePoint(smiley.emoji);
                }
            }
        }
        return match;
    })
}

export function ellipsize(text: string | null | undefined, len: number): string | null {
    if (text == null) {
        return null;
    }
    if (text.length <= len) {
        return text;
    }
    return text.substring(0, len) + "\u2026";
}

export function extractUrls(text: string | null | undefined): string[] {
    if (text == null) {
        return [];
    }
    return Array.from(text.matchAll(URLS), m => m[0]);
}
