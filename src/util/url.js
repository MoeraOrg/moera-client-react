import * as URI from 'uri-js';

export function normalizeUrl(url) {
    if (url == null) {
        return null;
    }
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

export function rootUrl(scheme, host, port) {
    if (!scheme.endsWith(":")) {
        scheme += ":";
    }
    let rootLocation = `${scheme}//${host}`;
    if (port) {
        rootLocation += `:${port}`;
    }
    return rootLocation;
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
