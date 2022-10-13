import React from 'react';
import * as URI from 'uri-js';

import { Browser } from "ui/browser";
import { rootUrl } from "util/url";

export function interceptLinkClick(event: MouseEvent | React.MouseEvent, initFromLocation: any, newLocation: any,
                                   goToLocation: any) {
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
            const {rootLocation, path = null, query = null, hash = null} =
                Browser.getLocation(rootPage, parts.path, parts.query, parts.fragment, headers.get("X-Moera"));
            if (rootLocation != null && rootLocation !== Browser.getRootLocation()) {
                newLocation();
                initFromLocation(rootLocation, path, query, hash);
            } else {
                goToLocation(path, query, hash);
            }
        } else {
            window.location.href = href;
        }
    }).catch(() => {
        window.location.href = href;
    });
    event.preventDefault();
}
