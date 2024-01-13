import React from 'react';
import * as URI from 'uri-js';

import { initFromLocation, initFromNodeLocation, newLocation } from "state/navigation/actions";
import * as Browser from "ui/browser";
import { rootUrl } from "util/url";
import store from "state/store";

export function interceptLinkClick(event: MouseEvent | React.MouseEvent) {
    if (event.currentTarget == null) {
        return;
    }
    const href = (event.currentTarget as HTMLElement).getAttribute("href");
    if (!href) {
        return;
    }
    const parts = URI.parse(URI.normalize(href));
    if (parts.scheme !== "https" || parts.host == null) {
        return;
    }

    if (parts.host.toLowerCase() === "moera.page") {
        const uniParts = Browser.parseUniversalLocation(parts.path, parts.query, parts.fragment);
        if (uniParts != null) {
            const {name = null, rootLocation, path = null, query = null, hash = null} = uniParts;
            jump(name, rootLocation, path, query, hash);
            event.preventDefault();
            return;
        }
    }

    fetch(URI.serialize(parts), {
        method: "GET",
        headers: {
            "X-Accept-Moera": "1.0"
        },
        referrerPolicy: "no-referrer"
    }).then(response => {
        const headers = response.headers;
        if (headers && headers.has("X-Moera")) {
            const rootPage = rootUrl(parts.scheme!, parts.host!, parts.port);
            const {name = null, rootLocation, path = null, query = null, hash = null} =
                Browser.getLocation(rootPage, parts.path, parts.query, parts.fragment, headers.get("X-Moera"));
            jump(name, rootLocation, path, query, hash);
        } else {
            window.location.href = href;
        }
    }).catch(() => {
        window.location.href = href;
    });
    event.preventDefault();
}

function jump(
    nodeName: string | null, rootLocation: string | null | undefined, path: string | null, query: string | null,
    hash: string | null
) {
    if (rootLocation != null) {
        store.dispatch(newLocation());
        store.dispatch(initFromLocation(nodeName, rootLocation, path, query, hash));
    } else if (nodeName != null) {
        store.dispatch(initFromNodeLocation(nodeName, path, query, hash, null));
    }
}
