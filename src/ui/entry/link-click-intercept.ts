import React from 'react';
import * as URI from 'uri-js';

import { goToLocation, initFromLocation, newLocation } from "state/navigation/actions";
import { Browser } from "ui/browser";
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
    fetch(URI.serialize(parts), {
        method: "GET",
        // FIXME without X-Accept-Moera header this request redirects to web.moera.org and doesn't return X-Moera
        referrerPolicy: "no-referrer"
    }).then(response => {
        const headers = response.headers;
        if (headers && headers.has("X-Moera")) {
            const rootPage = rootUrl(parts.scheme!, parts.host!, parts.port);
            const {name, rootLocation, path = null, query = null, hash = null} =
                Browser.getLocation(rootPage, parts.path, parts.query, parts.fragment, headers.get("X-Moera"));
            if (rootLocation != null && rootLocation !== Browser.getRootLocation()) {
                store.dispatch(newLocation());
                store.dispatch(initFromLocation(name ?? null, rootLocation, path, query, hash));
            } else {
                store.dispatch(goToLocation(path, query, hash));
            }
        } else {
            window.location.href = href;
        }
    }).catch(() => {
        window.location.href = href;
    });
    event.preventDefault();
}
