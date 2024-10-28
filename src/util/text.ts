import { SMILEY_LIKE, SMILEYS } from "smileys";
import { unhtmlEntitiesMinimal } from "util/html";

const URLS = /https?:\/\/[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9]{1,6}\b(?:[-a-zA-Z0-9(!@:%_+.,;~#?&/=]*[-a-zA-Z0-9@:%_+~#&/=])?/ig;
const EMBEDDED = /<(?:iframe|img)[^>]+src=['"]([^'"]+)['"][^>]*>/ig;

function smileyReplacer(removeEscapes: boolean) {
    return (match: string, p1: string, p2: string) => {
        if (p2.startsWith("\\")) {
            if (!removeEscapes) {
                return match;
            }
            for (const smiley of SMILEYS) {
                if (smiley.regex.test(p2)) {
                    return p1 + p2.substring(1);
                }
            }
            return match;
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
    };
}

export function replaceSmileys(text: string, removeEscapes = true): string {
    return text.replace(SMILEY_LIKE, smileyReplacer(removeEscapes))
}

export function ellipsize(text: null | undefined, len: number): null;
export function ellipsize(text: string, len: number): string;
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
    const embedded = new Set(Array.from(text.matchAll(EMBEDDED), m => m[1]));
    return Array.from(text.matchAll(URLS), m => m[0])
        .map(url => unhtmlEntitiesMinimal(url))
        .filter(url => !embedded.has(url));
}
