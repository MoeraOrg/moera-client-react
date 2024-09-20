import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";
import { NodeNameInfo } from "api";

export type NodeNameLoadAction = ActionWithoutPayload<"NODE_NAME_LOAD">;
export const nodeNameLoad = (): NodeNameLoadAction =>
    actionWithoutPayload("NODE_NAME_LOAD");

export type NodeNameLoadFailedAction = ActionWithoutPayload<"NODE_NAME_LOAD_FAILED">;
export const nodeNameLoadFailed = (): NodeNameLoadFailedAction =>
    actionWithoutPayload("NODE_NAME_LOAD_FAILED");

export type NodeNameSetAction = ActionWithPayload<"NODE_NAME_SET", {
    info: NodeNameInfo;
}>;
export const nodeNameSet = (info: NodeNameInfo): NodeNameSetAction =>
    actionWithPayload("NODE_NAME_SET", {info});

export type NodeNameUnsetAction = ActionWithoutPayload<"NODE_NAME_UNSET">;
export const nodeNameUnset = (): NodeNameUnsetAction =>
    actionWithoutPayload("NODE_NAME_UNSET");

export type RegisterNameDialogAction = ActionWithoutPayload<"REGISTER_NAME_DIALOG">;
export const registerNameDialog = (): RegisterNameDialogAction =>
    actionWithoutPayload("REGISTER_NAME_DIALOG");

export type RegisterNameDialogCancelAction = ActionWithoutPayload<"REGISTER_NAME_DIALOG_CANCEL">;
export const registerNameDialogCancel = (): RegisterNameDialogCancelAction =>
    actionWithoutPayload("REGISTER_NAME_DIALOG_CANCEL");

export type RegisterNameAction = ActionWithPayload<"REGISTER_NAME", {
    name: string;
    onNameTaken: any;
}>;
export const registerName = (name: string, onNameTaken: any): RegisterNameAction =>
    actionWithPayload("REGISTER_NAME", {name, onNameTaken});

export type RegisterNameSucceededAction = ActionWithPayload<"REGISTER_NAME_SUCCEEDED", {
    name: string;
    mnemonic: string[];
}>;
export const registerNameSucceeded = (name: string, mnemonic: string[]): RegisterNameSucceededAction =>
    actionWithPayload("REGISTER_NAME_SUCCEEDED", {name, mnemonic});

export type RegisterNameFailedAction = ActionWithoutPayload<"REGISTER_NAME_FAILED">;
export const registerNameFailed = (): RegisterNameFailedAction =>
    actionWithoutPayload("REGISTER_NAME_FAILED");

export type MnemonicOpenAction = ActionWithPayload<"MNEMONIC_OPEN", {
    name: string;
    mnemonic: string[];
}>;
export const mnemonicOpen = (name: string, mnemonic: string[]): MnemonicOpenAction =>
    actionWithPayload("MNEMONIC_OPEN", {name, mnemonic});

export type MnemonicCloseAction = ActionWithPayload<"MNEMONIC_CLOSE", {
    store: boolean;
}>;
export const mnemonicClose = (store: boolean): MnemonicCloseAction =>
    actionWithPayload("MNEMONIC_CLOSE", {store});

export type MnemonicClosedAction = ActionWithPayload<"MNEMONIC_CLOSED", {
    stored: boolean;
}>;
export const mnemonicClosed = (stored: boolean): MnemonicClosedAction =>
    actionWithPayload("MNEMONIC_CLOSED", {stored});

export type NodeNameUpdateDialogAction = ActionWithPayload<"NODE_NAME_UPDATE_DIALOG", {
    changeName: boolean;
}>;
export const nodeNameUpdateDialog = (changeName: boolean): NodeNameUpdateDialogAction =>
    actionWithPayload("NODE_NAME_UPDATE_DIALOG", {changeName});

export type NodeNameUpdateDialogCancelAction = ActionWithoutPayload<"NODE_NAME_UPDATE_DIALOG_CANCEL">;
export const nodeNameUpdateDialogCancel = (): NodeNameUpdateDialogCancelAction =>
    actionWithoutPayload("NODE_NAME_UPDATE_DIALOG_CANCEL");

export type NodeNameUpdateAction = ActionWithPayload<"NODE_NAME_UPDATE", {
    name: string;
    mnemonic: string[];
}>;
export const nodeNameUpdate = (name: string, mnemonic: string[]): NodeNameUpdateAction =>
    actionWithPayload("NODE_NAME_UPDATE", {name, mnemonic});

export type NodeNameUpdateSucceededAction = ActionWithoutPayload<"NODE_NAME_UPDATE_SUCCEEDED">;
export const nodeNameUpdateSucceeded = (): NodeNameUpdateSucceededAction =>
    actionWithoutPayload("NODE_NAME_UPDATE_SUCCEEDED");

export type NodeNameUpdateFailedAction = ActionWithoutPayload<"NODE_NAME_UPDATE_FAILED">;
export const nodeNameUpdateFailed = (): NodeNameUpdateFailedAction =>
    actionWithoutPayload("NODE_NAME_UPDATE_FAILED");

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
    | MnemonicOpenAction
    | MnemonicCloseAction
    | MnemonicClosedAction
    | NodeNameUpdateDialogAction
    | NodeNameUpdateDialogCancelAction
    | NodeNameUpdateAction
    | NodeNameUpdateSucceededAction
    | NodeNameUpdateFailedAction;
