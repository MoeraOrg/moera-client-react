import * as Base64js from 'base64-js';
import * as URI from 'uri-js';

import { NodeName } from "api";
import { isNamingNameLatest } from "state/naming/selectors";

export function normalizeUrl(url) {
    return url.endsWith("/") ? url.substring(0, url.length - 1) : url;
}

export function urlWithParameters(url, parameters) {
    let query = "";
    for (let name in parameters) {
        if (parameters.hasOwnProperty(name) && parameters[name] != null) {
            query += (query === "" ? "" : "&") + name + "=" + encodeURIComponent(parameters[name]);
        }
    }
    if (query === "") {
        return url;
    }
    return url + (url.indexOf("?") < 0 ? "?" : "&") + query;
}

export function toWsUrl(url) {
    const components = URI.parse(url);
    components.scheme = components.scheme.toLowerCase() === "https" ? "wss" : "ws";
    return URI.serialize(components);
}

export function nodeUrlToLocation(url) {
    return url != null && url.endsWith("/moera") ? url.substring(0, url.length - 6) : url;
}

export function nodeUrlToEvents(url) {
    return url != null ? toWsUrl(normalizeUrl(url) + "/api/events") : null;
}

export function mentionName(state, name) {
    return name ? "@" + NodeName.shorten(name, isNamingNameLatest(state, name)) : "";
}

export function atOwner(state) {
    const ownerName = state.owner.name;
    return ownerName ? " @ " + NodeName.shorten(ownerName, isNamingNameLatest(state, ownerName)) : "";
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
