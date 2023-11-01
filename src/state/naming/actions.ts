import { Action } from 'redux';

import { ActionWithPayload } from "state/action-types";
import { NameDetails } from "storage";

export const NAMING_NAMES_USED = "NAMING_NAMES_USED";
export type NamingNamesUsedAction = ActionWithPayload<typeof NAMING_NAMES_USED, {
    names: (string | null)[];
}>;
export const namingNamesUsed = (names: (string | null)[]): NamingNamesUsedAction => ({
    type: NAMING_NAMES_USED,
    payload: {names}
});

export const NAMING_NAME_LOAD = "NAMING_NAME_LOAD";
export type NamingNameLoadAction = ActionWithPayload<typeof NAMING_NAME_LOAD, {
    name: string;
}>;
export const namingNameLoad = (name: string): NamingNameLoadAction => ({
    type: NAMING_NAME_LOAD,
    payload: {name}
});

export const NAMING_NAME_LOADED = "NAMING_NAME_LOADED";
export type NamingNameLoadedAction = ActionWithPayload<typeof NAMING_NAME_LOADED, {
    name: string;
    nodeUri: string;
    updated: number;
}>;
export const namingNameLoaded = (name: string, nodeUri: string, updated: number): NamingNameLoadedAction => ({
    type: NAMING_NAME_LOADED,
    payload: {name, nodeUri, updated}
});

export const NAMING_NAME_LOAD_FAILED = "NAMING_NAME_LOAD_FAILED";
export type NamingNameLoadFailedAction = ActionWithPayload<typeof NAMING_NAME_LOAD_FAILED, {
    name: string;
}>;
export const namingNameLoadFailed = (name: string): NamingNameLoadFailedAction => ({
    type: NAMING_NAME_LOAD_FAILED,
    payload: {name}
});

export const NAMING_NAMES_PURGE = "NAMING_NAMES_PURGE";
export type NamingNamesPurgeAction = ActionWithPayload<typeof NAMING_NAMES_PURGE, {
    names: string[];
}>;
export const namingNamesPurge = (names: string[]): NamingNamesPurgeAction => ({
    type: NAMING_NAMES_PURGE,
    payload: {names}
});

export const NAMING_NAMES_MAINTENANCE = "NAMING_NAMES_MAINTENANCE";
export type NamingNamesMaintenanceAction = Action<typeof NAMING_NAMES_MAINTENANCE>;
export const namingNamesMaintenance = (): NamingNamesMaintenanceAction => ({
    type: NAMING_NAMES_MAINTENANCE
});

export const NAMING_NAMES_POPULATE = "NAMING_NAMES_POPULATE";
export type NamingNamesPopulateAction = ActionWithPayload<typeof NAMING_NAMES_POPULATE, {
    names: NameDetails[];
}>;
export const namingNamesPopulate = (names: NameDetails[]): NamingNamesPopulateAction => ({
    type: NAMING_NAMES_POPULATE,
    payload: {names}
});

export type NamingAnyAction =
    NamingNamesUsedAction
    | NamingNameLoadAction
    | NamingNameLoadedAction
    | NamingNameLoadFailedAction
    | NamingNamesPurgeAction
    | NamingNamesMaintenanceAction
    | NamingNamesPopulateAction;
