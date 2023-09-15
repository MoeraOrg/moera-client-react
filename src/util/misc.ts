import * as Base64js from 'base64-js';
// @ts-ignore
import charCategory from 'general-category';
import { TFunction } from 'i18next';

import { NodeName } from "api";
import { ClientState } from "state/state";
import { getOwnerName } from "state/node/selectors";
import { NameDisplayMode } from "ui/types";

const DIGITS = /^\d+$/;

export function mentionName(name: string | null | undefined, fullName?: string | null): string {
    if (!name) {
        return "";
    }
    return "@" + NodeName.shorten(name) + (fullName ? `[${fullName}]` : "");
}

export function formatFullName(nodeName: string | null | undefined, fullName: string | null | undefined,
                               mode: NameDisplayMode): string {
    const name = nodeName != null ? NodeName.shorten(nodeName) : null;
    switch (mode) {
        case "name":
            return name || "?";
        case "full-name":
            return fullName || name || "?";
        case "both":
            return fullName ? `${fullName} (${name || "?"})` : (name || "?");
        default:
            return "?";
    }
}

export function longGender(gender: any, t: TFunction): string {
    if (typeof gender === "string") {
        gender = gender.toLowerCase();
        return gender === "male" || gender === "female" ? t(gender) : gender;
    }
    return "";
}

export function shortGender(gender: string | null, t: TFunction): string | null {
    if (gender == null) {
        return null;
    }
    switch (gender.toLowerCase()) {
        case "male":
            return t("male-short");
        case "female":
            return t("female-short");
        default:
            return gender;
    }
}

export function atOwner(state: ClientState): string {
    const ownerName = getOwnerName(state);
    return ownerName ? " @ " + NodeName.shorten(ownerName) : "";
}

export function range(length: number): number[] {
    return [...Array(length).keys()];
}

export function randomId(): string {
    let buf = new Uint8Array(16);
    window.crypto.getRandomValues(buf);
    return Base64js.fromByteArray(buf);
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

export function now(): number {
    return Math.floor(Date.now() / 1000);
}

export function commaSeparatedFlags(flags: Partial<Record<string, boolean>>): string | null {
    const names = Object.entries(flags).filter(([name, value]) => value != null).map(([name]) => name);
    return names.length > 0 ? names.join(',') : null;
}

export function hasWindowSelection(): boolean {
    if (window.getSelection) {
        const selection = window.getSelection();
        return selection != null && selection.rangeCount > 0 && !selection.getRangeAt(0).collapsed;
    }
    return false;
}

export function getWindowSelectionHtml(): string | null {
    if (window.getSelection) {
        const selection = window.getSelection();
        if (selection != null && selection.rangeCount > 0) {
            const clonedSelection = selection.getRangeAt(0).cloneContents();
            const div = document.createElement("div");
            div.appendChild(clonedSelection);
            return div.innerHTML;
        }
    }
    return null;
}

function insertTextFirefox(field: HTMLTextAreaElement | HTMLInputElement, text: string): void {
    // Found on https://www.everythingfrontend.com/posts/insert-text-into-textarea-at-cursor-position.html
    field.setRangeText(text, field.selectionStart || 0, field.selectionEnd || 0, "end");
    field.dispatchEvent(new InputEvent("input", {
        data: text,
        inputType: 'insertText',
    }));
}

export function insertText(field: HTMLTextAreaElement | HTMLInputElement, text: string): void {
    const document = field.ownerDocument;
    const initialFocus = document.activeElement;
    if (initialFocus !== field) {
        field.focus();
    }
    if (!document.execCommand("insertText", false, text)) {
        insertTextFirefox(field, text);
    }
    if (initialFocus === document.body) {
        field.blur();
    }
    else if (initialFocus instanceof HTMLElement && initialFocus !== field) {
        initialFocus.focus();
    }
}

export function getTextSelection(field: HTMLTextAreaElement | HTMLInputElement): string {
    return field.value.slice(field.selectionStart ?? undefined, field.selectionEnd ?? undefined);
}

export function wrapSelection(field: HTMLTextAreaElement | HTMLInputElement, wrap: string, wrapEnd?: string): void {
    const selectionStart = field.selectionStart;
    const selectionEnd = field.selectionEnd;
    const selection = getTextSelection(field);
    insertText(field, wrap + selection + (wrapEnd ?? wrap));
    // Restore the selection around the previously-selected text
    field.selectionStart = (selectionStart ?? 0) + wrap.length;
    field.selectionEnd = (selectionEnd ?? selectionStart ?? 0) + wrap.length;
}

export function wrapSelectionLines(field: HTMLTextAreaElement | HTMLInputElement,
                                   wrapStart: string, wrap?: string): void {
    const wrapEnd = wrap ?? wrapStart;
    const selectionStart = field.selectionStart;
    const selection = getTextSelection(field);
    const wrapped = wrapLines(selection, wrapStart, wrapEnd);
    insertText(field, wrapped);
    // Restore the selection around the previously-selected text
    const startShift = wrapped.startsWith(wrapStart) ? wrapStart.length : 0;
    const endShift = wrapped.endsWith(wrapEnd) ? -wrapEnd.length : 0;
    field.selectionStart = (selectionStart ?? 0) + startShift;
    field.selectionEnd = (selectionStart ?? 0) + wrapped.length + endShift;
}

function wrapLines(s: string, wrapStart: string, wrapEnd: string): string {
    const lines = s.split("\n");
    for (let i = 0; i < lines.length; i++) {
        let begin = 0;
        while (isSpaces(lines[i][begin]) && begin < lines[i].length) {
            begin++;
        }
        if (begin >= lines[i].length) {
            if (lines.length === 1) {
                lines[i] = wrapStart + wrapEnd + lines[i];
            }
            continue;
        }
        let end = lines[i].length - 1;
        while (isSpaces(lines[i][end]) && end > begin) {
            end--;
        }
        lines[i] = lines[i].substring(0, begin) + wrapStart + lines[i].substring(begin, end + 1) + wrapEnd
            + lines[i].substring(end + 1);
    }
    return lines.join("\n");
}

export function getPageHeaderHeight(): number {
    const mainMenu = document.getElementById("main-menu");
    const header = document.getElementById("page-header");
    const mainMenuHeight = mainMenu != null ? mainMenu.getBoundingClientRect().height : 0;
    const headerHeight = header != null ? header.getBoundingClientRect().height : 0;
    return mainMenuHeight + headerHeight;
}

export function getFeedHeaderHeight(): number {
    const headerHeight = getPageHeaderHeight();
    const feedTitle = document.getElementById("feed-title");
    const feedTitleHeight = feedTitle != null ? feedTitle.getBoundingClientRect().height : 0;
    return headerHeight + feedTitleHeight;
}
