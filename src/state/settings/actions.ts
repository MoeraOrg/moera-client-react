import { Action } from 'redux';

import { ActionWithPayload } from "state/action-types";
import { SettingInfo, SettingMetaInfo } from "api/node/api-types";

export const SETTINGS_GO_TO_TAB = "SETTINGS_GO_TO_TAB";
export type SettingsGoToTabAction = ActionWithPayload<typeof SETTINGS_GO_TO_TAB, {
    tab: string;
}>;
export const settingsGoToTab = (tab: string): SettingsGoToTabAction => ({
    type: SETTINGS_GO_TO_TAB,
    payload: {tab}
});

export const SETTINGS_GO_TO_SHEET = "SETTINGS_GO_TO_SHEET";
export type SettingsGoToSheetAction = ActionWithPayload<typeof SETTINGS_GO_TO_SHEET, {
    sheet: string;
}>;
export const settingsGoToSheet = (sheet: string): SettingsGoToSheetAction => ({
    type: SETTINGS_GO_TO_SHEET,
    payload: {sheet}
});

export const SETTINGS_NODE_VALUES_LOAD = "SETTINGS_NODE_VALUES_LOAD";
export type SettingsNodeValuesLoadAction = Action<typeof SETTINGS_NODE_VALUES_LOAD>;
export const settingsNodeValuesLoad = (): SettingsNodeValuesLoadAction => ({
    type: SETTINGS_NODE_VALUES_LOAD
});

export const SETTINGS_NODE_VALUES_LOADED = "SETTINGS_NODE_VALUES_LOADED";
export type SettingsNodeValuesLoadedAction = ActionWithPayload<typeof SETTINGS_NODE_VALUES_LOADED, {
    settings: SettingInfo[];
}>;
export const settingsNodeValuesLoaded = (settings: SettingInfo[]): SettingsNodeValuesLoadedAction => ({
    type: SETTINGS_NODE_VALUES_LOADED,
    payload: {settings}
});

export const SETTINGS_NODE_VALUES_LOAD_FAILED = "SETTINGS_NODE_VALUES_LOAD_FAILED";
export type SettingsNodeValuesLoadFailedAction = Action<typeof SETTINGS_NODE_VALUES_LOAD_FAILED>;
export const settingsNodeValuesLoadFailed = (): SettingsNodeValuesLoadFailedAction => ({
    type: SETTINGS_NODE_VALUES_LOAD_FAILED
});

export const SETTINGS_NODE_VALUES_UNSET = "SETTINGS_NODE_VALUES_UNSET";
export type SettingsNodeValuesUnsetAction = Action<typeof SETTINGS_NODE_VALUES_UNSET>;
export const settingsNodeValuesUnset = (): SettingsNodeValuesUnsetAction => ({
    type: SETTINGS_NODE_VALUES_UNSET
});

export const SETTINGS_NODE_CONFLICT = "SETTINGS_NODE_CONFLICT";
export type SettingsNodeConflictAction = Action<typeof SETTINGS_NODE_CONFLICT>;
export const settingsNodeConflict = (): SettingsNodeConflictAction => ({
    type: SETTINGS_NODE_CONFLICT
});

export const SETTINGS_NODE_CONFLICT_CLOSE = "SETTINGS_NODE_CONFLICT_CLOSE";
export type SettingsNodeConflictCloseAction = Action<typeof SETTINGS_NODE_CONFLICT_CLOSE>;
export const settingsNodeConflictClose = (): SettingsNodeConflictCloseAction => ({
    type: SETTINGS_NODE_CONFLICT_CLOSE
});

export const SETTINGS_NODE_META_LOAD = "SETTINGS_NODE_META_LOAD";
export type SettingsNodeMetaLoadAction = Action<typeof SETTINGS_NODE_META_LOAD>;
export const settingsNodeMetaLoad = (): SettingsNodeMetaLoadAction => ({
    type: SETTINGS_NODE_META_LOAD
});

export const SETTINGS_NODE_META_LOADED = "SETTINGS_NODE_META_LOADED";
export type SettingsNodeMetaLoadedAction = ActionWithPayload<typeof SETTINGS_NODE_META_LOADED, {
    meta: SettingMetaInfo[];
}>;
export const settingsNodeMetaLoaded = (meta: SettingMetaInfo[]): SettingsNodeMetaLoadedAction => ({
    type: SETTINGS_NODE_META_LOADED,
    payload: {meta}
});

export const SETTINGS_NODE_META_LOAD_FAILED = "SETTINGS_NODE_META_LOAD_FAILED";
export type SettingsNodeMetaLoadFailedAction = Action<typeof SETTINGS_NODE_META_LOAD_FAILED>;
export const settingsNodeMetaLoadFailed = (): SettingsNodeMetaLoadFailedAction => ({
    type: SETTINGS_NODE_META_LOAD_FAILED
});

export const SETTINGS_NODE_META_UNSET = "SETTINGS_NODE_META_UNSET";
export type SettingsNodeMetaUnsetAction = Action<typeof SETTINGS_NODE_META_UNSET>;
export const settingsNodeMetaUnset = (): SettingsNodeMetaUnsetAction => ({
    type: SETTINGS_NODE_META_UNSET
});

export const SETTINGS_CLIENT_VALUES_LOAD = "SETTINGS_CLIENT_VALUES_LOAD";
export type SettingsClientValuesLoadAction = Action<typeof SETTINGS_CLIENT_VALUES_LOAD>;
export const settingsClientValuesLoad = (): SettingsClientValuesLoadAction => ({
    type: SETTINGS_CLIENT_VALUES_LOAD
});

export const SETTINGS_CLIENT_VALUES_LOADED = "SETTINGS_CLIENT_VALUES_LOADED";
export type SettingsClientValuesLoadedAction = ActionWithPayload<typeof SETTINGS_CLIENT_VALUES_LOADED, {
    settings: SettingInfo[];
}>;
export const settingsClientValuesLoaded = (settings: SettingInfo[]): SettingsClientValuesLoadedAction => ({
    type: SETTINGS_CLIENT_VALUES_LOADED,
    payload: {settings}
});

export const SETTINGS_CLIENT_VALUES_LOAD_FAILED = "SETTINGS_CLIENT_VALUES_LOAD_FAILED";
export type SettingsClientValuesLoadFailedAction = Action<typeof SETTINGS_CLIENT_VALUES_LOAD_FAILED>;
export const settingsClientValuesLoadFailed = (): SettingsClientValuesLoadFailedAction => ({
    type: SETTINGS_CLIENT_VALUES_LOAD_FAILED
});

export const SETTINGS_CLIENT_CONFLICT = "SETTINGS_CLIENT_CONFLICT";
export type SettingsClientConflictAction = Action<typeof SETTINGS_CLIENT_CONFLICT>;
export const settingsClientConflict = (): SettingsClientConflictAction => ({
    type: SETTINGS_CLIENT_CONFLICT
});

export const SETTINGS_CLIENT_CONFLICT_CLOSE = "SETTINGS_CLIENT_CONFLICT_CLOSE";
export type SettingsClientConflictCloseAction = Action<typeof SETTINGS_CLIENT_CONFLICT_CLOSE>;
export const settingsClientConflictClose = (): SettingsClientConflictCloseAction => ({
    type: SETTINGS_CLIENT_CONFLICT_CLOSE
});

export const SETTINGS_UPDATE = "SETTINGS_UPDATE";
export type SettingsUpdateAction = ActionWithPayload<typeof SETTINGS_UPDATE, {
    settings: SettingInfo[];
    onSuccess: any;
}>;
export const settingsUpdate = (settings: SettingInfo[], onSuccess?: any): SettingsUpdateAction => ({
    type: SETTINGS_UPDATE,
    payload: {settings, onSuccess}
});

export const SETTINGS_UPDATE_SUCCEEDED = "SETTINGS_UPDATE_SUCCEEDED";
export type SettingsUpdateSucceededAction = ActionWithPayload<typeof SETTINGS_UPDATE_SUCCEEDED, {
    settings: SettingInfo[];
    onSuccess: any;
}>;
export const settingsUpdateSucceeded = (settings: SettingInfo[], onSuccess: any): SettingsUpdateSucceededAction => ({
    type: SETTINGS_UPDATE_SUCCEEDED,
    payload: {settings, onSuccess}
});

export const SETTINGS_UPDATE_FAILED = "SETTINGS_UPDATE_FAILED";
export type SettingsUpdateFailedAction = Action<typeof SETTINGS_UPDATE_FAILED>;
export const settingsUpdateFailed = (): SettingsUpdateFailedAction => ({
    type: SETTINGS_UPDATE_FAILED
});

export const SETTINGS_CHANGE_PASSWORD_DIALOG_OPEN = "SETTINGS_CHANGE_PASSWORD_DIALOG_OPEN";
export type SettingsChangePasswordDialogOpenAction = Action<typeof SETTINGS_CHANGE_PASSWORD_DIALOG_OPEN>;
export const settingsChangePasswordDialogOpen = (): SettingsChangePasswordDialogOpenAction => ({
    type: SETTINGS_CHANGE_PASSWORD_DIALOG_OPEN
});

export const SETTINGS_CHANGE_PASSWORD_DIALOG_CLOSE = "SETTINGS_CHANGE_PASSWORD_DIALOG_CLOSE";
export type SettingsChangePasswordDialogCloseAction = Action<typeof SETTINGS_CHANGE_PASSWORD_DIALOG_CLOSE>;
export const settingsChangePasswordDialogClose = (): SettingsChangePasswordDialogCloseAction => ({
    type: SETTINGS_CHANGE_PASSWORD_DIALOG_CLOSE
});

export const SETTINGS_CHANGE_PASSWORD = "SETTINGS_CHANGE_PASSWORD";
export type SettingsChangePasswordAction = ActionWithPayload<typeof SETTINGS_CHANGE_PASSWORD, {
    oldPassword: string;
    password: string;
    onLoginIncorrect: any;
}>;
export const settingsChangePassword = (oldPassword: string, password: string,
                                       onLoginIncorrect: any): SettingsChangePasswordAction => ({
    type: SETTINGS_CHANGE_PASSWORD,
    payload: {oldPassword, password, onLoginIncorrect}
});

export const SETTINGS_CHANGED_PASSWORD = "SETTINGS_CHANGED_PASSWORD";
export type SettingsChangedPasswordAction = Action<typeof SETTINGS_CHANGED_PASSWORD>;
export const settingsChangedPassword = (): SettingsChangedPasswordAction => ({
    type: SETTINGS_CHANGED_PASSWORD
});

export const SETTINGS_CHANGE_PASSWORD_FAILED = "SETTINGS_CHANGE_PASSWORD_FAILED";
export type SettingsChangePasswordFailedAction = Action<typeof SETTINGS_CHANGE_PASSWORD_FAILED>;
export const settingsChangePasswordFailed = (): SettingsChangePasswordFailedAction => ({
    type: SETTINGS_CHANGE_PASSWORD_FAILED
});

export type SettingsAnyAction =
    SettingsGoToTabAction
    | SettingsGoToSheetAction
    | SettingsNodeValuesLoadAction
    | SettingsNodeValuesLoadedAction
    | SettingsNodeValuesLoadFailedAction
    | SettingsNodeValuesUnsetAction
    | SettingsNodeConflictAction
    | SettingsNodeConflictCloseAction
    | SettingsNodeMetaLoadAction
    | SettingsNodeMetaLoadedAction
    | SettingsNodeMetaLoadFailedAction
    | SettingsNodeMetaUnsetAction
    | SettingsClientValuesLoadAction
    | SettingsClientValuesLoadedAction
    | SettingsClientValuesLoadFailedAction
    | SettingsClientConflictAction
    | SettingsClientConflictCloseAction
    | SettingsUpdateAction
    | SettingsUpdateSucceededAction
    | SettingsUpdateFailedAction
    | SettingsChangePasswordDialogOpenAction
    | SettingsChangePasswordDialogCloseAction
    | SettingsChangePasswordAction
    | SettingsChangedPasswordAction
    | SettingsChangePasswordFailedAction;
