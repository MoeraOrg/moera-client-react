import { NameDetails } from "state/naming/actions";
import { AvatarImage, CarteInfo } from "api/node/api-types";

export interface RootInfo {
    name: string | null;
    url: string;
}

export interface StoredHomeData {
    location: string;
    nodeName?: string | null;
    fullName?: string | null;
    avatar?: AvatarImage | null;
    login?: string | null;
    token?: string | null;
    permissions?: string[] | null;
}

export interface StoredData {
    clientId?: string;
    home?: StoredHomeData;
    names?: NameDetails[];
    roots?: RootInfo[];
    cartesIp?: string | null;
    cartes?: CarteInfo[] | null;
}

export interface LoadedData extends StoredData {
    version: number;
}

export interface StoredName {
    name: string;
    nodeUri: string;
}

interface AddonMessageBase<A, P> {
    source: "moera";
    action: A;
    payload: P;
}
const addonMessageBase = <A, P>(action: A, payload: P): AddonMessageBase<A, P> => ({source: "moera", action, payload});

export type LoadedDataMessage = AddonMessageBase<"loadedData", LoadedData>;
export const loadedDataMessage = (version: number, data: StoredData): LoadedDataMessage =>
    addonMessageBase("loadedData", {...data, version});

export type TransferredDataMessage = AddonMessageBase<"transferredData", StoredData>;
export const transferredDataMessage = (data: StoredData): TransferredDataMessage =>
    addonMessageBase("transferredData", data);

export type StoredNameMessage = AddonMessageBase<"storedName", StoredName>;

export type LoadDataMessage = AddonMessageBase<"loadData", {}>;
export const loadDataMessage = (): LoadDataMessage =>
    addonMessageBase("loadData", {});

export type TransferDataMessage = AddonMessageBase<"transferData", {}>;
export const transferDataMessage = (): TransferDataMessage =>
    addonMessageBase("transferData", {});

export type RedirectMessage = AddonMessageBase<"redirect", {}>;
export const redirectMessage = (): RedirectMessage =>
    addonMessageBase("redirect", {});

export type StoreDataMessage = AddonMessageBase<"storeData", StoredData>;
export const storeDataMessage = (data: StoredData): StoreDataMessage =>
    addonMessageBase("storeData", data);

export type DeleteDataMessage = AddonMessageBase<"deleteData", string>;
export const deleteDataMessage = (location: string): DeleteDataMessage =>
    addonMessageBase("deleteData", location);

export type SwitchDataMessage = AddonMessageBase<"switchData", string>;
export const switchDataMessage = (location: string): SwitchDataMessage =>
    addonMessageBase("switchData", location);

export type StoreNameMessage = AddonMessageBase<"storeName", NameDetails>;
export const storeNameMessage = (name: string, nodeUri: string, updated: number): StoreNameMessage =>
    addonMessageBase("storeName", {name, nodeUri, updated})

export type AddonMessage =
    LoadedDataMessage
    | TransferredDataMessage
    | StoredNameMessage
    | LoadDataMessage
    | TransferDataMessage
    | RedirectMessage
    | StoreDataMessage
    | DeleteDataMessage
    | SwitchDataMessage
    | StoreNameMessage;

export type AddonMessageAction = AddonMessage["action"];

export function isAddonMessage(data: any): data is AddonMessage {
    return data != null && typeof data === "object" && data.source === "moera";
}
