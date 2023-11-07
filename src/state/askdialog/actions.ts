import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";
import { AskSubject, FriendGroupInfo } from "api";

export type OpenAskDialogAction = ActionWithPayload<"OPEN_ASK_DIALOG", {
    nodeName: string | null;
    nodeCount: number;
}>;
export const openAskDialog = (nodeName: string | null, nodeCount: number = 0): OpenAskDialogAction =>
    actionWithPayload("OPEN_ASK_DIALOG", {nodeName, nodeCount});

export type CloseAskDialogAction = ActionWithoutPayload<"CLOSE_ASK_DIALOG">;
export const closeAskDialog = (): CloseAskDialogAction =>
    actionWithoutPayload("CLOSE_ASK_DIALOG");

export type AskDialogLoadAction = ActionWithPayload<"ASK_DIALOG_LOAD", {
    nodeName: string;
}>;
export const askDialogLoad = (nodeName: string): AskDialogLoadAction =>
    actionWithPayload("ASK_DIALOG_LOAD", {nodeName});

export type AskDialogLoadedAction = ActionWithPayload<"ASK_DIALOG_LOADED", {
    nodeName: string;
    friendGroups: FriendGroupInfo[];
    subjectsAllowed: AskSubject[];
}>;
export const askDialogLoaded = (
    nodeName: string, friendGroups: FriendGroupInfo[], subjectsAllowed: AskSubject[]
): AskDialogLoadedAction =>
    actionWithPayload("ASK_DIALOG_LOADED", {nodeName, friendGroups, subjectsAllowed});

export type AskDialogLoadFailedAction = ActionWithPayload<"ASK_DIALOG_LOAD_FAILED", {
    nodeName: string;
}>;
export const askDialogLoadFailed = (nodeName: string): AskDialogLoadFailedAction =>
    actionWithPayload("ASK_DIALOG_LOAD_FAILED", {nodeName});

export type AskDialogSendAction = ActionWithPayload<"ASK_DIALOG_SEND", {
    nodeName: string;
    subject: AskSubject;
    friendGroupId: string | null;
    message: string;
}>;
export const askDialogSend = (
    nodeName: string, subject: AskSubject, friendGroupId: string | null, message: string
): AskDialogSendAction =>
    actionWithPayload("ASK_DIALOG_SEND", {nodeName, subject, friendGroupId, message});

export type AskDialogSentAction = ActionWithPayload<"ASK_DIALOG_SENT", {
    nodeName: string;
}>;
export const askDialogSent = (nodeName: string): AskDialogSentAction =>
    actionWithPayload("ASK_DIALOG_SENT", {nodeName});

export type AskDialogSendFailedAction = ActionWithPayload<"ASK_DIALOG_SEND_FAILED", {
    nodeName: string;
}>;
export const askDialogSendFailed = (nodeName: string): AskDialogSendFailedAction =>
    actionWithPayload("ASK_DIALOG_SEND_FAILED", {nodeName});

export type AskDialogAnyAction =
    OpenAskDialogAction
    | CloseAskDialogAction
    | AskDialogLoadAction
    | AskDialogLoadedAction
    | AskDialogLoadFailedAction
    | AskDialogSendAction
    | AskDialogSentAction
    | AskDialogSendFailedAction;
