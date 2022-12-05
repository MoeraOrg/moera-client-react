import { Action } from 'redux';

import { ActionWithPayload } from "state/action-types";
import { AskSubject, FriendGroupInfo } from "api/node/api-types";

export const OPEN_ASK_DIALOG = "OPEN_ASK_DIALOG";
export type OpenAskDialogAction = ActionWithPayload<typeof OPEN_ASK_DIALOG, {
    nodeName: string;
}>;
export const openAskDialog = (nodeName: string): OpenAskDialogAction => ({
    type: OPEN_ASK_DIALOG,
    payload: {nodeName}
});

export const CLOSE_ASK_DIALOG = "CLOSE_ASK_DIALOG";
export type CloseAskDialogAction = Action<typeof CLOSE_ASK_DIALOG>;
export const closeAskDialog = (): CloseAskDialogAction => ({
    type: CLOSE_ASK_DIALOG
});

export const ASK_DIALOG_LOAD = "ASK_DIALOG_LOAD";
export type AskDialogLoadAction = ActionWithPayload<typeof ASK_DIALOG_LOAD, {
    nodeName: string;
}>;
export const askDialogLoad = (nodeName: string): AskDialogLoadAction => ({
    type: ASK_DIALOG_LOAD,
    payload: {nodeName}
});

export const ASK_DIALOG_LOADED = "ASK_DIALOG_LOADED";
export type AskDialogLoadedAction = ActionWithPayload<typeof ASK_DIALOG_LOADED, {
    nodeName: string;
    friendGroups: FriendGroupInfo[];
}>;
export const askDialogLoaded = (nodeName: string, friendGroups: FriendGroupInfo[]): AskDialogLoadedAction => ({
    type: ASK_DIALOG_LOADED,
    payload: {nodeName, friendGroups}
});

export const ASK_DIALOG_LOAD_FAILED = "ASK_DIALOG_LOAD_FAILED";
export type AskDialogLoadFailedAction = ActionWithPayload<typeof ASK_DIALOG_LOAD_FAILED, {
    nodeName: string;
}>;
export const askDialogLoadFailed = (nodeName: string): AskDialogLoadFailedAction => ({
    type: ASK_DIALOG_LOAD_FAILED,
    payload: {nodeName}
});

export const ASK_DIALOG_SEND = "ASK_DIALOG_SEND";
export type AskDialogSendAction = ActionWithPayload<typeof ASK_DIALOG_SEND, {
    nodeName: string;
    subject: AskSubject;
    friendGroupId: string | null;
    message: string;
}>;
export const askDialogSend = (nodeName: string, subject: AskSubject, friendGroupId: string | null,
                              message: string): AskDialogSendAction => ({
    type: ASK_DIALOG_SEND,
    payload: {nodeName, subject, friendGroupId, message}
});

export const ASK_DIALOG_SENT = "ASK_DIALOG_SENT";
export type AskDialogSentAction = ActionWithPayload<typeof ASK_DIALOG_SENT, {
    nodeName: string;
}>;
export const askDialogSent = (nodeName: string): AskDialogSentAction => ({
    type: ASK_DIALOG_SENT,
    payload: {nodeName}
});

export const ASK_DIALOG_SEND_FAILED = "ASK_DIALOG_SEND_FAILED";
export type AskDialogSendFailedAction = ActionWithPayload<typeof ASK_DIALOG_SEND_FAILED, {
    nodeName: string;
}>;
export const askDialogSendFailed = (nodeName: string): AskDialogSendFailedAction => ({
    type: ASK_DIALOG_SEND_FAILED,
    payload: {nodeName}
});

export type AskDialogAnyAction =
    OpenAskDialogAction
    | CloseAskDialogAction
    | AskDialogLoadAction
    | AskDialogLoadedAction
    | AskDialogLoadFailedAction
    | AskDialogSendAction
    | AskDialogSentAction
    | AskDialogSendFailedAction;
