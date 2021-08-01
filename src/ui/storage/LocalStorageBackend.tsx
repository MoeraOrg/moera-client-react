import React from 'react';
import ObjectPath from 'object-path';

import { NameDetails } from "state/naming/actions";
import { Browser } from "ui/browser";
import { isAddonMessage, loadedDataMessage, RootInfo, StoredData, transferredDataMessage } from "api/addon/api-types";
import { now } from "util/misc";

const MAX_NAMES_SIZE = 500;

type Sender = (homeRoot?: string, clientData?: StoredData, roots?: RootInfo[], names?: NameDetails[]) => void;

class LocalStorageBackend extends React.PureComponent {

    componentDidMount() {
        window.addEventListener("message", this.messageReceived);
    }

    componentWillUnmount() {
        window.removeEventListener("message", this.messageReceived);
    }

    messageReceived = (event: MessageEvent) => {
        // Only accept messages from the same frame
        if (event.source !== window) {
            return;
        }

        const message = event.data;

        // Only accept messages that we know are ours
        if (!isAddonMessage(message)) {
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

    getStorageItem(key: "currentRoot"): string | null;
    getStorageItem(key: "roots"): RootInfo[] | null;
    getStorageItem(key: "clientData", index: string): StoredData | null;
    getStorageItem(key: "names"): NameDetails[] | null;
    getStorageItem(key: string, index?: string): any {
        const fullKey = index != null ? `${key};${index}` : key;
        const value = window.localStorage.getItem(fullKey);
        try {
            return value != null ? JSON.parse(value) : null;
        } catch (e) {
            return null;
        }
    }

    setStorageItem(key: "currentRoot", index: null, value: string): void;
    setStorageItem(key: "roots", index: null, value: RootInfo[]): void;
    setStorageItem(key: "clientData", index: string, value: StoredData): void;
    setStorageItem(key: "names", index: null, value: NameDetails[]): void;
    setStorageItem(key: string, index: string | null, value: null): void;
    setStorageItem(key: string, index: string | null, value: any): void {
        const fullKey = index != null ? `${key};${index}` : key;
        if (value != null) {
            window.localStorage.setItem(fullKey, JSON.stringify(value));
        } else {
            window.localStorage.removeItem(fullKey);
        }
    }

    removeStorageItem(key: string, index?: string | null): void {
        this.setStorageItem(key, index ?? null, null);
    }

    getRootName(roots: RootInfo[], location: string): string | null {
        const root = roots.find(r => r.url === location);
        return root ? root.name : null;
    }

    setRoot(roots: RootInfo[], location: string, nodeName: string | null): RootInfo[] {
        if (roots.find(r => r.url === location) == null) {
            roots.push({url: location, name: nodeName});
        } else {
            roots = roots.map(r => r.url === location ? {url: location, name: nodeName} : r);
        }
        return roots;
    }

    getNames(): NameDetails[] {
        return this.getStorageItem("names") ?? [];
    }

    buildData(homeRoot?: string | null, clientData?: StoredData, roots?: RootInfo[],
              names?: NameDetails[]): StoredData {
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

    loadedData = (homeRoot?: string | null, clientData?: StoredData, roots?: RootInfo[], names?: NameDetails[]) => {
        Browser.postMessage(loadedDataMessage(2, this.buildData(homeRoot, clientData, roots, names)));
    }

    transferredData = (homeRoot?: string, clientData?: StoredData, roots?: RootInfo[], names?: NameDetails[]) => {
        Browser.postMessage(transferredDataMessage(this.buildData(homeRoot, clientData, roots, names)));
    }

    redirect = (homeRoot?: string): void => {
        const {rootLocation: location, path, query, hash} = Browser.getDocumentPassedLocation();
        if (location) {
            window.location.href = location + (path ?? "") + (query ?? "") + (hash ?? "");
        } else if (homeRoot) {
            window.location.href = homeRoot;
        }
    }

    loadData(sender: Sender): void {
        const homeRoot = this.getStorageItem("currentRoot");
        const roots = this.getStorageItem("roots") ?? [];
        if (!homeRoot) {
            sender();
            return;
        }
        const clientData = this.getStorageItem("clientData", homeRoot) ?? {};
        ObjectPath.set(clientData, "home.nodeName", this.getRootName(roots, homeRoot));
        sender(homeRoot, clientData, roots, this.getNames());
    }

    storeData(data: StoredData): void {
        let homeRoot = this.getStorageItem("currentRoot");
        let roots = this.getStorageItem("roots");
        if (roots == null) {
            roots = [];
        }
        const location = ObjectPath.get<string | null>(data, "home.location", null);
        const nodeName = ObjectPath.get<string | null>(data, "home.nodeName", null);
        if (location) {
            if (homeRoot !== location) {
                this.setStorageItem("currentRoot", null, location);
                homeRoot = location;
            }
            roots = this.setRoot(roots, homeRoot, nodeName);
            this.setStorageItem("roots", null, roots);
        }
        if (!homeRoot) {
            this.loadedData();
            return;
        }

        let clientData = this.getStorageItem("clientData", homeRoot);
        clientData = {
            ...clientData,
            ...data
        };
        ObjectPath.del(clientData, "home.location");

        const storedClientData = {...clientData};
        ObjectPath.del(storedClientData, "clientId");
        ObjectPath.del(storedClientData, "home.nodeName");
        this.setStorageItem("clientData", homeRoot, storedClientData);

        this.loadedData(homeRoot, clientData, roots);
    }

    deleteData(location: string | null): void {
        let homeRoot = this.getStorageItem("currentRoot");
        let roots = this.getStorageItem("roots") ?? [];
        if (!location) {
            location = homeRoot;
        }
        if (roots.find(r => r.url === location) == null && location !== homeRoot) {
            return;
        }
        roots = roots.filter(r => r.url !== location);
        this.setStorageItem("roots", null, roots);
        this.removeStorageItem("clientData", location);

        let nodeName;
        if (location === homeRoot || homeRoot == null) {
            this.clearNames();
            if (roots.length === 0) {
                this.removeStorageItem("currentRoot");
                this.loadedData(homeRoot, {}, roots);
                return;
            }
            homeRoot = roots[roots.length - 1].url;
            nodeName = roots[roots.length - 1].name;
            this.setStorageItem("currentRoot", null, homeRoot);
        } else {
            nodeName = this.getRootName(roots, homeRoot);
        }
        const clientData = this.getStorageItem("clientData", homeRoot) ?? {};
        ObjectPath.set(clientData, "home.nodeName", nodeName);
        this.loadedData(homeRoot, clientData, roots);
    }

    switchData(location: string): void {
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
        this.setStorageItem("currentRoot", null, location);
        this.clearNames();

        const clientData = this.getStorageItem("clientData", location) ?? {};
        ObjectPath.set(clientData, "home.nodeName", root.name);
        this.loadedData(location, clientData, roots);
    }

    clearNames(): void {
        this.removeStorageItem("names");
    }

    storeName(details: NameDetails): void {
        let names = this.getStorageItem("names");
        if (names == null) {
            names = [];
        }
        names = names.filter(info => info.name !== details.name);
        details.updated ??= now();
        names.push(details);
        names.sort((a, b) => a.updated - b.updated);
        if (names.length > MAX_NAMES_SIZE) {
            names.splice(0, names.length - MAX_NAMES_SIZE);
        }
        this.setStorageItem("names", null, names);
    }

    render() {
        return null;
    }

}

export default LocalStorageBackend;
