import * as URI from 'uri-js';
import i18n from 'i18next';

import { findPreferredLanguage } from "i18n";
import { rootUrl, urlWithParameters } from "util/url";
import { randomId } from "util/ui";
import { DocumentLocation, DocumentLocator, parseUniversalLocation, toDocumentLocator } from "util/universal-url";

type UserAgent = "firefox" | "chrome" | "opera" | "yandex" | "brave" | "vivaldi" | "dolphin" | "unknown";
type UserAgentOs = "android" | "ios" | "windows" | "linux" | "mac" | "unknown";

export const clientId: string = randomId();
export const [userAgent, userAgentOs] = initUserAgent();
export const androidAppFlavor: AndroidAppFlavor | null = initAndroidAppFlavor();
export const parameters: Map<string, string> = initParameters();

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
    } else if (navigator.userAgent.includes("Mac")) {
        userAgentOs = "mac";
    } else if (navigator.userAgent.includes("Linux")) {
        userAgentOs = "linux";
    } else if (navigator.userAgent.includes("Windows")) {
        userAgentOs = "windows";
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

function initParameters(): Map<string, string> {
    const parameters = new Map<string, string>();
    if (!window.location.search) {
        return parameters;
    }
    window.location.search
        .substring(1)
        .split("&")
        .map(s => s.split("="))
        .forEach(([name, value]) => parameters.set(name, value));
    return parameters;
}

export const isDevMode = (): boolean =>
    !process.env.NODE_ENV || process.env.NODE_ENV === "development";

export const isTouchScreen = (): boolean =>
    userAgentOs === "android" || userAgentOs === "ios" || isAndroidApp();

export const isMobile = (): boolean =>
    userAgentOs === "android" || userAgentOs === "ios";

export const isAndroidApp = (): boolean =>
    androidAppFlavor != null;

export const isAndroidBrowser = (): boolean =>
    userAgentOs === "android" && !isAndroidApp();

export const isAndroidGooglePlay = (): boolean =>
    androidAppFlavor === "google-play";

export const isMac = (): boolean =>
    userAgentOs === "mac";

export async function changeLanguage(lang: string | null | undefined): Promise<void> {
    if (window.Android && window.Android.getApiVersion() >= 2) {
        window.Android.changeLanguage(lang ?? findPreferredLanguage());
    }
    await i18n.changeLanguage(lang ?? undefined);
}

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

export function parseDocumentLocation(): DocumentLocation {
    if (parameters.has("href")) {
        return parsePassedLocation(parameters.get("href")!);
    }
    return parseUniversalLocation(window.location.pathname, window.location.search, window.location.hash) ?? {};
}

function parsePassedLocation(href: string): DocumentLocation {
    let {scheme, host, port, path, query, fragment} = URI.parse(decodeURIComponent(href));
    const rootLocation = rootUrl(scheme ?? "https", host ?? "", port);
    if (query) {
        query = `?${query}`;
    }
    if (fragment) {
        fragment = `#${fragment}`;
    }
    return {rootLocation, path, query, hash: fragment};
}

export function getDocumentLocator(): DocumentLocator {
    return toDocumentLocator(parseDocumentLocation());
}

export function urlWithBackHref(href: string): string {
    return urlWithParameters(href, {back: getDocumentLocator().href});
}
