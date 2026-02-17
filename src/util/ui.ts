import { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import * as Base64js from 'base64-js';

import { isTinyScreen } from "ui/hook";
import { isSpaces } from "util/misc";

export function randomId(len: number = 16): string {
    let buf = new Uint8Array(len);
    window.crypto.getRandomValues(buf);
    return Base64js.fromByteArray(buf);
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

export function insertTextOnNewLine(field: HTMLTextAreaElement | HTMLInputElement, text: string): void {
    const value = field.value;
    const start = field.selectionStart;

    if (start != null && start > 0 && value[start - 1] !== "\n") {
        text = "\n" + text;
    }
    insertText(field, text);
}

export function getTextSelection(field: HTMLTextAreaElement | HTMLInputElement): string {
    return field.value.slice(field.selectionStart ?? undefined, field.selectionEnd ?? undefined);
}

export function wrapSelection(field: HTMLTextAreaElement | HTMLInputElement, wrap: string, wrapEnd?: string): void {
    const selectionStart = field.selectionStart;
    const selectionEnd = field.selectionEnd;
    const selection = getTextSelection(field);
    insertText(field, wrap + selection + (wrapEnd ?? wrap));
    // Restore the selection around the previously selected text
    field.selectionStart = (selectionStart ?? 0) + wrap.length;
    field.selectionEnd = (selectionEnd ?? selectionStart ?? 0) + wrap.length;
}

export function wrapSelectionOnNewLine(
    field: HTMLTextAreaElement | HTMLInputElement, wrap: string, wrapEnd?: string
): void {
    if (wrapEnd == null) {
        wrapEnd = wrap;
    }

    const value = field.value;
    const start = field.selectionStart;

    if (start != null && start > 0 && value[start - 1] !== "\n") {
        wrap = "\n" + wrap;
    }
    wrapSelection(field, wrap, wrapEnd);
}

export function wrapSelectionLines(
    field: HTMLTextAreaElement | HTMLInputElement, wrapStart: string, wrap?: string
): void {
    const wrapEnd = wrap ?? wrapStart;
    const selectionStart = field.selectionStart;
    const selection = getTextSelection(field);
    const wrapped = wrapLines(selection, wrapStart, wrapEnd);
    insertText(field, wrapped);
    // Restore the selection around the previously selected text
    const startShift = wrapped.startsWith(wrapStart) ? wrapStart.length : 0;
    const endShift = wrapped.endsWith(wrapEnd) ? -wrapEnd.length : 0;
    field.selectionStart = (selectionStart ?? 0) + startShift;
    field.selectionEnd = (selectionStart ?? 0) + wrapped.length + endShift;
}

export function wrapSelectionLinesOnNewLine(
    field: HTMLTextAreaElement | HTMLInputElement, wrapStart: string, wrap?: string
): void {
    if (wrap == null) {
        wrap = wrapStart;
    }

    const value = field.value;
    const start = field.selectionStart;

    if (start != null && start > 0 && value[start - 1] !== "\n") {
        wrapStart = "\n" + wrapStart;
    }
    wrapSelectionLines(field, wrapStart, wrap);
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

export function wrapBlock(field: HTMLTextAreaElement | HTMLInputElement, wrap: string, wrapEnd?: string): void {
    if (wrapEnd == null) {
        wrapEnd = wrap;
    }

    const value = field.value;
    const start = field.selectionStart;

    if (start != null && start > 0 && value[start - 1] !== "\n") {
        wrap = "\n" + wrap;
    }

    const selection = getTextSelection(field);
    if (!selection || !selection.startsWith("\n")) {
        wrap += "\n";
    }
    if (!selection || !selection.endsWith("\n")) {
        wrapEnd = "\n" + wrapEnd;
    } else {
        wrapEnd += "\n";
    }
    wrapSelection(field, wrap, wrapEnd);
}

export function getPageHeaderHeight(): number {
    const tinyScreen = isTinyScreen();
    const mainMenu = document.getElementById("main-menu");
    const backBox = document.getElementById("back-box");
    const mainMenuHeight = mainMenu != null ? mainMenu.getBoundingClientRect().height : 0;
    const backBoxHeight = backBox != null ? backBox.getBoundingClientRect().height + (tinyScreen ? 30 : 10) : 0;
    return mainMenuHeight + backBoxHeight;
}

export function getPageFooterHeight(): number {
    return isTinyScreen() ? document.getElementById("bottom-menu")?.getBoundingClientRect().height ?? 0 : 0;
}

export function isElementVisible(element: Element, threshold: number = 0): boolean {
    const rect = element.getBoundingClientRect();
    const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    return !(rect.bottom < threshold || rect.top + threshold >= viewHeight);
}

export function isElementCompletelyVisible(element: Element): boolean {
    const rect = element.getBoundingClientRect();
    const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    if (viewHeight <= rect.height) {
        return rect.bottom >= 0 && rect.top < viewHeight;
    } else {
        return rect.bottom >= 0 && rect.bottom < viewHeight && rect.top >= 0 && rect.top < viewHeight;
    }
}

export function isElementScrollableX(element: Element): boolean {
    const ox = getComputedStyle(element).overflowX;
    const cssScrollable = ox === "auto" || ox === "scroll" || ox === "overlay";
    // > 1 handles 1px rounding / zoom weirdness
    return cssScrollable && (element.scrollWidth - element.clientWidth > 1);
}

export function createPortalIfNeeded(
    children: ReactNode, container?: Element | DocumentFragment | null, key?: null | string
) {
    if (container == null) {
        return children;
    }
    return ReactDOM.createPortal(children, container, key);
}
