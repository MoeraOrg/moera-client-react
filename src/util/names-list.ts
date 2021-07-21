import regexEscape from 'escape-string-regexp';
import { AvatarImage } from "api/node/api-types";

const ARRANGEMENT_DEPTH = 5;

export interface NameListItem {
    nodeName: string | null;
    fullName?: string | null | undefined;
    avatar?: AvatarImage | null;
}

export function namesListQuery(list: NameListItem[], query: string | null): NameListItem[] {
    if (query == null) {
        return list.slice();
    }
    const regexes = query.trim().split(/\s+/).map(prefix => RegExp("(?:^|\\s)" + regexEscape(prefix), "ig"));
    return list.filter(item => itemMatch(item, regexes));
}

function itemMatch(item: NameListItem, regexes: RegExp[]): boolean {
    const nodeName = item.nodeName ?? "";
    const haystack = item.fullName ? item.fullName + " " + nodeName: nodeName;
    const allFound = regexes.every(regex => regex.test(haystack));
    if (!allFound) {
        return false;
    }
    if (regexes.length <= 1) {
        return true;
    }
    regexes.forEach(regex => regex.lastIndex = 0);
    const matches = regexes.map(regex => Array.from(haystack.matchAll(regex), m => m.index));
    return hasArrangement(matches);
}

function hasArrangement(values: (number | undefined)[][]) {
    const size = Math.min(values.length, ARRANGEMENT_DEPTH);
    const indexes = Array(size).fill(0);
    const used = new Set();
    while (true) {
        used.clear();
        for (let i = 0; i < size; i++) {
            const value = values[i][indexes[i]];
            if (used.has(value)) {
                break;
            }
            used.add(value);
        }
        if (used.size === size) {
            return true;
        }
        for (let i = 0; i < size; i++) {
            indexes[i]++;
            if (indexes[i] < values[i].length) {
                break;
            }
            if (i === size - 1) {
                return false;
            }
            indexes[i] = 0;
        }
    }
}
