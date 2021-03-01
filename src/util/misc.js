import * as Base64js from 'base64-js';

import { NodeName } from "api";

export function mentionName(name, fullName) {
    if (!name) {
        return "";
    }
    return "@" + NodeName.shorten(name) + (fullName ? `[${fullName}]` : "");
}

export function shortGender(gender) {
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

export function atOwner(state) {
    const ownerName = state.owner.name;
    return ownerName ? " @ " + NodeName.shorten(ownerName) : "";
}

export function range(length) {
    return [...Array(length).keys()];
}

export function randomId() {
    let buf = new Uint8Array(16);
    window.crypto.getRandomValues(buf);
    return Base64js.fromByteArray(buf);
}

export function parseBool(val) {
    if (typeof val === "boolean") {
        return val;
    }
    const ival = val.toLowerCase();
    return ival === "yes" || ival === "true" || ival === "1";
}

export function now() {
    return Math.floor(Date.now() / 1000);
}

export function hasWindowSelection() {
    if (document.selection && document.selection.createRange) {
        return document.selection.createRange().htmlText.length > 0;
    } else if (window.getSelection) {
        const selection = window.getSelection();
        return selection.rangeCount > 0 && !selection.getRangeAt(0).collapsed;
    }
    return false;
}

export function getWindowSelectionHtml() {
    if (document.selection && document.selection.createRange) {
        return document.selection.createRange().htmlText;
    } else if (window.getSelection) {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const clonedSelection = selection.getRangeAt(0).cloneContents();
            const div = document.createElement("div");
            div.appendChild(clonedSelection);
            return div.innerHTML;
        }
    }
    return null;
}

export function getPageHeaderHeight() {
    const mainMenu = document.getElementById("main-menu");
    const header = document.getElementById("page-header");
    const mainMenuHeight = mainMenu != null ? mainMenu.getBoundingClientRect().height : 0;
    const headerHeight = header != null ? header.getBoundingClientRect().height : 0;
    return mainMenuHeight + headerHeight;
}
