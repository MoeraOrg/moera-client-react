import React from 'react';
import * as URI from 'uri-js';

import { dispatch, select } from "state/store-sagas";
import { jumpFar } from "state/navigation/actions";
import { getSetting } from "state/settings/selectors";
import * as Browser from "ui/browser";
import { rootUrl } from "util/url";
import { getCanonicalLocation, parseUniversalLocation } from "util/universal-url";

export function interceptLinkClick(event: MouseEvent | React.MouseEvent): void {
    if (event.currentTarget == null) {
        return;
    }
    const href = (event.currentTarget as HTMLElement).getAttribute("href");
    if (!href) {
        return;
    }
    const parts = URI.parse(URI.normalize(href));
    if (parts.scheme !== "https" || parts.host == null) {
        openLink(href);
        return;
    }

    if (["moera.page", window.location.host].includes(parts.host.toLowerCase())) {
        const uniParts = parseUniversalLocation(parts.path, parts.query, parts.fragment);
        if (uniParts != null) {
            const {name = null, rootLocation = null, path = null, query = null, hash = null} = uniParts;
            dispatch(jumpFar(name, rootLocation, path, query, hash));
            event.preventDefault();
            return;
        }
    }

    fetch(URI.serialize(parts), {
        method: "GET",
        headers: {
            "X-Accept-Moera": "1.0"
        },
        referrerPolicy: "no-referrer",
        signal: AbortSignal.timeout(1000)
    }).then(response => {
        const headers = response.headers;
        if (headers && headers.has("X-Moera")) {
            const rootPage = rootUrl(parts.scheme!, parts.host!, parts.port);
            const {name = null, rootLocation = null, path = null, query = null, hash = null} =
                getCanonicalLocation(rootPage, parts.path, parts.query, parts.fragment, headers.get("X-Moera"));
            dispatch(jumpFar(name, rootLocation, path, query, hash));
        } else {
            openLink(href);
        }
    }).catch(() => {
        openLink(href);
    });
    event.preventDefault();
}

function openLink(href: string): void {
    const openInNewWindow = getSetting(select(), "link.new-window") as boolean;
    if (!openInNewWindow || Browser.isAndroidApp()) {
        window.location.href = href;
    } else {
        window.open(href, "_blank");
    }
}
