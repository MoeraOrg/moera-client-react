import { Action } from 'redux';

import { ActionWithPayload } from "state/action-types";
import { PluginInfo, SettingInfo, SettingMetaInfo, TokenInfo } from "api/node/api-types";
import { SettingsTabId } from "state/settings/state";

export const SETTINGS_GO_TO_TAB = "SETTINGS_GO_TO_TAB";
export type SettingsGoToTabAction = ActionWithPayload<typeof SETTINGS_GO_TO_TAB, {
    tab: SettingsTabId;
}>;
export const settingsGoToTab = (tab: SettingsTabId): SettingsGoToTabAction => ({
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

export const SETTINGS_CLIENT_VALUES_SET = "SETTINGS_CLIENT_VALUES_SET";
export type SettingsClientValuesSetAction = ActionWithPayload<typeof SETTINGS_CLIENT_VALUES_SET, {
    settings: SettingInfo[];
}>;
export const settingsClientValuesSet = (settings: SettingInfo[]): SettingsClientValuesSetAction => ({
    type: SETTINGS_CLIENT_VALUES_SET,
    payload: {settings}
});

export const SETTINGS_CLIENT_VALUES_UNSET = "SETTINGS_CLIENT_VALUES_UNSET";
export type SettingsClientValuesUnsetAction = Action<typeof SETTINGS_CLIENT_VALUES_UNSET>;
export const settingsClientValuesUnset = (): SettingsClientValuesUnsetAction => ({
    type: SETTINGS_CLIENT_VALUES_UNSET
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

export const SETTINGS_TOKENS_LOAD = "SETTINGS_TOKENS_LOAD";
export type SettingsTokensLoadAction = Action<typeof SETTINGS_TOKENS_LOAD>;
export const settingsTokensLoad = (): SettingsTokensLoadAction => ({
    type: SETTINGS_TOKENS_LOAD
});

export const SETTINGS_TOKENS_LOADED = "SETTINGS_TOKENS_LOADED";
export type SettingsTokensLoadedAction = ActionWithPayload<typeof SETTINGS_TOKENS_LOADED, {
    tokens: TokenInfo[];
}>;
export const settingsTokensLoaded = (tokens: TokenInfo[]): SettingsTokensLoadedAction => ({
    type: SETTINGS_TOKENS_LOADED,
    payload: {tokens}
});

export const SETTINGS_TOKENS_LOAD_FAILED = "SETTINGS_TOKENS_LOAD_FAILED";
export type SettingsTokensLoadFailedAction = Action<typeof SETTINGS_TOKENS_LOAD_FAILED>;
export const settingsTokensLoadFailed = (): SettingsTokensLoadFailedAction => ({
    type: SETTINGS_TOKENS_LOAD_FAILED
});

export const SETTINGS_TOKENS_UNSET = "SETTINGS_TOKENS_UNSET";
export type SettingsTokensUnsetAction = Action<typeof SETTINGS_TOKENS_UNSET>;
export const settingsTokensUnset = (): SettingsTokensUnsetAction => ({
    type: SETTINGS_TOKENS_UNSET
});

export const SETTINGS_TOKENS_DIALOG_OPEN = "SETTINGS_TOKENS_DIALOG_OPEN";
export type SettingsTokensDialogOpenAction = ActionWithPayload<typeof SETTINGS_TOKENS_DIALOG_OPEN, {
    token: TokenInfo | null;
}>;
export const settingsTokensDialogOpen = (token: TokenInfo | null): SettingsTokensDialogOpenAction => ({
    type: SETTINGS_TOKENS_DIALOG_OPEN,
    payload: {token}
});

export const SETTINGS_TOKENS_DIALOG_CLOSE = "SETTINGS_TOKENS_DIALOG_CLOSE";
export type SettingsTokensDialogCloseAction = Action<typeof SETTINGS_TOKENS_DIALOG_CLOSE>;
export const settingsTokensDialogClose = (): SettingsTokensDialogCloseAction => ({
    type: SETTINGS_TOKENS_DIALOG_CLOSE
});

export const SETTINGS_TOKENS_CREATE = "SETTINGS_TOKENS_CREATE";
export type SettingsTokensCreateAction = ActionWithPayload<typeof SETTINGS_TOKENS_CREATE, {
    password: string;
    name: string | null;
    onLoginIncorrect: () => void
}>;
export const settingsTokensCreate = (password: string, name: string | null,
                                     onLoginIncorrect: () => void): SettingsTokensCreateAction => ({
    type: SETTINGS_TOKENS_CREATE,
    payload: {password, name, onLoginIncorrect}
});

export const SETTINGS_TOKENS_CREATED = "SETTINGS_TOKENS_CREATED";
export type SettingsTokensCreatedAction = ActionWithPayload<typeof SETTINGS_TOKENS_CREATED, {
    token: TokenInfo;
}>;
export const settingsTokensCreated = (token: TokenInfo): SettingsTokensCreatedAction => ({
    type: SETTINGS_TOKENS_CREATED,
    payload: {token}
});

export const SETTINGS_TOKENS_CREATE_FAILED = "SETTINGS_TOKENS_CREATE_FAILED";
export type SettingsTokensCreateFailedAction = Action<typeof SETTINGS_TOKENS_CREATE_FAILED>;
export const settingsTokensCreateFailed = (): SettingsTokensCreateFailedAction => ({
    type: SETTINGS_TOKENS_CREATE_FAILED
});

export const SETTINGS_TOKENS_UPDATE = "SETTINGS_TOKENS_UPDATE";
export type SettingsTokensUpdateAction = ActionWithPayload<typeof SETTINGS_TOKENS_UPDATE, {
    id: string;
    name: string | null;
}>;
export const settingsTokensUpdate = (id: string, name: string | null): SettingsTokensUpdateAction => ({
    type: SETTINGS_TOKENS_UPDATE,
    payload: {id, name}
});

export const SETTINGS_TOKENS_UPDATED = "SETTINGS_TOKENS_UPDATED";
export type SettingsTokensUpdatedAction = ActionWithPayload<typeof SETTINGS_TOKENS_UPDATED, {
    token: TokenInfo;
}>;
export const settingsTokensUpdated = (token: TokenInfo): SettingsTokensUpdatedAction => ({
    type: SETTINGS_TOKENS_UPDATED,
    payload: {token}
});

export const SETTINGS_TOKENS_UPDATE_FAILED = "SETTINGS_TOKENS_UPDATE_FAILED";
export type SettingsTokensUpdateFailedAction = Action<typeof SETTINGS_TOKENS_UPDATE_FAILED>;
export const settingsTokensUpdateFailed = (): SettingsTokensUpdateFailedAction => ({
    type: SETTINGS_TOKENS_UPDATE_FAILED
});

export const SETTINGS_TOKENS_DELETE = "SETTINGS_TOKENS_DELETE";
export type SettingsTokensDeleteAction = ActionWithPayload<typeof SETTINGS_TOKENS_DELETE, {
    id: string;
}>;
export const settingsTokensDelete = (id: string): SettingsTokensDeleteAction => ({
    type: SETTINGS_TOKENS_DELETE,
    payload: {id}
});

export const SETTINGS_TOKENS_DELETED = "SETTINGS_TOKENS_DELETED";
export type SettingsTokensDeletedAction = ActionWithPayload<typeof SETTINGS_TOKENS_DELETED, {
    id: string;
}>;
export const settingsTokensDeleted = (id: string): SettingsTokensDeletedAction => ({
    type: SETTINGS_TOKENS_DELETED,
    payload: {id}
});

export const SETTINGS_TOKENS_NEW_TOKEN_CLOSE = "SETTINGS_TOKENS_NEW_TOKEN_CLOSE";
export type SettingsTokensNewTokenCloseAction = Action<typeof SETTINGS_TOKENS_NEW_TOKEN_CLOSE>;
export const settingsTokensNewTokenClose = (): SettingsTokensNewTokenCloseAction => ({
    type: SETTINGS_TOKENS_NEW_TOKEN_CLOSE
});

export const SETTINGS_TOKENS_NEW_TOKEN_COPY = "SETTINGS_TOKENS_NEW_TOKEN_COPY";
export type SettingsTokensNewTokenCopyAction = Action<typeof SETTINGS_TOKENS_NEW_TOKEN_COPY>;
export const settingsTokensNewTokenCopy = (): SettingsTokensNewTokenCopyAction => ({
    type: SETTINGS_TOKENS_NEW_TOKEN_COPY
});

export const SETTINGS_PLUGINS_LOAD = "SETTINGS_PLUGINS_LOAD";
export type SettingsPluginsLoadAction = Action<typeof SETTINGS_PLUGINS_LOAD>;
export const settingsPluginsLoad = (): SettingsPluginsLoadAction => ({
    type: SETTINGS_PLUGINS_LOAD
});

export const SETTINGS_PLUGINS_LOADED = "SETTINGS_PLUGINS_LOADED";
export type SettingsPluginsLoadedAction = ActionWithPayload<typeof SETTINGS_PLUGINS_LOADED, {
    plugins: PluginInfo[];
}>;
export const settingsPluginsLoaded = (plugins: PluginInfo[]): SettingsPluginsLoadedAction => ({
    type: SETTINGS_PLUGINS_LOADED,
    payload: {plugins}
});

export const SETTINGS_PLUGINS_LOAD_FAILED = "SETTINGS_PLUGINS_LOAD_FAILED";
export type SettingsPluginsLoadFailedAction = Action<typeof SETTINGS_PLUGINS_LOAD_FAILED>;
export const settingsPluginsLoadFailed = (): SettingsPluginsLoadFailedAction => ({
    type: SETTINGS_PLUGINS_LOAD_FAILED
});

export const SETTINGS_PLUGINS_UNSET = "SETTINGS_PLUGINS_UNSET";
export type SettingsPluginsUnsetAction = Action<typeof SETTINGS_PLUGINS_UNSET>;
export const settingsPluginsUnset = (): SettingsPluginsUnsetAction => ({
    type: SETTINGS_PLUGINS_UNSET
});

export const SETTINGS_PLUGINS_DELETE = "SETTINGS_PLUGINS_DELETE";
export type SettingsPluginsDeleteAction = ActionWithPayload<typeof SETTINGS_PLUGINS_DELETE, {
    name: string;
    tokenId: string;
}>;
export const settingsPluginsDelete = (name: string, tokenId: string): SettingsPluginsDeleteAction => ({
    type: SETTINGS_PLUGINS_DELETE,
    payload: {name, tokenId}
});

export const SETTINGS_PLUGINS_DELETED = "SETTINGS_PLUGINS_DELETED";
export type SettingsPluginsDeletedAction = ActionWithPayload<typeof SETTINGS_PLUGINS_DELETED, {
    name: string;
}>;
export const settingsPluginsDeleted = (name: string): SettingsPluginsDeletedAction => ({
    type: SETTINGS_PLUGINS_DELETED,
    payload: {name}
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
    | SettingsClientValuesSetAction
    | SettingsClientValuesUnsetAction
    | SettingsClientConflictAction
    | SettingsClientConflictCloseAction
    | SettingsUpdateAction
    | SettingsUpdateSucceededAction
    | SettingsUpdateFailedAction
    | SettingsChangePasswordDialogOpenAction
    | SettingsChangePasswordDialogCloseAction
    | SettingsChangePasswordAction
    | SettingsChangedPasswordAction
    | SettingsChangePasswordFailedAction
    | SettingsTokensLoadAction
    | SettingsTokensLoadedAction
    | SettingsTokensLoadFailedAction
    | SettingsTokensUnsetAction
    | SettingsTokensDialogOpenAction
    | SettingsTokensDialogCloseAction
    | SettingsTokensCreateAction
    | SettingsTokensCreatedAction
    | SettingsTokensCreateFailedAction
    | SettingsTokensUpdateAction
    | SettingsTokensUpdatedAction
    | SettingsTokensUpdateFailedAction
    | SettingsTokensDeleteAction
    | SettingsTokensDeletedAction
    | SettingsTokensNewTokenCloseAction
    | SettingsTokensNewTokenCopyAction
    | SettingsPluginsLoadAction
    | SettingsPluginsLoadedAction
    | SettingsPluginsLoadFailedAction
    | SettingsPluginsUnsetAction
    | SettingsPluginsDeleteAction
    | SettingsPluginsDeletedAction;
