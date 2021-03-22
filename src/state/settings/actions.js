export const SETTINGS_GO_TO_TAB = "SETTINGS_GO_TO_TAB";
export const settingsGoToTab = (tab) => ({
    type: SETTINGS_GO_TO_TAB,
    payload: {tab}
});

export const SETTINGS_GO_TO_SHEET = "SETTINGS_GO_TO_SHEET";
export const settingsGoToSheet = (sheet) => ({
    type: SETTINGS_GO_TO_SHEET,
    payload: {sheet}
});

export const SETTINGS_NODE_VALUES_LOAD = "SETTINGS_NODE_VALUES_LOAD";
export const settingsNodeValuesLoad = () => ({
    type: SETTINGS_NODE_VALUES_LOAD
});

export const SETTINGS_NODE_VALUES_LOADED = "SETTINGS_NODE_VALUES_LOADED";
export const settingsNodeValuesLoaded = (settings) => ({
    type: SETTINGS_NODE_VALUES_LOADED,
    payload: {settings}
});

export const SETTINGS_NODE_VALUES_LOAD_FAILED = "SETTINGS_NODE_VALUES_LOAD_FAILED";
export const settingsNodeValuesLoadFailed = () => ({
    type: SETTINGS_NODE_VALUES_LOAD_FAILED
});

export const SETTINGS_NODE_VALUES_UNSET = "SETTINGS_NODE_VALUES_UNSET";
export const settingsNodeValuesUnset = () => ({
    type: SETTINGS_NODE_VALUES_UNSET
});

export const SETTINGS_NODE_CONFLICT = "SETTINGS_NODE_CONFLICT";
export const settingsNodeConflict = () => ({
    type: SETTINGS_NODE_CONFLICT
});

export const SETTINGS_NODE_CONFLICT_CLOSE = "SETTINGS_NODE_CONFLICT_CLOSE";
export const settingsNodeConflictClose = () => ({
    type: SETTINGS_NODE_CONFLICT_CLOSE
});

export const SETTINGS_NODE_META_LOAD = "SETTINGS_NODE_META_LOAD";
export const settingsNodeMetaLoad = () => ({
    type: SETTINGS_NODE_META_LOAD
});

export const SETTINGS_NODE_META_LOADED = "SETTINGS_NODE_META_LOADED";
export const settingsNodeMetaLoaded = (meta) => ({
    type: SETTINGS_NODE_META_LOADED,
    payload: {meta}
});

export const SETTINGS_NODE_META_LOAD_FAILED = "SETTINGS_NODE_META_LOAD_FAILED";
export const settingsNodeMetaLoadFailed = () => ({
    type: SETTINGS_NODE_META_LOAD_FAILED
});

export const SETTINGS_NODE_META_UNSET = "SETTINGS_NODE_META_UNSET";
export const settingsNodeMetaUnset = () => ({
    type: SETTINGS_NODE_META_UNSET
});

export const SETTINGS_CLIENT_VALUES_LOAD = "SETTINGS_CLIENT_VALUES_LOAD";
export const settingsClientValuesLoad = () => ({
    type: SETTINGS_CLIENT_VALUES_LOAD
});

export const SETTINGS_CLIENT_VALUES_LOADED = "SETTINGS_CLIENT_VALUES_LOADED";
export const settingsClientValuesLoaded = (settings) => ({
    type: SETTINGS_CLIENT_VALUES_LOADED,
    payload: {settings}
});

export const SETTINGS_CLIENT_VALUES_LOAD_FAILED = "SETTINGS_CLIENT_VALUES_LOAD_FAILED";
export const settingsClientValuesLoadFailed = () => ({
    type: SETTINGS_CLIENT_VALUES_LOAD_FAILED
});

export const SETTINGS_CLIENT_CONFLICT = "SETTINGS_CLIENT_CONFLICT";
export const settingsClientConflict = () => ({
    type: SETTINGS_CLIENT_CONFLICT
});

export const SETTINGS_CLIENT_CONFLICT_CLOSE = "SETTINGS_CLIENT_CONFLICT_CLOSE";
export const settingsClientConflictClose = () => ({
    type: SETTINGS_CLIENT_CONFLICT_CLOSE
});

export const SETTINGS_UPDATE = "SETTINGS_UPDATE";
export const settingsUpdate = (settings, onSuccess) => ({
    type: SETTINGS_UPDATE,
    payload: {settings, onSuccess}
});

export const SETTINGS_UPDATE_SUCCEEDED = "SETTINGS_UPDATE_SUCCEEDED";
export const settingsUpdateSucceeded = (settings, onSuccess) => ({
    type: SETTINGS_UPDATE_SUCCEEDED,
    payload: {settings, onSuccess}
});

export const SETTINGS_UPDATE_FAILED = "SETTINGS_UPDATE_FAILED";
export const settingsUpdateFailed = () => ({
    type: SETTINGS_UPDATE_FAILED
});

export const SETTINGS_CHANGE_PASSWORD_DIALOG_OPEN = "SETTINGS_CHANGE_PASSWORD_DIALOG_OPEN";
export const settingsChangePasswordDialogOpen = () => ({
    type: SETTINGS_CHANGE_PASSWORD_DIALOG_OPEN
});

export const SETTINGS_CHANGE_PASSWORD_DIALOG_CLOSE = "SETTINGS_CHANGE_PASSWORD_DIALOG_CLOSE";
export const settingsChangePasswordDialogClose = () => ({
    type: SETTINGS_CHANGE_PASSWORD_DIALOG_CLOSE
});

export const SETTINGS_CHANGE_PASSWORD = "SETTINGS_CHANGE_PASSWORD";
export const settingsChangePassword = (oldPassword, password, onLoginIncorrect) => ({
    type: SETTINGS_CHANGE_PASSWORD,
    payload: {oldPassword, password, onLoginIncorrect}
});

export const SETTINGS_CHANGED_PASSWORD = "SETTINGS_CHANGED_PASSWORD";
export const settingsChangedPassword = () => ({
    type: SETTINGS_CHANGED_PASSWORD
});

export const SETTINGS_CHANGE_PASSWORD_FAILED = "SETTINGS_CHANGE_PASSWORD_FAILED";
export const settingsChangePasswordFailed = () => ({
    type: SETTINGS_CHANGE_PASSWORD_FAILED
});
