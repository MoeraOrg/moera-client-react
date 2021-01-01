import * as URI from 'uri-js';

import { rootUrl } from "util/url";
import { randomId } from "util/misc";

export class Browser {

    static clientId = randomId();
    static userAgent = "unknown";
    static userAgentOs = "unknown";

    static init() {
        this._initUserAgent();
    }

    static _initUserAgent() {
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

    static isDevMode() {
        return !process.env.NODE_ENV || process.env.NODE_ENV === "development";
    }

    static isTinyScreen() {
        return window.screen.width <= 575;
    }

    static isAddonSupported() {
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

    static isWebPushSupported() {
        return !!navigator.serviceWorker;
    }

    static isTouchScreen() {
        return this.userAgentOs === "android" || this.userAgentOs === "ios";
    }

    static isMobile() {
        return this.userAgentOs === "android" || this.userAgentOs === "ios";
    }

    static getRootLocation() {
        const {protocol, host} = window.location;
        return rootUrl(protocol, host);
    }

    static getDocumentLocation() {
        let {pathname: path, search: query, hash} = window.location;
        let rootLocation = Browser.getRootLocation();

        const header = document.body.dataset.xMoera;
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

    static getDocumentPassedLocation() {
        const search = window.location.search;
        if (!search) {
            return {};
        }
        return this.getPassedLocation(search.substring(1));
    }

    static getPassedLocation(query) {
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
                const rootLocation = rootUrl(scheme, host, port);
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

    static passedLocation(location) {
        return this.getRootLocation() + "/?href=" + encodeURIComponent(location);
    }

    static storeData(data) {
        window.postMessage({
            source: "moera",
            action: "storeData",
            payload: {
                ...data,
                clientId: this.clientId
            }
        }, window.location.href);
    }

    static storeConnectionData(location, nodeName, login, token, permissions) {
        this.storeData({home: {location, nodeName, login, token, permissions}});
    }

    static storeCartesData(cartesIp, cartes) {
        this.storeData({cartesIp, cartes});
    }

    static storeWebPushData(subscriptionId, invitationStage, invitationTimestamp) {
        this.storeData({webPush: {subscriptionId, invitationStage, invitationTimestamp}});
    }

    static deleteData(location) {
        window.postMessage({
            source: "moera",
            action: "deleteData",
            payload: location
        }, window.location.href);
    }

    static switchData(location) {
        window.postMessage({
            source: "moera",
            action: "switchData",
            payload: location
        }, window.location.href);
    }

    static storeName(name, latest, nodeUri, updated) {
        window.postMessage({
            source: "moera",
            action: "storeName",
            payload: {name, latest, nodeUri, updated}
        }, window.location.href);
    }

}
