import * as URI from 'uri-js';

import { NodeName } from "api";
import { rootUrl, urlWithParameters } from "util/url";

export interface DocumentLocation {
    name?: string | null;
    rootLocation?: string;
    path?: string | null;
    query?: string | null;
    hash?: string | null;
}

export function getCanonicalLocation(
    rootLocation: string, path: string | null | undefined, query: string | null | undefined,
    hash: string | null | undefined, header: string | null
): DocumentLocation {
    let name: string | null = null;
    if (header) {
        header
            .split(/\s*;\s*/)
            .filter(s => s.includes("="))
            .map(s => s.split("="))
            .map(([name, value]) => ([name.toLowerCase(), decodeURIComponent(value)]))
            .forEach(([name, value]) => {
                let components;
                switch(name) {
                    case "name":
                        name = decodeURIComponent(value);
                        break;
                    case "root":
                        components = URI.parse(value);
                        rootLocation += components.path || "";
                        break;

                    case "page":
                        components = URI.parse(value);
                        path = components.path || "";
                        query = components.query || "";
                        break;

                    default:
                        break;
                }
            });
    }

    return {name, rootLocation, path, query, hash};
}

export function parseUniversalLocation(
    path: string | null | undefined, query: string | null | undefined, hash: string | null | undefined
): DocumentLocation | null {
    if (!path) {
        return null;
    }
    if (path.startsWith('/')) {
        path = path.substring(1);
    }
    if (path.endsWith('/')) {
        path = path.substring(0, path.length - 1);
    }
    if (path === '') {
        return null;
    }

    const dirs = path.split('/');
    if (!dirs[0].startsWith('@')) {
        return null;
    }

    const components: DocumentLocation = {};

    if (dirs[0].length > 1) {
        components.name = NodeName.expand(decodeURIComponent(dirs[0].substring(1)));
    }

    let scheme: string | undefined = undefined;
    let host: string | undefined = undefined;
    let port: number | string | undefined = undefined;

    if (dirs.length > 1 && dirs[1] !== '~') {
        const parts = dirs[1].split(':');
        let i = 0;
        if (!parts[i].includes('.')) {
            scheme = parts[i++];
        }
        if (i < parts.length) {
            host = parts[i++];
        }
        if (i < parts.length) {
            port = parts[i++];
        }
    }

    if (host) {
        components.rootLocation = rootUrl(scheme ?? "https", host, port);
    }

    path = dirs.slice(2).join('/');
    if (path === '') {
        path = '/';
    }
    components.path = path;

    components.query = query;
    components.hash = hash;

    return components;
}

export function universalLocation(
    clientUrl: string | null, nodeName: string | null | undefined, nodeRoot: string | null | undefined,
    location: string, readId?: string | null
): string {
    let url = (clientUrl ?? "https://moera.page") + "/@";
    if (nodeName != null) {
        url += encodeURIComponent(NodeName.shorten(nodeName));
    }
    url += "/";
    if (nodeRoot != null) {
        const {scheme, host, port} = URI.parse(nodeRoot);
        if (scheme && scheme !== "https") {
            url += scheme + ":";
        }
        url += host;
        if (port && port !== 443 && port !== "443") {
            url += ":" + port;
        }
    } else {
        url += "~";
    }
    if (location.startsWith("/moera")) {
        location = location.substring(6);
    }
    url += location;
    if (readId) {
        url = urlWithParameters(url, {read: readId});
    }
    return url;
}

export interface DocumentLocator {
    nodeName?: string | null;
    href?: string | null;
}

export function toDocumentLocator(location: DocumentLocation): DocumentLocator {
    let href = "/";
    if (location.path != null) {
        href += location.path;
    }
    if (location.query != null) {
        href += location.query;
    }
    if (location.hash != null) {
        href += location.hash;
    }
    return {nodeName: location.name, href};
}

export function toDocumentLocation(locator: DocumentLocator): DocumentLocation {
    const {nodeName, href} = locator;

    if (href == null) {
        return {name: nodeName};
    }

    let {path, query, fragment: hash} = URI.parse(href);
    if (query) {
        query = `?${query}`;
    }
    if (hash) {
        hash = `#${hash}`;
    }

    return {name: nodeName, path, query, hash};
}
