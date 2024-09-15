import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";
import { GrantInfo, PluginInfo, Scope, SettingInfo, SettingMetaInfo, TokenInfo } from "api";
import { SettingsTabId } from "state/settings/state";

export type SettingsGoToTabAction = ActionWithPayload<"SETTINGS_GO_TO_TAB", {
    tab: SettingsTabId;
}>;
export const settingsGoToTab = (tab: SettingsTabId): SettingsGoToTabAction =>
    actionWithPayload("SETTINGS_GO_TO_TAB", {tab});

export type SettingsGoToSheetAction = ActionWithPayload<"SETTINGS_GO_TO_SHEET", {
    sheet: string;
}>;
export const settingsGoToSheet = (sheet: string): SettingsGoToSheetAction =>
    actionWithPayload("SETTINGS_GO_TO_SHEET", {sheet});

export type SettingsNodeValuesLoadAction = ActionWithoutPayload<"SETTINGS_NODE_VALUES_LOAD">;
export const settingsNodeValuesLoad = (): SettingsNodeValuesLoadAction =>
    actionWithoutPayload("SETTINGS_NODE_VALUES_LOAD");

export type SettingsNodeValuesLoadedAction = ActionWithPayload<"SETTINGS_NODE_VALUES_LOADED", {
    settings: SettingInfo[];
}>;
export const settingsNodeValuesLoaded = (settings: SettingInfo[]): SettingsNodeValuesLoadedAction =>
    actionWithPayload("SETTINGS_NODE_VALUES_LOADED", {settings});

export type SettingsNodeValuesLoadFailedAction = ActionWithoutPayload<"SETTINGS_NODE_VALUES_LOAD_FAILED">;
export const settingsNodeValuesLoadFailed = (): SettingsNodeValuesLoadFailedAction =>
    actionWithoutPayload("SETTINGS_NODE_VALUES_LOAD_FAILED");

export type SettingsNodeValuesUnsetAction = ActionWithoutPayload<"SETTINGS_NODE_VALUES_UNSET">;
export const settingsNodeValuesUnset = (): SettingsNodeValuesUnsetAction =>
    actionWithoutPayload("SETTINGS_NODE_VALUES_UNSET");

export type SettingsNodeConflictAction = ActionWithoutPayload<"SETTINGS_NODE_CONFLICT">;
export const settingsNodeConflict = (): SettingsNodeConflictAction =>
    actionWithoutPayload("SETTINGS_NODE_CONFLICT");

export type SettingsNodeConflictCloseAction = ActionWithoutPayload<"SETTINGS_NODE_CONFLICT_CLOSE">;
export const settingsNodeConflictClose = (): SettingsNodeConflictCloseAction =>
    actionWithoutPayload("SETTINGS_NODE_CONFLICT_CLOSE");

export type SettingsNodeMetaLoadAction = ActionWithoutPayload<"SETTINGS_NODE_META_LOAD">;
export const settingsNodeMetaLoad = (): SettingsNodeMetaLoadAction =>
    actionWithoutPayload("SETTINGS_NODE_META_LOAD");

export type SettingsNodeMetaLoadedAction = ActionWithPayload<"SETTINGS_NODE_META_LOADED", {
    meta: SettingMetaInfo[];
}>;
export const settingsNodeMetaLoaded = (meta: SettingMetaInfo[]): SettingsNodeMetaLoadedAction =>
    actionWithPayload("SETTINGS_NODE_META_LOADED", {meta});

export type SettingsNodeMetaLoadFailedAction = ActionWithoutPayload<"SETTINGS_NODE_META_LOAD_FAILED">;
export const settingsNodeMetaLoadFailed = (): SettingsNodeMetaLoadFailedAction =>
    actionWithoutPayload("SETTINGS_NODE_META_LOAD_FAILED");

export type SettingsNodeMetaUnsetAction = ActionWithoutPayload<"SETTINGS_NODE_META_UNSET">;
export const settingsNodeMetaUnset = (): SettingsNodeMetaUnsetAction =>
    actionWithoutPayload("SETTINGS_NODE_META_UNSET");

export type SettingsClientValuesLoadAction = ActionWithoutPayload<"SETTINGS_CLIENT_VALUES_LOAD">;
export const settingsClientValuesLoad = (): SettingsClientValuesLoadAction =>
    actionWithoutPayload("SETTINGS_CLIENT_VALUES_LOAD");

export type SettingsClientValuesLoadedAction = ActionWithPayload<"SETTINGS_CLIENT_VALUES_LOADED", {
    settings: SettingInfo[];
}>;
export const settingsClientValuesLoaded = (settings: SettingInfo[]): SettingsClientValuesLoadedAction =>
    actionWithPayload("SETTINGS_CLIENT_VALUES_LOADED", {settings});

export type SettingsClientValuesLoadFailedAction = ActionWithoutPayload<"SETTINGS_CLIENT_VALUES_LOAD_FAILED">;
export const settingsClientValuesLoadFailed = (): SettingsClientValuesLoadFailedAction =>
    actionWithoutPayload("SETTINGS_CLIENT_VALUES_LOAD_FAILED");

export type SettingsClientValuesSetAction = ActionWithPayload<"SETTINGS_CLIENT_VALUES_SET", {
    settings: SettingInfo[];
}>;
export const settingsClientValuesSet = (settings: SettingInfo[]): SettingsClientValuesSetAction =>
    actionWithPayload("SETTINGS_CLIENT_VALUES_SET", {settings});

export type SettingsClientValuesUnsetAction = ActionWithoutPayload<"SETTINGS_CLIENT_VALUES_UNSET">;
export const settingsClientValuesUnset = (): SettingsClientValuesUnsetAction =>
    actionWithoutPayload("SETTINGS_CLIENT_VALUES_UNSET");

export type SettingsClientConflictAction = ActionWithoutPayload<"SETTINGS_CLIENT_CONFLICT">;
export const settingsClientConflict = (): SettingsClientConflictAction =>
    actionWithoutPayload("SETTINGS_CLIENT_CONFLICT");

export type SettingsClientConflictCloseAction = ActionWithoutPayload<"SETTINGS_CLIENT_CONFLICT_CLOSE">;
export const settingsClientConflictClose = (): SettingsClientConflictCloseAction =>
    actionWithoutPayload("SETTINGS_CLIENT_CONFLICT_CLOSE");

export type SettingsUpdateAction = ActionWithPayload<"SETTINGS_UPDATE", {
    settings: SettingInfo[];
    onSuccess: any;
}>;
export const settingsUpdate = (settings: SettingInfo[], onSuccess?: any): SettingsUpdateAction =>
    actionWithPayload("SETTINGS_UPDATE", {settings, onSuccess});

export type SettingsUpdateSucceededAction = ActionWithPayload<"SETTINGS_UPDATE_SUCCEEDED", {
    settings: SettingInfo[];
    onSuccess: any;
}>;
export const settingsUpdateSucceeded = (settings: SettingInfo[], onSuccess: any): SettingsUpdateSucceededAction =>
    actionWithPayload("SETTINGS_UPDATE_SUCCEEDED", {settings, onSuccess});

export type SettingsUpdateFailedAction = ActionWithoutPayload<"SETTINGS_UPDATE_FAILED">;
export const settingsUpdateFailed = (): SettingsUpdateFailedAction =>
    actionWithoutPayload("SETTINGS_UPDATE_FAILED");

export type SettingsChangePasswordDialogOpenAction = ActionWithoutPayload<"SETTINGS_CHANGE_PASSWORD_DIALOG_OPEN">;
export const settingsChangePasswordDialogOpen = (): SettingsChangePasswordDialogOpenAction =>
    actionWithoutPayload("SETTINGS_CHANGE_PASSWORD_DIALOG_OPEN");

export type SettingsChangePasswordDialogCloseAction = ActionWithoutPayload<"SETTINGS_CHANGE_PASSWORD_DIALOG_CLOSE">;
export const settingsChangePasswordDialogClose = (): SettingsChangePasswordDialogCloseAction =>
    actionWithoutPayload("SETTINGS_CHANGE_PASSWORD_DIALOG_CLOSE");

export type SettingsChangePasswordAction = ActionWithPayload<"SETTINGS_CHANGE_PASSWORD", {
    oldPassword: string;
    password: string;
    onLoginIncorrect: any;
}>;
export const settingsChangePassword = (
    oldPassword: string, password: string, onLoginIncorrect: any
): SettingsChangePasswordAction =>
    actionWithPayload("SETTINGS_CHANGE_PASSWORD", {oldPassword, password, onLoginIncorrect});

export type SettingsChangedPasswordAction = ActionWithoutPayload<"SETTINGS_CHANGED_PASSWORD">;
export const settingsChangedPassword = (): SettingsChangedPasswordAction =>
    actionWithoutPayload("SETTINGS_CHANGED_PASSWORD");

export type SettingsChangePasswordFailedAction = ActionWithoutPayload<"SETTINGS_CHANGE_PASSWORD_FAILED">;
export const settingsChangePasswordFailed = (): SettingsChangePasswordFailedAction =>
    actionWithoutPayload("SETTINGS_CHANGE_PASSWORD_FAILED");

export type SettingsGrantsLoadAction = ActionWithoutPayload<"SETTINGS_GRANTS_LOAD">;
export const settingsGrantsLoad = (): SettingsGrantsLoadAction =>
    actionWithoutPayload("SETTINGS_GRANTS_LOAD");

export type SettingsGrantsLoadedAction = ActionWithPayload<"SETTINGS_GRANTS_LOADED", {
    grants: GrantInfo[];
}>;
export const settingsGrantsLoaded = (grants: GrantInfo[]): SettingsGrantsLoadedAction =>
    actionWithPayload("SETTINGS_GRANTS_LOADED", {grants});

export type SettingsGrantsLoadFailedAction = ActionWithoutPayload<"SETTINGS_GRANTS_LOAD_FAILED">;
export const settingsGrantsLoadFailed = (): SettingsGrantsLoadFailedAction =>
    actionWithoutPayload("SETTINGS_GRANTS_LOAD_FAILED");

export type SettingsGrantsUnsetAction = ActionWithoutPayload<"SETTINGS_GRANTS_UNSET">;
export const settingsGrantsUnset = (): SettingsGrantsUnsetAction =>
    actionWithoutPayload("SETTINGS_GRANTS_UNSET");

export type SettingsGrantsDialogOpenAction = ActionWithPayload<"SETTINGS_GRANTS_DIALOG_OPEN", {
    nodeName: string;
    grant: GrantInfo | null;
}>;
export const settingsGrantsDialogOpen = (nodeName: string, grant: GrantInfo | null): SettingsGrantsDialogOpenAction =>
    actionWithPayload("SETTINGS_GRANTS_DIALOG_OPEN", {nodeName, grant});

export type SettingsGrantsDialogCloseAction = ActionWithoutPayload<"SETTINGS_GRANTS_DIALOG_CLOSE">;
export const settingsGrantsDialogClose = (): SettingsGrantsDialogCloseAction =>
    actionWithoutPayload("SETTINGS_GRANTS_DIALOG_CLOSE");

export type SettingsGrantsDialogConfirmAction = ActionWithPayload<"SETTINGS_GRANTS_DIALOG_CONFIRM", {
    nodeName: string;
    revoke: Scope[];
}>;
export const settingsGrantsDialogConfirm = (nodeName: string, revoke: Scope[]): SettingsGrantsDialogConfirmAction =>
    actionWithPayload("SETTINGS_GRANTS_DIALOG_CONFIRM", {nodeName, revoke});

export type SettingsGrantsDialogConfirmedAction = ActionWithPayload<"SETTINGS_GRANTS_DIALOG_CONFIRMED", {
    nodeName: string;
    scope: Scope[];
}>;
export const settingsGrantsDialogConfirmed = (nodeName: string, scope: Scope[]): SettingsGrantsDialogConfirmedAction =>
    actionWithPayload("SETTINGS_GRANTS_DIALOG_CONFIRMED", {nodeName, scope});

export type SettingsGrantsDialogConfirmFailedAction = ActionWithoutPayload<"SETTINGS_GRANTS_DIALOG_CONFIRM_FAILED">;
export const settingsGrantsDialogConfirmFailed = (): SettingsGrantsDialogConfirmFailedAction =>
    actionWithoutPayload("SETTINGS_GRANTS_DIALOG_CONFIRM_FAILED");

export type SettingsGrantsDeleteAction = ActionWithPayload<"SETTINGS_GRANTS_DELETE", {
    nodeName: string;
}>;
export const settingsGrantsDelete = (nodeName: string): SettingsGrantsDeleteAction =>
    actionWithPayload("SETTINGS_GRANTS_DELETE", {nodeName});

export type SettingsGrantsDeletedAction = ActionWithPayload<"SETTINGS_GRANTS_DELETED", {
    nodeName: string;
}>;
export const settingsGrantsDeleted = (nodeName: string): SettingsGrantsDeletedAction =>
    actionWithPayload("SETTINGS_GRANTS_DELETED", {nodeName});

export type SettingsTokensLoadAction = ActionWithoutPayload<"SETTINGS_TOKENS_LOAD">;
export const settingsTokensLoad = (): SettingsTokensLoadAction =>
    actionWithoutPayload("SETTINGS_TOKENS_LOAD");

export type SettingsTokensLoadedAction = ActionWithPayload<"SETTINGS_TOKENS_LOADED", {
    tokens: TokenInfo[];
}>;
export const settingsTokensLoaded = (tokens: TokenInfo[]): SettingsTokensLoadedAction =>
    actionWithPayload("SETTINGS_TOKENS_LOADED", {tokens});

export type SettingsTokensLoadFailedAction = ActionWithoutPayload<"SETTINGS_TOKENS_LOAD_FAILED">;
export const settingsTokensLoadFailed = (): SettingsTokensLoadFailedAction =>
    actionWithoutPayload("SETTINGS_TOKENS_LOAD_FAILED");

export type SettingsTokensUnsetAction = ActionWithoutPayload<"SETTINGS_TOKENS_UNSET">;
export const settingsTokensUnset = (): SettingsTokensUnsetAction =>
    actionWithoutPayload("SETTINGS_TOKENS_UNSET");

export type SettingsTokensDialogOpenAction = ActionWithPayload<"SETTINGS_TOKENS_DIALOG_OPEN", {
    token: TokenInfo | null;
}>;
export const settingsTokensDialogOpen = (token: TokenInfo | null): SettingsTokensDialogOpenAction =>
    actionWithPayload("SETTINGS_TOKENS_DIALOG_OPEN", {token});

export type SettingsTokensDialogCloseAction = ActionWithoutPayload<"SETTINGS_TOKENS_DIALOG_CLOSE">;
export const settingsTokensDialogClose = (): SettingsTokensDialogCloseAction =>
    actionWithoutPayload("SETTINGS_TOKENS_DIALOG_CLOSE");

export type SettingsTokensCreateAction = ActionWithPayload<"SETTINGS_TOKENS_CREATE", {
    password: string;
    name: string | null;
    permissions: Scope[];
    onLoginIncorrect: () => void
}>;
export const settingsTokensCreate = (
    password: string, name: string | null, permissions: Scope[], onLoginIncorrect: () => void
): SettingsTokensCreateAction =>
    actionWithPayload("SETTINGS_TOKENS_CREATE", {password, name, permissions, onLoginIncorrect});

export type SettingsTokensCreatedAction = ActionWithPayload<"SETTINGS_TOKENS_CREATED", {
    token: TokenInfo;
}>;
export const settingsTokensCreated = (token: TokenInfo): SettingsTokensCreatedAction =>
    actionWithPayload("SETTINGS_TOKENS_CREATED", {token});

export type SettingsTokensCreateFailedAction = ActionWithoutPayload<"SETTINGS_TOKENS_CREATE_FAILED">;
export const settingsTokensCreateFailed = (): SettingsTokensCreateFailedAction =>
    actionWithoutPayload("SETTINGS_TOKENS_CREATE_FAILED");

export type SettingsTokensUpdateAction = ActionWithPayload<"SETTINGS_TOKENS_UPDATE", {
    id: string;
    name: string | null;
    permissions: Scope[] | null;
}>;
export const settingsTokensUpdate = (
    id: string, name: string | null, permissions: Scope[] | null
): SettingsTokensUpdateAction =>
    actionWithPayload("SETTINGS_TOKENS_UPDATE", {id, name, permissions});

export type SettingsTokensUpdatedAction = ActionWithPayload<"SETTINGS_TOKENS_UPDATED", {
    token: TokenInfo;
}>;
export const settingsTokensUpdated = (token: TokenInfo): SettingsTokensUpdatedAction =>
    actionWithPayload("SETTINGS_TOKENS_UPDATED", {token});

export type SettingsTokensUpdateFailedAction = ActionWithoutPayload<"SETTINGS_TOKENS_UPDATE_FAILED">;
export const settingsTokensUpdateFailed = (): SettingsTokensUpdateFailedAction =>
    actionWithoutPayload("SETTINGS_TOKENS_UPDATE_FAILED");

export type SettingsTokensDeleteAction = ActionWithPayload<"SETTINGS_TOKENS_DELETE", {
    id: string;
}>;
export const settingsTokensDelete = (id: string): SettingsTokensDeleteAction =>
    actionWithPayload("SETTINGS_TOKENS_DELETE", {id});

export type SettingsTokensDeletedAction = ActionWithPayload<"SETTINGS_TOKENS_DELETED", {
    id: string;
}>;
export const settingsTokensDeleted = (id: string): SettingsTokensDeletedAction =>
    actionWithPayload("SETTINGS_TOKENS_DELETED", {id});

export type SettingsTokensNewTokenCloseAction = ActionWithoutPayload<"SETTINGS_TOKENS_NEW_TOKEN_CLOSE">;
export const settingsTokensNewTokenClose = (): SettingsTokensNewTokenCloseAction =>
    actionWithoutPayload("SETTINGS_TOKENS_NEW_TOKEN_CLOSE");

export type SettingsTokensNewTokenCopyAction = ActionWithoutPayload<"SETTINGS_TOKENS_NEW_TOKEN_COPY">;
export const settingsTokensNewTokenCopy = (): SettingsTokensNewTokenCopyAction =>
    actionWithoutPayload("SETTINGS_TOKENS_NEW_TOKEN_COPY");

export type SettingsPluginsLoadAction = ActionWithoutPayload<"SETTINGS_PLUGINS_LOAD">;
export const settingsPluginsLoad = (): SettingsPluginsLoadAction =>
    actionWithoutPayload("SETTINGS_PLUGINS_LOAD");

export type SettingsPluginsLoadedAction = ActionWithPayload<"SETTINGS_PLUGINS_LOADED", {
    plugins: PluginInfo[];
}>;
export const settingsPluginsLoaded = (plugins: PluginInfo[]): SettingsPluginsLoadedAction =>
    actionWithPayload("SETTINGS_PLUGINS_LOADED", {plugins});

export type SettingsPluginsLoadFailedAction = ActionWithoutPayload<"SETTINGS_PLUGINS_LOAD_FAILED">;
export const settingsPluginsLoadFailed = (): SettingsPluginsLoadFailedAction =>
    actionWithoutPayload("SETTINGS_PLUGINS_LOAD_FAILED");

export type SettingsPluginsUnsetAction = ActionWithoutPayload<"SETTINGS_PLUGINS_UNSET">;
export const settingsPluginsUnset = (): SettingsPluginsUnsetAction =>
    actionWithoutPayload("SETTINGS_PLUGINS_UNSET");

export type SettingsPluginsDeleteAction = ActionWithPayload<"SETTINGS_PLUGINS_DELETE", {
    name: string;
    tokenId: string;
}>;
export const settingsPluginsDelete = (name: string, tokenId: string): SettingsPluginsDeleteAction =>
    actionWithPayload("SETTINGS_PLUGINS_DELETE", {name, tokenId});

export type SettingsPluginsDeletedAction = ActionWithPayload<"SETTINGS_PLUGINS_DELETED", {
    name: string;
}>;
export const settingsPluginsDeleted = (name: string): SettingsPluginsDeletedAction =>
    actionWithPayload("SETTINGS_PLUGINS_DELETED", {name});

export type SettingsPluginsConflictAction = ActionWithoutPayload<"SETTINGS_PLUGINS_CONFLICT">;
export const settingsPluginsConflict = (): SettingsPluginsConflictAction =>
    actionWithoutPayload("SETTINGS_PLUGINS_CONFLICT");

export type SettingsPluginsConflictCloseAction = ActionWithoutPayload<"SETTINGS_PLUGINS_CONFLICT_CLOSE">;
export const settingsPluginsConflictClose = (): SettingsPluginsConflictCloseAction =>
    actionWithoutPayload("SETTINGS_PLUGINS_CONFLICT_CLOSE");

export type SettingsLanguageChangedAction = ActionWithoutPayload<"SETTINGS_LANGUAGE_CHANGED">;
export const settingsLanguageChanged = (): SettingsLanguageChangedAction =>
    actionWithoutPayload("SETTINGS_LANGUAGE_CHANGED");

export type SettingsDeleteNodeRequestLoadAction = ActionWithoutPayload<"SETTINGS_DELETE_NODE_REQUEST_LOAD">;
export const settingsDeleteNodeRequestLoad = (): SettingsDeleteNodeRequestLoadAction =>
    actionWithoutPayload("SETTINGS_DELETE_NODE_REQUEST_LOAD");

export type SettingsDeleteNodeRequestLoadedAction = ActionWithPayload<"SETTINGS_DELETE_NODE_REQUEST_LOADED", {
    requested: boolean;
}>;
export const settingsDeleteNodeRequestLoaded = (requested: boolean): SettingsDeleteNodeRequestLoadedAction =>
    actionWithPayload("SETTINGS_DELETE_NODE_REQUEST_LOADED", {requested});

export type SettingsDeleteNodeRequestLoadFailedAction =
    ActionWithoutPayload<"SETTINGS_DELETE_NODE_REQUEST_LOAD_FAILED">;
export const settingsDeleteNodeRequestLoadFailed = (): SettingsDeleteNodeRequestLoadFailedAction =>
    actionWithoutPayload("SETTINGS_DELETE_NODE_REQUEST_LOAD_FAILED");

export type SettingsDeleteNodeRequestSendAction = ActionWithPayload<"SETTINGS_DELETE_NODE_REQUEST_SEND", {
    message: string | null;
}>;
export const settingsDeleteNodeRequestSend = (message: string | null): SettingsDeleteNodeRequestSendAction =>
    actionWithPayload("SETTINGS_DELETE_NODE_REQUEST_SEND", {message});

export type SettingsDeleteNodeRequestCancelAction = ActionWithoutPayload<"SETTINGS_DELETE_NODE_REQUEST_CANCEL">;
export const settingsDeleteNodeRequestCancel = (): SettingsDeleteNodeRequestCancelAction =>
    actionWithoutPayload("SETTINGS_DELETE_NODE_REQUEST_CANCEL");

export type SettingsDeleteNodeRequestUpdateFailedAction =
    ActionWithoutPayload<"SETTINGS_DELETE_NODE_REQUEST_UPDATE_FAILED">;
export const settingsDeleteNodeRequestUpdateFailed = (): SettingsDeleteNodeRequestUpdateFailedAction =>
    actionWithoutPayload("SETTINGS_DELETE_NODE_REQUEST_UPDATE_FAILED");

export type SettingsDeleteNodeRequestStatusSetAction = ActionWithPayload<"SETTINGS_DELETE_NODE_REQUEST_STATUS_SET", {
    requested: boolean;
}>;
export const settingsDeleteNodeRequestStatusSet = (requested: boolean): SettingsDeleteNodeRequestStatusSetAction =>
    actionWithPayload("SETTINGS_DELETE_NODE_REQUEST_STATUS_SET", {requested});

export type SettingsDeleteNodeRequestUnsetAction = ActionWithoutPayload<"SETTINGS_DELETE_NODE_REQUEST_UNSET">;
export const settingsDeleteNodeRequestUnset = (): SettingsDeleteNodeRequestUnsetAction =>
    actionWithoutPayload("SETTINGS_DELETE_NODE_REQUEST_UNSET");

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
    | SettingsGrantsLoadAction
    | SettingsGrantsLoadedAction
    | SettingsGrantsLoadFailedAction
    | SettingsGrantsUnsetAction
    | SettingsGrantsDialogOpenAction
    | SettingsGrantsDialogCloseAction
    | SettingsGrantsDialogConfirmAction
    | SettingsGrantsDialogConfirmedAction
    | SettingsGrantsDialogConfirmFailedAction
    | SettingsGrantsDeleteAction
    | SettingsGrantsDeletedAction
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
    | SettingsPluginsDeletedAction
    | SettingsPluginsConflictAction
    | SettingsPluginsConflictCloseAction
    | SettingsLanguageChangedAction
    | SettingsDeleteNodeRequestLoadAction
    | SettingsDeleteNodeRequestLoadedAction
    | SettingsDeleteNodeRequestLoadFailedAction
    | SettingsDeleteNodeRequestSendAction
    | SettingsDeleteNodeRequestCancelAction
    | SettingsDeleteNodeRequestUpdateFailedAction
    | SettingsDeleteNodeRequestStatusSetAction
    | SettingsDeleteNodeRequestUnsetAction;
