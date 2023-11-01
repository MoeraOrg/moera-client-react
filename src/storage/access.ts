import ObjectPath from 'object-path';

import { CarteInfo } from "api";
import { now } from "util/misc";
import * as Data from "./data"

const MAX_NAMES_SIZE = 500;

export interface StoredData {
    home?: Data.ClientHomeData & {
        location: string;
        nodeName?: string | null;
    };
    names?: Data.NameDetails[];
    roots?: Data.RootInfo[];
    cartesIp?: string | null;
    cartes?: CarteInfo[] | null;
    settings?: [string, string | null][] | null;
    invisibleUsers?: {
        checksum: number;
        blockedUsers: [string, string][];
    } | null;
}

function buildData(currentRoot?: string | null, clientData?: Data.ClientData, roots?: Data.RootInfo[],
                   names?: Data.NameDetails[]): StoredData {
    let data = {};
    if (currentRoot) {
        data = {...clientData};
        ObjectPath.set(data, "home.location", currentRoot);
    }
    if (roots != null) {
        data = {...data, roots}
    }
    if (names != null) {
        data = {...data, names}
    }
    return data;
}

export function loadData(): StoredData {
    const homeRoot = Data.getStorageItem("currentRoot");
    const roots = Data.getStorageItem("roots") ?? [];
    if (!homeRoot) {
        return buildData();
    }
    const clientData = Data.getStorageItem("clientData", homeRoot) ?? {};
    ObjectPath.set(clientData, "home.nodeName", Data.findRootName(roots, homeRoot));
    return buildData(homeRoot, clientData, roots, Data.getNames());
}

export function storeData(data: StoredData): void {
    let homeRoot = Data.getStorageItem("currentRoot");
    let roots = Data.getStorageItem("roots") ?? [];
    const location = ObjectPath.get<string | null>(data, "home.location", null);
    const nodeName = ObjectPath.get<string | null>(data, "home.nodeName", null);
    if (location) {
        if (homeRoot !== location) {
            Data.setStorageItem("currentRoot", null, location);
            homeRoot = location;
        }
        roots = Data.setRoot(roots, homeRoot, nodeName);
        Data.setStorageItem("roots", null, roots);
    }
    if (!homeRoot) {
        return;
    }

    let clientData = Data.getStorageItem("clientData", homeRoot);
    clientData = {
        ...clientData,
        ...data
    };
    ObjectPath.del(clientData, "home.location");

    const storedClientData = {...clientData};
    ObjectPath.del(storedClientData, "home.nodeName");
    Data.setStorageItem("clientData", homeRoot, storedClientData);
}

export function deleteData(location: string | null): StoredData {
    let homeRoot = Data.getStorageItem("currentRoot");
    let roots = Data.getStorageItem("roots") ?? [];
    if (!location) {
        location = homeRoot;
    }
    if (roots.find(r => r.url === location) == null && location !== homeRoot) {
        return buildData();
    }
    roots = roots.filter(r => r.url !== location);
    Data.setStorageItem("roots", null, roots);
    Data.removeStorageItem("clientData", location);

    let nodeName;
    if (location === homeRoot || homeRoot == null) {
        Data.clearNames();
        if (roots.length === 0) {
            Data.removeStorageItem("currentRoot");
            return buildData(homeRoot, {}, roots);
        }
        homeRoot = roots[roots.length - 1].url;
        nodeName = roots[roots.length - 1].name;
        Data.setStorageItem("currentRoot", null, homeRoot);
    } else {
        nodeName = Data.findRootName(roots, homeRoot);
    }
    const clientData = Data.getStorageItem("clientData", homeRoot) ?? {};
    ObjectPath.set(clientData, "home.nodeName", nodeName);
    return buildData(homeRoot, clientData, roots);
}

export function switchData(location: string): StoredData {
    let homeRoot = Data.getStorageItem("currentRoot");
    let roots = Data.getStorageItem("roots") ?? [];

    const root = roots.find(r => r.url === location);
    if (!location || location === homeRoot || root == null) {
        return buildData();
    }
    Data.setStorageItem("currentRoot", null, location);
    Data.clearNames();

    const clientData = Data.getStorageItem("clientData", location) ?? {};
    ObjectPath.set(clientData, "home.nodeName", root.name);
    return buildData(location, clientData, roots);
}

export function storeName(name: string, nodeUri: string, updated: number): void {
    let names = Data.getStorageItem("names") ?? [];
    names = names.filter(info => info.name !== name);
    updated ??= now();
    names.push({name, nodeUri, updated});
    names.sort((a, b) => a.updated - b.updated);
    if (names.length > MAX_NAMES_SIZE) {
        names.splice(0, names.length - MAX_NAMES_SIZE);
    }
    Data.setStorageItem("names", null, names);
}
