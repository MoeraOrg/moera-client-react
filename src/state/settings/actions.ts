import { ActionBase } from "state/action-base";
import { SettingInfo, SettingMetaInfo } from "api/node/api-types";

export const SETTINGS_GO_TO_TAB = "SETTINGS_GO_TO_TAB";
type SettingsGoToTabAction = ActionBase<typeof SETTINGS_GO_TO_TAB, {
    tab: string;
}>;
export const settingsGoToTab = (tab: string): SettingsGoToTabAction => ({
    type: SETTINGS_GO_TO_TAB,
    payload: {tab}
});

export const SETTINGS_GO_TO_SHEET = "SETTINGS_GO_TO_SHEET";
type SettingsGoToSheetAction = ActionBase<typeof SETTINGS_GO_TO_SHEET, {
    sheet: string;
}>;
export const settingsGoToSheet = (sheet: string): SettingsGoToSheetAction => ({
    type: SETTINGS_GO_TO_SHEET,
    payload: {sheet}
});

export const SETTINGS_NODE_VALUES_LOAD = "SETTINGS_NODE_VALUES_LOAD";
type SettingsNodeValuesLoadAction = ActionBase<typeof SETTINGS_NODE_VALUES_LOAD, never>;
export const settingsNodeValuesLoad = (): SettingsNodeValuesLoadAction => ({
    type: SETTINGS_NODE_VALUES_LOAD
});

export const SETTINGS_NODE_VALUES_LOADED = "SETTINGS_NODE_VALUES_LOADED";
type SettingsNodeValuesLoadedAction = ActionBase<typeof SETTINGS_NODE_VALUES_LOADED, {
    settings: SettingInfo[];
}>;
export const settingsNodeValuesLoaded = (settings: SettingInfo[]): SettingsNodeValuesLoadedAction => ({
    type: SETTINGS_NODE_VALUES_LOADED,
    payload: {settings}
});

export const SETTINGS_NODE_VALUES_LOAD_FAILED = "SETTINGS_NODE_VALUES_LOAD_FAILED";
type SettingsNodeValuesLoadFailedAction = ActionBase<typeof SETTINGS_NODE_VALUES_LOAD_FAILED, never>;
export const settingsNodeValuesLoadFailed = (): SettingsNodeValuesLoadFailedAction => ({
    type: SETTINGS_NODE_VALUES_LOAD_FAILED
});

export const SETTINGS_NODE_VALUES_UNSET = "SETTINGS_NODE_VALUES_UNSET";
type SettingsNodeValuesUnsetAction = ActionBase<typeof SETTINGS_NODE_VALUES_UNSET, never>;
export const settingsNodeValuesUnset = (): SettingsNodeValuesUnsetAction => ({
    type: SETTINGS_NODE_VALUES_UNSET
});

export const SETTINGS_NODE_CONFLICT = "SETTINGS_NODE_CONFLICT";
type SettingsNodeConflictAction = ActionBase<typeof SETTINGS_NODE_CONFLICT, never>;
export const settingsNodeConflict = (): SettingsNodeConflictAction => ({
    type: SETTINGS_NODE_CONFLICT
});

export const SETTINGS_NODE_CONFLICT_CLOSE = "SETTINGS_NODE_CONFLICT_CLOSE";
type SettingsNodeConflictCloseAction = ActionBase<typeof SETTINGS_NODE_CONFLICT_CLOSE, never>;
export const settingsNodeConflictClose = (): SettingsNodeConflictCloseAction => ({
    type: SETTINGS_NODE_CONFLICT_CLOSE
});

export const SETTINGS_NODE_META_LOAD = "SETTINGS_NODE_META_LOAD";
type SettingsNodeMetaLoadAction = ActionBase<typeof SETTINGS_NODE_META_LOAD, never>;
export const settingsNodeMetaLoad = (): SettingsNodeMetaLoadAction => ({
    type: SETTINGS_NODE_META_LOAD
});

export const SETTINGS_NODE_META_LOADED = "SETTINGS_NODE_META_LOADED";
type SettingsNodeMetaLoadedAction = ActionBase<typeof SETTINGS_NODE_META_LOADED, {
    meta: SettingMetaInfo[];
}>;
export const settingsNodeMetaLoaded = (meta: SettingMetaInfo[]): SettingsNodeMetaLoadedAction => ({
    type: SETTINGS_NODE_META_LOADED,
    payload: {meta}
});

export const SETTINGS_NODE_META_LOAD_FAILED = "SETTINGS_NODE_META_LOAD_FAILED";
type SettingsNodeMetaLoadFailedAction = ActionBase<typeof SETTINGS_NODE_META_LOAD_FAILED, never>;
export const settingsNodeMetaLoadFailed = (): SettingsNodeMetaLoadFailedAction => ({
    type: SETTINGS_NODE_META_LOAD_FAILED
});

export const SETTINGS_NODE_META_UNSET = "SETTINGS_NODE_META_UNSET";
type SettingsNodeMetaUnsetAction = ActionBase<typeof SETTINGS_NODE_META_UNSET, never>;
export const settingsNodeMetaUnset = (): SettingsNodeMetaUnsetAction => ({
    type: SETTINGS_NODE_META_UNSET
});

export const SETTINGS_CLIENT_VALUES_LOAD = "SETTINGS_CLIENT_VALUES_LOAD";
type SettingsClientValuesLoadAction = ActionBase<typeof SETTINGS_CLIENT_VALUES_LOAD, never>;
export const settingsClientValuesLoad = (): SettingsClientValuesLoadAction => ({
    type: SETTINGS_CLIENT_VALUES_LOAD
});

export const SETTINGS_CLIENT_VALUES_LOADED = "SETTINGS_CLIENT_VALUES_LOADED";
type SettingsClientValuesLoadedAction = ActionBase<typeof SETTINGS_CLIENT_VALUES_LOADED, {
    settings: SettingInfo[];
}>;
export const settingsClientValuesLoaded = (settings: SettingInfo[]): SettingsClientValuesLoadedAction => ({
    type: SETTINGS_CLIENT_VALUES_LOADED,
    payload: {settings}
});

export const SETTINGS_CLIENT_VALUES_LOAD_FAILED = "SETTINGS_CLIENT_VALUES_LOAD_FAILED";
type SettingsClientValuesLoadFailedAction = ActionBase<typeof SETTINGS_CLIENT_VALUES_LOAD_FAILED, never>;
export const settingsClientValuesLoadFailed = (): SettingsClientValuesLoadFailedAction => ({
    type: SETTINGS_CLIENT_VALUES_LOAD_FAILED
});

export const SETTINGS_CLIENT_CONFLICT = "SETTINGS_CLIENT_CONFLICT";
type SettingsClientConflictAction = ActionBase<typeof SETTINGS_CLIENT_CONFLICT, never>;
export const settingsClientConflict = (): SettingsClientConflictAction => ({
    type: SETTINGS_CLIENT_CONFLICT
});

export const SETTINGS_CLIENT_CONFLICT_CLOSE = "SETTINGS_CLIENT_CONFLICT_CLOSE";
type SettingsClientConflictCloseAction = ActionBase<typeof SETTINGS_CLIENT_CONFLICT_CLOSE, never>;
export const settingsClientConflictClose = (): SettingsClientConflictCloseAction => ({
    type: SETTINGS_CLIENT_CONFLICT_CLOSE
});

export const SETTINGS_UPDATE = "SETTINGS_UPDATE";
type SettingsUpdateAction = ActionBase<typeof SETTINGS_UPDATE, {
    settings: SettingInfo[];
    onSuccess: any;
}>;
export const settingsUpdate = (settings: SettingInfo[], onSuccess: any): SettingsUpdateAction => ({
    type: SETTINGS_UPDATE,
    payload: {settings, onSuccess}
});

export const SETTINGS_UPDATE_SUCCEEDED = "SETTINGS_UPDATE_SUCCEEDED";
type SettingsUpdateSucceededAction = ActionBase<typeof SETTINGS_UPDATE_SUCCEEDED, {
    settings: SettingInfo[];
    onSuccess: any;
}>;
export const settingsUpdateSucceeded = (settings: SettingInfo[], onSuccess: any): SettingsUpdateSucceededAction => ({
    type: SETTINGS_UPDATE_SUCCEEDED,
    payload: {settings, onSuccess}
});

export const SETTINGS_UPDATE_FAILED = "SETTINGS_UPDATE_FAILED";
type SettingsUpdateFailedAction = ActionBase<typeof SETTINGS_UPDATE_FAILED, never>;
export const settingsUpdateFailed = (): SettingsUpdateFailedAction => ({
    type: SETTINGS_UPDATE_FAILED
});

export const SETTINGS_CHANGE_PASSWORD_DIALOG_OPEN = "SETTINGS_CHANGE_PASSWORD_DIALOG_OPEN";
type SettingsChangePasswordDialogOpenAction = ActionBase<typeof SETTINGS_CHANGE_PASSWORD_DIALOG_OPEN, never>;
export const settingsChangePasswordDialogOpen = (): SettingsChangePasswordDialogOpenAction => ({
    type: SETTINGS_CHANGE_PASSWORD_DIALOG_OPEN
});

export const SETTINGS_CHANGE_PASSWORD_DIALOG_CLOSE = "SETTINGS_CHANGE_PASSWORD_DIALOG_CLOSE";
type SettingsChangePasswordDialogCloseAction = ActionBase<typeof SETTINGS_CHANGE_PASSWORD_DIALOG_CLOSE, never>;
export const settingsChangePasswordDialogClose = (): SettingsChangePasswordDialogCloseAction => ({
    type: SETTINGS_CHANGE_PASSWORD_DIALOG_CLOSE
});

export const SETTINGS_CHANGE_PASSWORD = "SETTINGS_CHANGE_PASSWORD";
type SettingsChangePasswordAction = ActionBase<typeof SETTINGS_CHANGE_PASSWORD, {
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
type SettingsChangedPasswordAction = ActionBase<typeof SETTINGS_CHANGED_PASSWORD, never>;
export const settingsChangedPassword = (): SettingsChangedPasswordAction => ({
    type: SETTINGS_CHANGED_PASSWORD
});

export const SETTINGS_CHANGE_PASSWORD_FAILED = "SETTINGS_CHANGE_PASSWORD_FAILED";
type SettingsChangePasswordFailedAction = ActionBase<typeof SETTINGS_CHANGE_PASSWORD_FAILED, never>;
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
