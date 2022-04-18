import * as Base64js from 'base64-js';
import cloneDeep from 'lodash.clonedeep';

import { NodeName } from "api";
import { ClientState } from "state/state";

const DIGITS = /^\d+$/;

export function mentionName(name: string | null | undefined, fullName?: string | null): string {
    if (!name) {
        return "";
    }
    return "@" + NodeName.shorten(name) + (fullName ? `[${fullName}]` : "");
}

export function shortGender(gender: string | null): string | null {
    if (gender == null) {
        return null;
    }
    switch (gender.toLowerCase()) {
        case "male":
            return "m.";
        case "female":
            return "f.";
        default:
            return gender;
    }
}

export function atOwner(state: ClientState): string {
    const ownerName = state.owner.name;
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

export function now(): number {
    return Math.floor(Date.now() / 1000);
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
    field.selectionEnd = (selectionEnd ?? selectionStart ?? 0)+ wrap.length;
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

export function cloneOperations<T extends Partial<Record<string, string>>>
                (operations: Record<string, string | null | undefined> | null | undefined, defaults: T): T {
    if (operations == null) {
        return cloneDeep(defaults);
    }

    const result: Partial<Record<string, string>> = {};
    Object.getOwnPropertyNames(defaults).forEach(key => result[key] = operations[key] ?? defaults[key]);
    return result as T;
}
