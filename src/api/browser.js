import * as URI from 'uri-js';

import { randomId, rootUrl } from "util/misc";

export class Browser {

    static clientId = randomId();

    static isTinyScreen() {
        return window.screen.width <= 575;
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
        return Browser.getPassedLocation(search.substring(1));
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
        return Browser.getRootLocation() + "/?href=" + encodeURIComponent(location);
    }

    static storeData(data) {
        window.postMessage({
            source: "moera",
            action: "storeData",
            payload: {
                ...data,
                clientId: Browser.clientId
            }
        }, "*");
    }

    static storeConnectionData(location, nodeName, login, token, permissions) {
        Browser.storeData({home: {location, nodeName, login, token, permissions}});
    }

    static storeCartesData(cartesIp, cartes) {
        Browser.storeData({cartesIp, cartes});
    }

    static deleteData(location) {
        window.postMessage({
            source: "moera",
            action: "deleteData",
            payload: location
        }, "*");
    }

    static switchData(location) {
        window.postMessage({
            source: "moera",
            action: "switchData",
            payload: location
        }, "*");
    }

    static storeName(name, latest, nodeUri) {
        window.postMessage({
            source: "moera",
            action: "storeName",
            payload: {name, latest, nodeUri}
        }, "*");
    }

}
