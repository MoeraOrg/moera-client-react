import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";
import { NameDetails } from "storage";

export type NamingNamesUsedAction = ActionWithPayload<"NAMING_NAMES_USED", {
    names: (string | null)[];
}>;
export const namingNamesUsed = (names: (string | null)[]): NamingNamesUsedAction =>
    actionWithPayload("NAMING_NAMES_USED", {names});

export type NamingNameLoadAction = ActionWithPayload<"NAMING_NAME_LOAD", {
    name: string;
}>;
export const namingNameLoad = (name: string): NamingNameLoadAction =>
    actionWithPayload("NAMING_NAME_LOAD", {name});

export type NamingNameLoadedAction = ActionWithPayload<"NAMING_NAME_LOADED", {
    name: string;
    nodeUri: string;
    updated: number;
}>;
export const namingNameLoaded = (name: string, nodeUri: string, updated: number): NamingNameLoadedAction =>
    actionWithPayload("NAMING_NAME_LOADED", {name, nodeUri, updated});

export type NamingNameLoadFailedAction = ActionWithPayload<"NAMING_NAME_LOAD_FAILED", {
    name: string;
}>;
export const namingNameLoadFailed = (name: string): NamingNameLoadFailedAction =>
    actionWithPayload("NAMING_NAME_LOAD_FAILED", {name});

export type NamingNamesPurgeAction = ActionWithPayload<"NAMING_NAMES_PURGE", {
    names: string[];
}>;
export const namingNamesPurge = (names: string[]): NamingNamesPurgeAction =>
    actionWithPayload("NAMING_NAMES_PURGE", {names});

export type NamingNamesMaintenanceAction = ActionWithoutPayload<"NAMING_NAMES_MAINTENANCE">;
export const namingNamesMaintenance = (): NamingNamesMaintenanceAction =>
    actionWithoutPayload("NAMING_NAMES_MAINTENANCE");

export type NamingNamesPopulateAction = ActionWithPayload<"NAMING_NAMES_POPULATE", {
    names: NameDetails[];
}>;
export const namingNamesPopulate = (names: NameDetails[]): NamingNamesPopulateAction =>
    actionWithPayload("NAMING_NAMES_POPULATE", {names});

export type NamingAnyAction =
    NamingNamesUsedAction
    | NamingNameLoadAction
    | NamingNameLoadedAction
    | NamingNameLoadFailedAction
    | NamingNamesPurgeAction
    | NamingNamesMaintenanceAction
    | NamingNamesPopulateAction;
