import { ActionWithPayload } from "state/action-base";
import { Action } from "redux";

export const NODE_NAME_LOAD = "NODE_NAME_LOAD";
type NodeNameLoadAction = Action<typeof NODE_NAME_LOAD>;
export const nodeNameLoad = (): NodeNameLoadAction => ({
    type: NODE_NAME_LOAD
});

export const NODE_NAME_LOAD_FAILED = "NODE_NAME_LOAD_FAILED";
type NodeNameLoadFailedAction = Action<typeof NODE_NAME_LOAD_FAILED>;
export const nodeNameLoadFailed = (): NodeNameLoadFailedAction => ({
    type: NODE_NAME_LOAD_FAILED
});

export const NODE_NAME_SET = "NODE_NAME_SET";
type NodeNameSetAction = ActionWithPayload<typeof NODE_NAME_SET, {
    nodeName: string;
}>;
export const nodeNameSet = (nodeName: string): NodeNameSetAction => ({
    type: NODE_NAME_SET,
    payload: {nodeName}
});

export const NODE_NAME_UNSET = "NODE_NAME_UNSET";
type NodeNameUnsetAction = Action<typeof NODE_NAME_UNSET>;
export const nodeNameUnset = (): NodeNameUnsetAction => ({
    type: NODE_NAME_UNSET
});

export const REGISTER_NAME_DIALOG = "REGISTER_NAME_DIALOG";
type RegisterNameDialogAction = Action<typeof REGISTER_NAME_DIALOG>;
export const registerNameDialog = (): RegisterNameDialogAction => ({
    type: REGISTER_NAME_DIALOG
});

export const REGISTER_NAME_DIALOG_CANCEL = "REGISTER_NAME_DIALOG_CANCEL";
type RegisterNameDialogCancelAction = Action<typeof REGISTER_NAME_DIALOG_CANCEL>;
export const registerNameDialogCancel = (): RegisterNameDialogCancelAction => ({
    type: REGISTER_NAME_DIALOG_CANCEL
});

export const REGISTER_NAME = "REGISTER_NAME";
type RegisterNameAction = ActionWithPayload<typeof REGISTER_NAME, {
    name: string;
    onNameTaken: any;
}>;
export const registerName = (name: string, onNameTaken: any): RegisterNameAction => ({
    type: REGISTER_NAME,
    payload: {name, onNameTaken}
});

export const REGISTER_NAME_SUCCEEDED = "REGISTER_NAME_SUCCEEDED";
type RegisterNameSucceededAction = ActionWithPayload<typeof REGISTER_NAME_SUCCEEDED, {
    name: string;
    mnemonic: string[];
}>;
export const registerNameSucceeded = (name: string, mnemonic: string[]): RegisterNameSucceededAction => ({
    type: REGISTER_NAME_SUCCEEDED,
    payload: {name, mnemonic}
});

export const REGISTER_NAME_FAILED = "REGISTER_NAME_FAILED";
type RegisterNameFailedAction = Action<typeof REGISTER_NAME_FAILED>;
export const registerNameFailed = (): RegisterNameFailedAction => ({
    type: REGISTER_NAME_FAILED
});

export const MNEMONIC_CLOSE = "MNEMONIC_CLOSE";
type MnemonicCloseAction = Action<typeof MNEMONIC_CLOSE>;
export const mnemonicClose = (): MnemonicCloseAction => ({
    type: MNEMONIC_CLOSE
});

export const NODE_NAME_UPDATE_DIALOG = "NODE_NAME_UPDATE_DIALOG";
type NodeNameUpdateDialogAction = ActionWithPayload<typeof NODE_NAME_UPDATE_DIALOG, {
    changeName: boolean;
}>;
export const nodeNameUpdateDialog = (changeName: boolean): NodeNameUpdateDialogAction => ({
    type: NODE_NAME_UPDATE_DIALOG,
    payload: {changeName}
});

export const NODE_NAME_UPDATE_DIALOG_CANCEL = "NODE_NAME_UPDATE_DIALOG_CANCEL";
type NodeNameUpdateDialogCancelAction = Action<typeof NODE_NAME_UPDATE_DIALOG_CANCEL>;
export const nodeNameUpdateDialogCancel = (): NodeNameUpdateDialogCancelAction => ({
    type: NODE_NAME_UPDATE_DIALOG_CANCEL
});

export const NODE_NAME_UPDATE = "NODE_NAME_UPDATE";
type NodeNameUpdateAction = ActionWithPayload<typeof NODE_NAME_UPDATE, {
    name: string;
    mnemonic: string[];
}>;
export const nodeNameUpdate = (name: string, mnemonic: string[]): NodeNameUpdateAction => ({
    type: NODE_NAME_UPDATE,
    payload: {name, mnemonic}
});

export const NODE_NAME_UPDATE_SUCCEEDED = "NODE_NAME_UPDATE_SUCCEEDED";
type NodeNameUpdateSucceededAction = Action<typeof NODE_NAME_UPDATE_SUCCEEDED>;
export const nodeNameUpdateSucceeded = (): NodeNameUpdateSucceededAction => ({
    type: NODE_NAME_UPDATE_SUCCEEDED
});

export const NODE_NAME_UPDATE_FAILED = "NODE_NAME_UPDATE_FAILED";
type NodeNameUpdateFailedAction = Action<typeof NODE_NAME_UPDATE_FAILED>;
export const nodeNameUpdateFailed = (): NodeNameUpdateFailedAction => ({
    type: NODE_NAME_UPDATE_FAILED
});

export type NodeNameAnyAction =
    NodeNameLoadAction
    | NodeNameLoadFailedAction
    | NodeNameSetAction
    | NodeNameUnsetAction
    | RegisterNameDialogAction
    | RegisterNameDialogCancelAction
    | RegisterNameAction
    | RegisterNameSucceededAction
    | RegisterNameFailedAction
    | MnemonicCloseAction
    | NodeNameUpdateDialogAction
    | NodeNameUpdateDialogCancelAction
    | NodeNameUpdateAction
    | NodeNameUpdateSucceededAction
    | NodeNameUpdateFailedAction;
