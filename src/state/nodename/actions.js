export const NODE_NAME_LOAD = "NODE_NAME_LOAD";
export const nodeNameLoad = () => ({
    type: NODE_NAME_LOAD
});

export const NODE_NAME_LOAD_FAILED = "NODE_NAME_LOAD_FAILED";
export const nodeNameLoadFailed = () => ({
    type: NODE_NAME_LOAD_FAILED
});

export const NODE_NAME_SET = "NODE_NAME_SET";
export const nodeNameSet = (nodeName) => ({
    type: NODE_NAME_SET,
    payload: {nodeName}
});

export const NODE_NAME_UNSET = "NODE_NAME_UNSET";
export const nodeNameUnset = () => ({
    type: NODE_NAME_UNSET
});

export const REGISTER_NAME_DIALOG = "REGISTER_NAME_DIALOG";
export const registerNameDialog = () => ({
    type: REGISTER_NAME_DIALOG
});

export const REGISTER_NAME_DIALOG_CANCEL = "REGISTER_NAME_DIALOG_CANCEL";
export const registerNameDialogCancel = () => ({
    type: REGISTER_NAME_DIALOG_CANCEL
});

export const REGISTER_NAME = "REGISTER_NAME";
export const registerName = (name, onNameTaken) => ({
    type: REGISTER_NAME,
    payload: {name, onNameTaken}
});

export const REGISTER_NAME_SUCCEEDED = "REGISTER_NAME_SUCCEEDED";
export const registerNameSucceeded = (name, mnemonic) => ({
    type: REGISTER_NAME_SUCCEEDED,
    payload: {name, mnemonic}
});

export const REGISTER_NAME_FAILED = "REGISTER_NAME_FAILED";
export const registerNameFailed = () => ({
    type: REGISTER_NAME_FAILED
});

export const MNEMONIC_CLOSE = "MNEMONIC_CLOSE";
export const mnemonicClose = () => ({
    type: MNEMONIC_CLOSE
});

export const NODE_NAME_UPDATE_DIALOG = "NODE_NAME_UPDATE_DIALOG";
export const nodeNameUpdateDialog = (changeName) => ({
    type: NODE_NAME_UPDATE_DIALOG,
    payload: {changeName}
});

export const NODE_NAME_UPDATE_DIALOG_CANCEL = "NODE_NAME_UPDATE_DIALOG_CANCEL";
export const nodeNameUpdateDialogCancel = () => ({
    type: NODE_NAME_UPDATE_DIALOG_CANCEL
});

export const NODE_NAME_UPDATE = "NODE_NAME_UPDATE";
export const nodeNameUpdate = (name, mnemonic) => ({
    type: NODE_NAME_UPDATE,
    payload: {name, mnemonic}
});

export const NODE_NAME_UPDATE_SUCCEEDED = "NODE_NAME_UPDATE_SUCCEEDED";
export const nodeNameUpdateSucceeded = () => ({
    type: NODE_NAME_UPDATE_SUCCEEDED
});

export const NODE_NAME_UPDATE_FAILED = "NODE_NAME_UPDATE_FAILED";
export const nodeNameUpdateFailed = () => ({
    type: NODE_NAME_UPDATE_FAILED
});
