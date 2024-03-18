import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";
import { Body, MediaAttachment } from "api";
import { RelNodeName } from "util/rel-node-name";

export type EntryCopyTextMode = "ask" | "text" | "html";

export type EntryCopyTextAction = ActionWithPayload<"ENTRY_COPY_TEXT", {
    body: Body;
    mode: EntryCopyTextMode;
    nodeName: RelNodeName | string;
    media: MediaAttachment[] | null;
}>;
export const entryCopyText = (
    body: Body, mode: EntryCopyTextMode, nodeName: RelNodeName | string, media: MediaAttachment[] | null
): EntryCopyTextAction =>
    actionWithPayload("ENTRY_COPY_TEXT", {body, mode, nodeName, media});

export type OpenEntryCopyTextDialogAction = ActionWithPayload<"OPEN_ENTRY_COPY_TEXT_DIALOG", {
    body: Body;
    nodeName: RelNodeName | string;
    media: MediaAttachment[] | null;
}>;
export const openEntryCopyTextDialog = (
    body: Body, nodeName: RelNodeName | string, media: MediaAttachment[] | null
): OpenEntryCopyTextDialogAction =>
    actionWithPayload("OPEN_ENTRY_COPY_TEXT_DIALOG", {body, nodeName, media});

export type CloseEntryCopyTextDialogAction = ActionWithoutPayload<"CLOSE_ENTRY_COPY_TEXT_DIALOG">;
export const closeEntryCopyTextDialog = (): CloseEntryCopyTextDialogAction =>
    actionWithoutPayload("CLOSE_ENTRY_COPY_TEXT_DIALOG");

export type EntryCopyTextDialogAnyAction =
    EntryCopyTextAction
    | OpenEntryCopyTextDialogAction
    | CloseEntryCopyTextDialogAction;
