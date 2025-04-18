import cloneDeep from 'lodash.clonedeep';

import { SMILEY_LIKE, SMILEYS } from "smileys";
import {
    isScriptureBlock,
    isScriptureElement,
    isScriptureText,
    isScriptureVoidBlock,
    Scripture
} from "ui/control/richtexteditor/visual/scripture";
import { unhtmlEntitiesMinimal } from "util/html";
import { URL_PATTERN } from "util/url";

const URLS = new RegExp(URL_PATTERN, "ig");
const EMBEDDED = /<(?:iframe|img)[^>]+src=['"]([^'"]+)['"][^>]*>/ig;

export type TextReplacementFunction = (match: string, ...groups: string[]) => string;

export function smileyReplacer(removeEscapes: boolean = true): TextReplacementFunction {
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

export function replaceSmileys(text: string, removeEscapes?: boolean): string;
export function replaceSmileys(text: Scripture, removeEscapes?: boolean): Scripture;
export function replaceSmileys(text: string | Scripture, removeEscapes?: boolean): string | Scripture;
export function replaceSmileys(text: string | Scripture, removeEscapes: boolean = true): string | Scripture {
    if (typeof text === "string") {
        return text.replace(SMILEY_LIKE, smileyReplacer(removeEscapes))
    } else {
        return text.map(node => {
            if (isScriptureText(node)) {
                return {
                    ...node,
                    text: node.text.replace(SMILEY_LIKE, smileyReplacer(removeEscapes))
                };
            } else if (isScriptureElement(node) && isScriptureBlock(node) && !isScriptureVoidBlock(node)) {
                return {
                    ...node,
                    children: replaceSmileys(node.children as Scripture, removeEscapes)
                };
            } else {
                return cloneDeep(node);
            }
        });
    }
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
