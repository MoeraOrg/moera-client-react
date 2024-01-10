import * as URI from 'uri-js';
import { rootUrl } from "util/url";
import { randomId } from "util/ui";

type UserAgent = "firefox" | "chrome" | "opera" | "yandex" | "brave" | "vivaldi" | "dolphin" | "unknown";
type UserAgentOs = "android" | "ios" | "unknown";

interface DocumentLocation {
    name?: string | null;
    rootLocation?: string;
    path?: string | null;
    query?: string | null;
    hash?: string | null;
}

export const clientId: string = randomId();
export const [userAgent, userAgentOs] = initUserAgent();
export const androidAppFlavor: AndroidAppFlavor | null = initAndroidAppFlavor();

function initUserAgent(): [UserAgent, UserAgentOs] {
    let userAgent: UserAgent = "unknown";
    let userAgentOs: UserAgentOs = "unknown";
    if (navigator.userAgent.includes("Firefox")) {
        userAgent = "firefox";
    } else if (navigator.userAgent.includes("Opera")) {
        userAgent = "opera";
    } else if (navigator.userAgent.includes("Chrome")) {
        if (navigator.userAgent.includes("YaBrowser")) {
            userAgent = "yandex";
        } else if (navigator.userAgent.includes("Brave")) {
            userAgent = "brave";
        } else if (navigator.userAgent.includes("Vivaldi")) {
            userAgent = "vivaldi";
        } else {
            userAgent = "chrome";
        }
    } else if (navigator.userAgent.includes("Dolphin")) {
        userAgent = "dolphin";
    }

    if (navigator.userAgent.includes("Android")) {
        userAgentOs = "android";
    } else if (navigator.userAgent.includes("iPhone")) {
        userAgentOs = "ios";
    }
    return [userAgent, userAgentOs];
}

function initAndroidAppFlavor(): AndroidAppFlavor | null {
    if (window.Android) {
        if (window.Android.getFlavor) {
            return window.Android.getFlavor();
        } else if (window.Android.isDonationsEnabled) {
            return window.Android.isDonationsEnabled() ? "apk" : "google-play";
        } else {
            return "google-play";
        }
    }
    return null;
}

export const isDevMode = (): boolean =>
    !process.env.NODE_ENV || process.env.NODE_ENV === "development";

export const isTinyScreen = (): boolean =>
    window.screen.width <= 575;

export const isTouchScreen = (): boolean =>
    userAgentOs === "android" || userAgentOs === "ios";

export const isMobile = (): boolean =>
    userAgentOs === "android" || userAgentOs === "ios";

export const isAndroidApp = (): boolean =>
    androidAppFlavor != null;

export const isAndroidBrowser = (): boolean =>
    userAgentOs === "android" && !isAndroidApp();

export const isAndroidGooglePlay = (): boolean =>
    androidAppFlavor === "google-play";

export function disableBodyScroll(): void {
    document.body.classList.add("no-scroll");
}

export function enableBodyScroll(): void {
    document.body.classList.remove("no-scroll");
}

export function getRootLocation(): string {
    const {protocol, host} = window.location;
    return rootUrl(protocol, host);
}

export function getLocation(
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
                        name = value;
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

export function getDocumentPassedLocation(): DocumentLocation {
    const search = window.location.search;
    if (!search) {
        return {};
    }
    return getPassedLocation(search.substring(1));
}

export function getPassedLocation(query: string): DocumentLocation {
    if (!query) {
        return {};
    }
    let components = {};
    query
        .split("&")
        .map(s => s.split("="))
        .filter(([name]) => name === "href")
        .forEach(([_, value]) => {
            let {scheme, host, port, path, query, fragment} = URI.parse(decodeURIComponent(value));
            const rootLocation = rootUrl(scheme ?? "https", host ?? "", port);
            if (query) {
                query = `?${query}`;
            }
            if (fragment) {
                fragment = `#${fragment}`;
            }
            components = {rootLocation, path, query, hash: fragment};
    });
    return components;
}

export function passedLocation(location: string): string {
    return getRootLocation() + "/?href=" + encodeURIComponent(location);
}
