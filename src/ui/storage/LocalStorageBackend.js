import React from 'react';
import ObjectPath from 'object-path';

import { Browser } from "api";

const NAME_TTL = 6 * 60 * 60; // seconds
const MAX_NAMES_SIZE = 500;

class LocalStorageBackend extends React.PureComponent {

    componentDidMount() {
        window.addEventListener("message", this.messageReceived);
    }

    messageReceived = event => {
        // Only accept messages from the same frame
        if (event.source !== window) {
            return;
        }

        const message = event.data;

        // Only accept messages that we know are ours
        if (message === null || typeof message !== "object" || message.source !== "moera") {
            return;
        }

        switch (message.action) {
            case "loadData":
                this.loadData(this.loadedData);
                break;
            case "transferData":
                this.loadData(this.transferredData);
                break;
            case "redirect":
                this.loadData(this.redirect);
                break;
            case "storeData":
                this.storeData(message.payload);
                break;
            case "deleteData":
                this.deleteData(message.payload);
                break;
            case "switchData":
                this.switchData(message.payload);
                break;
            case "storeName":
                this.storeName(message.payload);
                break;
            default:
                break;
        }
    };

    getStorageItem(key) {
        const value = window.localStorage.getItem(key);
        try {
            return value != null ? JSON.parse(value) : null;
        } catch (e) {
            return null;
        }
    }

    setStorageItem(key, value) {
        window.localStorage.setItem(key, value != null ? JSON.stringify(value) : null);
    }

    removeStorageItem(key) {
        window.localStorage.removeItem(key)
    }

    getRootName(roots, location) {
        const root = roots.find(r => r.url === location);
        return root ? root.name : null;
    }

    setRoot(roots, location, nodeName) {
        if (roots.find(r => r.url === location) == null) {
            roots.push({url: location, name: nodeName});
        } else {
            roots = roots.map(r => r.url === location ? {url: location, name: nodeName} : r);
        }
        return roots;
    }

    getNames() {
        return this.getStorageItem("names") ?? [];
    }

    buildData(homeRoot, clientData, roots, names) {
        let data = {};
        if (homeRoot) {
            data = {...clientData};
            ObjectPath.set(data, "home.location", homeRoot);
        }
        if (roots != null) {
            data = {...data, roots}
        }
        if (names != null) {
            data = {...data, names}
        }
        return data;
    }

    loadedData = (homeRoot, clientData, roots, names) => {
        window.postMessage({
            source: "moera",
            action: "loadedData",
            payload: {
                version: 2,
                ...this.buildData(homeRoot, clientData, roots, names)
            }
        }, window.location.href);
    }

    transferredData = (homeRoot, clientData, roots, names) => {
        window.postMessage({
            source: "moera",
            action: "transferredData",
            payload: this.buildData(homeRoot, clientData, roots, names)
        }, window.location.href);
    }

    redirect = (homeRoot) => {
        const location = Browser.getDocumentPassedLocation().rootLocation;
        if (location) {
            window.location.href = location;
        } else if (homeRoot) {
            window.location.href = homeRoot;
        }
    }

    loadData(sender) {
        const homeRoot = this.getStorageItem("currentRoot");
        const roots = this.getStorageItem("roots");
        if (!homeRoot) {
            sender();
            return;
        }
        const clientData = this.getStorageItem(`clientData;${homeRoot}`);
        ObjectPath.set(clientData, "home.nodeName", this.getRootName(roots, homeRoot));
        sender(homeRoot, clientData, roots, this.getNames());
    }

    storeData(data) {
        let homeRoot = this.getStorageItem("currentRoot");
        let roots = this.getStorageItem("roots");
        if (roots == null) {
            roots = [];
        }
        const location = ObjectPath.get(data, "home.location");
        const nodeName = ObjectPath.get(data, "home.nodeName");
        if (location) {
            if (homeRoot !== location) {
                this.setStorageItem("currentRoot", location);
                homeRoot = location;
            }
            roots = this.setRoot(roots, homeRoot, nodeName);
            this.setStorageItem("roots", roots);
        }
        if (!homeRoot) {
            this.loadedData();
            return;
        }

        const dataKey = `clientData;${homeRoot}`;
        let clientData = this.getStorageItem(dataKey);
        clientData = {
            ...clientData,
            ...data
        };
        ObjectPath.del(clientData, "home.location");

        const storedClientData = {...clientData};
        ObjectPath.del(storedClientData, "clientId");
        ObjectPath.del(storedClientData, "home.nodeName");
        this.setStorageItem(dataKey, storedClientData);

        this.loadedData(homeRoot, clientData, roots);
    }

    deleteData(location) {
        let homeRoot = this.getStorageItem("currentRoot");
        let roots = this.getStorageItem("roots");
        if (!location) {
            location = homeRoot;
        }
        if (roots.find(r => r.url === homeRoot) == null && location !== homeRoot) {
            return null;
        }
        roots = roots.filter(r => r.url !== location);
        this.setStorageItem("roots", roots);
        this.removeStorageItem(`clientData;${location}`);

        let nodeName;
        if (location === homeRoot) {
            this.clearNames();
            if (roots.length === 0) {
                this.removeStorageItem("currentRoot");
                this.loadedData(homeRoot, {}, roots);
                return;
            }
            homeRoot = roots[roots.length - 1].url;
            nodeName = roots[roots.length - 1].name;
            this.setStorageItem("currentRoot", homeRoot);
        } else {
            nodeName = this.getRootName(roots, homeRoot);
        }
        const dataKey = `clientData;${homeRoot}`;
        const clientData = this.getStorageItem(dataKey);
        ObjectPath.set(clientData, "home.nodeName", nodeName);
        this.loadedData(homeRoot, clientData, roots);
    }

    switchData(location) {
        let homeRoot = this.getStorageItem("currentRoot");
        let roots = this.getStorageItem("roots");
        if (roots == null) {
            roots = [];
        }

        const root = roots.find(r => r.url === location);
        if (!location || location === homeRoot || root == null) {
            this.loadedData();
            return;
        }
        this.setStorageItem("currentRoot", location);
        this.clearNames();

        const dataKey = `clientData;${location}`;
        const clientData = this.getStorageItem(dataKey);
        ObjectPath.set(clientData, "home.nodeName", root.name);
        this.loadedData(location, clientData, roots);
    }

    clearNames() {
        this.removeStorageItem("names");
    }

    storeName(details) {
        let names = this.getStorageItem("names");
        if (names == null) {
            names = [];
        }
        const now = Math.round(Date.now() / 1000);
        names = names.filter(info => info.name !== details.name && (now - info.updated) <= NAME_TTL);
        details.updated = now;
        names.push(details);
        if (names.length > MAX_NAMES_SIZE) {
            names.splice(0, names.length - MAX_NAMES_SIZE);
        }
        this.setStorageItem("names", names);
    }

    render() {
        return null;
    }

}

export default LocalStorageBackend;
