import * as URI from 'uri-js';

import { AvatarImage, CarteInfo } from "api/node/api-types";
import { rootUrl } from "util/url";
import { randomId } from "util/misc";
import {
    AddonMessage,
    deleteDataMessage,
    storeDataMessage,
    StoredData,
    storeNameMessage,
    switchDataMessage
} from "ui/storage/types";

type UserAgent = "firefox" | "chrome" | "opera" | "yandex" | "brave" | "vivaldi" | "dolphin" | "unknown";
type UserAgentOs = "android" | "ios" | "unknown";

interface DocumentLocation {
    rootLocation?: string;
    path?: string | null;
    query?: string | null;
    hash?: string | null;
}

export class Browser {

    static clientId: string = randomId();
    static userAgent: UserAgent = "unknown";
    static userAgentOs: UserAgentOs = "unknown";

    static init(): void {
        this._initUserAgent();
    }

    static _initUserAgent(): void {
        if (navigator.userAgent.includes("Firefox")) {
            this.userAgent = "firefox";
        } else if (navigator.userAgent.includes("Opera")) {
            this.userAgent = "opera";
        } else if (navigator.userAgent.includes("Chrome")) {
            if (navigator.userAgent.includes("YaBrowser")) {
                this.userAgent = "yandex";
            } else if (navigator.userAgent.includes("Brave")) {
                this.userAgent = "brave";
            } else if (navigator.userAgent.includes("Vivaldi")) {
                this.userAgent = "vivaldi";
            } else {
                this.userAgent = "chrome";
            }
        } else if (navigator.userAgent.includes("Dolphin")) {
            this.userAgent = "dolphin";
        }

        if (navigator.userAgent.includes("Android")) {
            this.userAgentOs = "android";
        } else if (navigator.userAgent.includes("iPhone")) {
            this.userAgentOs = "ios";
        }
    }

    static isDevMode(): boolean {
        return !process.env.NODE_ENV || process.env.NODE_ENV === "development";
    }

    static isTinyScreen(): boolean {
        return window.screen.width <= 575;
    }

    static isAddonSupported(): boolean {
        switch (this.userAgent) {
            default:
            case "unknown":
            case "opera":
            case "dolphin":
                return false;
            case "firefox":
            case "chrome":
                return this.userAgentOs === "unknown";
            case "yandex":
            case "brave":
            case "vivaldi":
                return true;
        }
    }

    static isTouchScreen(): boolean {
        return this.userAgentOs === "android" || this.userAgentOs === "ios";
    }

    static isMobile(): boolean {
        return this.userAgentOs === "android" || this.userAgentOs === "ios";
    }

    static getRootLocation(): string {
        const {protocol, host} = window.location;
        return rootUrl(protocol, host);
    }

    static getDocumentLocation(): DocumentLocation {
        const {pathname, search, hash} = window.location;
        const rootLocation = Browser.getRootLocation();
        const header = document.body.dataset.xMoera ?? null;

        return this.getLocation(rootLocation, pathname, search, hash, header);
    }

    static getLocation(rootLocation: string, path: string | null | undefined, query: string | null | undefined,
                       hash: string | null | undefined, header: string | null): DocumentLocation {
        if (header) {
            header
                .split(/\s*;\s*/)
                .filter(s => s.includes("="))
                .map(s => s.split("="))
                .map(([name, value]) => ([name.toLowerCase(), decodeURIComponent(value)]))
                .forEach(([name, value]) => {
                    let components;
                    switch(name) {
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

        return {rootLocation, path, query, hash};
    }

    static getDocumentPassedLocation(): DocumentLocation {
        const search = window.location.search;
        if (!search) {
            return {};
        }
        return this.getPassedLocation(search.substring(1));
    }

    static getPassedLocation(query: string): DocumentLocation {
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

    static passedLocation(location: string): string {
        return this.getRootLocation() + "/?href=" + encodeURIComponent(location);
    }

    static postMessage(message: AddonMessage): void {
        window.postMessage(message, window.location.href);
    }

    static storeData(data: StoredData): void {
        this.postMessage(storeDataMessage({
            ...data,
            clientId: this.clientId
        }));
    }

    static storeConnectionData(location: string, nodeName: string | null, fullName: string | null,
                               avatar: AvatarImage | null, login: string | null, token: string | null,
                               permissions: string[] | null): void {
        if (window.Android) {
            window.Android.connectedToHome(location + "/moera", token, nodeName);
        }
        this.storeData({home: {location, nodeName, fullName, avatar, login, token, permissions}});
    }

    static storeCartesData(cartesIp: string | null, cartes: CarteInfo[] | null): void {
        this.storeData({cartesIp, cartes});
    }

    static deleteData(location: string): void {
        this.postMessage(deleteDataMessage(location));
    }

    static switchData(location: string): void {
        this.postMessage(switchDataMessage(location));
    }

    static storeName(name: string, nodeUri: string, updated: number) {
        this.postMessage(storeNameMessage(name, nodeUri, updated));
    }

}
