import * as URI from 'uri-js';

export const URL_PATTERN = "https?://[-a-zA-Z0-9@:%._+~#=]{1,256}.[a-zA-Z0-9]{1,6}\\b(?:[-a-zA-Z0-9(!@:%_+.,;~#?&/=]*[-a-zA-Z0-9@:%_+~#&/=])?";

export function normalizeUrl(url: null | undefined): null;
export function normalizeUrl(url: string): string;
export function normalizeUrl(url: string | null | undefined): string | null;
export function normalizeUrl(url: string | null | undefined): string | null {
    if (url == null) {
        return null;
    }
    return url.endsWith("/") ? url.substring(0, url.length - 1) : url;
}

export function urlWithParameters(url: string,
                                  parameters: {[name: string]: string | number | boolean | null | undefined}): string {
    let query = "";
    for (let name in parameters) {
        if (parameters.hasOwnProperty(name)) {
            const value = parameters[name];
            if (value != null) {
                query += (query === "" ? "" : "&") + name + "=" + encodeURIComponent(value);
            }
        }
    }
    if (query === "") {
        return url;
    }
    return url + (url.indexOf("?") < 0 ? "?" : "&") + query;
}

export function urlWithoutParameters(url: string, parameters: string[]): string {
    if (parameters.length === 0) {
        return url;
    }
    const components = URI.parse(url);
    if (!components.query) {
        return url;
    }
    let query: string[] = [];
    for (let param of components.query.split("&")) {
        const [name] = param.split("=");
        if (!parameters.includes(name)) {
            query.push(param);
        }
    }
    return URI.serialize({...components, query: query.join("&")});
}

export function rootUrl(scheme: string, host: string, port?: number | string | null): string {
    if (!scheme.endsWith(":")) {
        scheme += ":";
    }
    let rootLocation = `${scheme}//${host}`;
    if (port) {
        rootLocation += `:${port}`;
    }
    return rootLocation;
}

export function ut(strings: TemplateStringsArray, ...args: any[]): string {
    const all = [];
    let i = 0;
    while (i < strings.length || i < args.length) {
        if (i < strings.length) {
            all.push(strings[i]);
        }
        if (i < args.length) {
            all.push(encodeURIComponent(args[i]));
        }
        i++;
    }
    return all.join("");
}

export function toWsUrl(url: string): string {
    const components = URI.parse(url);
    components.scheme = components.scheme != null && components.scheme.toLowerCase() === "https" ? "wss" : "ws";
    return URI.serialize(components);
}

export function nodeUrlToLocation(url: string | null): string | null {
    return url != null && url.endsWith("/moera") ? url.substring(0, url.length - 6) : url;
}

export function nodeUrlToEvents(url: string | null): string | null {
    return url != null ? toWsUrl(normalizeUrl(url) + "/api/events") : null;
}

export function hasSchemeOrDomain(url: string, prefix: string): boolean {
    if (prefix.endsWith(":")) {
        return url.startsWith(prefix);
    }
    const components = URI.parse(url.toLowerCase());
    if ((components.scheme !== "http" && components.scheme !== "https") || components.host == null) {
        return false;
    }
    return components.host === prefix || components.host.endsWith("." + prefix);

}

export function getSchemeOrDomain(url: string | null | undefined): string | null {
    if (!url) {
        return null;
    }
    if (url.indexOf(":") < 0) {
        return null;
    }
    const components = URI.parse(url.toLowerCase());
    if (!components.scheme) {
        return null;
    }
    if (components.scheme !== "http" && components.scheme !== "https") {
        return components.scheme + ":";
    }
    if (!components.host) {
        return null;
    }
    return components.host.startsWith("www.") ? components.host.substring(4) : components.host;
}

const URL_TEST_PATTERN = new RegExp("^" + URL_PATTERN + "$", "i");

export const isUrl = (text: string): boolean =>
    URL_TEST_PATTERN.test(text);
