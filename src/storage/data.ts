import { AvatarImage, CarteInfo } from "api";

type StorageKey = "currentRoot" | "clientData" | "roots" | "names";

export interface RootInfo {
    name: string | null;
    url: string;
}

export interface NameDetails {
    name: string;
    nodeUri: string;
    updated: number;
}

export interface ClientHomeData {
    fullName?: string | null;
    avatar?: AvatarImage | null;
    login?: string | null;
    token?: string | null;
    permissions?: string[] | null;
}

export interface ClientData {
    home?: ClientHomeData;
    cartesIp?: string | null;
    cartes?: CarteInfo[] | null;
    settings?: [string, string | null][] | null;
    invisibleUsers?: {
        checksum: number;
        blockedUsers: [string, string][];
    } | null;
}

export function getStorageItem(key: "currentRoot"): string | null;
export function getStorageItem(key: "roots"): RootInfo[] | null;
export function getStorageItem(key: "clientData", index: string): ClientData | null;
export function getStorageItem(key: "names", index: string | null): NameDetails[] | null;
export function getStorageItem(key: StorageKey, index?: string | null): any {
    const fullKey = index != null ? `${key};${index}` : key;
    const value = window.localStorage.getItem(fullKey);
    try {
        return value != null ? JSON.parse(value) : null;
    } catch (e) {
        return null;
    }
}

export function setStorageItem(key: "currentRoot", index: null, value: string): void;
export function setStorageItem(key: "roots", index: null, value: RootInfo[]): void;
export function setStorageItem(key: "clientData", index: string, value: ClientData): void;
export function setStorageItem(key: "names", index: string | null, value: NameDetails[]): void;
export function setStorageItem(key: StorageKey, index: string | null, value: null): void;
export function setStorageItem(key: StorageKey, index: string | null, value: any): void {
    const fullKey = index != null ? `${key};${index}` : key;
    if (value != null) {
        window.localStorage.setItem(fullKey, JSON.stringify(value));
    } else {
        window.localStorage.removeItem(fullKey);
    }
}

export function removeStorageItem(key: StorageKey, index?: string | null): void {
    setStorageItem(key, index ?? null, null);
}

export function findRootName(roots: RootInfo[], location: string): string | null {
    const root = roots.find(r => r.url === location);
    return root ? root.name : null;
}

export function setRoot(roots: RootInfo[], location: string, nodeName: string | null): RootInfo[] {
    if (roots.find(r => r.url === location) == null) {
        roots.push({url: location, name: nodeName});
    } else {
        roots = roots.map(r => r.url === location ? {url: location, name: nodeName} : r);
    }
    return roots;
}

export function getNames(serverUrl: string | null): NameDetails[] {
    return getStorageItem("names", serverUrl) ?? [];
}

export function clearNames(serverUrl: string | null): void {
    removeStorageItem("names", serverUrl);
}
