import ObjectPath from 'object-path';

import { now } from "util/misc";
import * as Data from "./data"

const MAX_NAMES_SIZE = 500;
export const DEFAULT_NAMING_SERVER = "https://naming.moera.org/moera-naming";

export interface StoredData extends Data.ClientData {
    home?: Data.ClientHomeData & {
        location: string;
        nodeName?: string | null;
    };
    names?: Data.NameDetails[];
    roots?: Data.RootInfo[];
}

function buildData(
    currentRoot?: string | null,
    clientData?: Data.ClientData,
    roots?: Data.RootInfo[],
    names?: Data.NameDetails[]
): StoredData {
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

export function findNameServerUrl(settings: [string, string | null][] | null | undefined): string | null {
    if (settings == null) {
        return null;
    }
    const serverUrl = settings.find(([name]) => name === "naming.location")?.[1];
    if (serverUrl === DEFAULT_NAMING_SERVER) {
        return null;
    }
    return serverUrl ?? null;
}

export function loadData(): StoredData {
    const homeRoot = Data.getStorageItem("currentRoot");
    const roots = Data.getStorageItem("roots") ?? [];
    if (!homeRoot) {
        return buildData();
    }
    const clientData = Data.getStorageItem("clientData", homeRoot) ?? {};
    ObjectPath.set(clientData, "home.nodeName", Data.findRootName(roots, homeRoot));
    const names = Data.getNames(findNameServerUrl(clientData.settings));
    return buildData(homeRoot, clientData, roots, names);
}

export function storeData(data: StoredData): Data.RootInfo[] {
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
        return roots;
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

    return roots;
}

export function deleteData(location: string | null): boolean {
    let homeRoot = Data.getStorageItem("currentRoot");
    let roots = Data.getStorageItem("roots") ?? [];
    if (!location) {
        location = homeRoot;
    }
    if (roots.find(r => r.url === location) == null && location !== homeRoot) {
        return false;
    }
    roots = roots.filter(r => r.url !== location);
    Data.setStorageItem("roots", null, roots);
    Data.removeStorageItem("clientData", location);

    if (location === homeRoot || homeRoot == null) {
        if (roots.length === 0) {
            Data.removeStorageItem("currentRoot");
            return homeRoot != null;
        }
        homeRoot = roots[roots.length - 1].url;
        Data.setStorageItem("currentRoot", null, homeRoot);
        return true;
    }

    return false;
}

export function switchData(location: string): boolean {
    let homeRoot = Data.getStorageItem("currentRoot");
    let roots = Data.getStorageItem("roots") ?? [];

    const root = roots.find(r => r.url === location);
    if (!location || location === homeRoot || root == null) {
        return false;
    }
    Data.setStorageItem("currentRoot", null, location);

    return true;
}

export function storeName(serverUrl: string | null, name: string, nodeUri: string, updated: number): void {
    if (serverUrl === DEFAULT_NAMING_SERVER) {
        serverUrl = null;
    }
    let names = Data.getStorageItem("names", serverUrl) ?? [];
    names = names.filter(info => info.name !== name);
    updated ??= now();
    names.push({name, nodeUri, updated});
    names.sort((a, b) => a.updated - b.updated);
    if (names.length > MAX_NAMES_SIZE) {
        names.splice(0, names.length - MAX_NAMES_SIZE);
    }
    Data.setStorageItem("names", serverUrl, names);
}

export function loadNames(serverUrl: string | null): Data.NameDetails[] {
    if (serverUrl === DEFAULT_NAMING_SERVER) {
        serverUrl = null;
    }
    return Data.getNames(serverUrl);
}
