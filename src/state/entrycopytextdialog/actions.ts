import { Action } from 'redux';

import { ActionWithPayload } from "state/action-types";
import { Body, MediaAttachment } from "api/node/api-types";

export type EntryCopyTextMode = "ask" | "text" | "html";

export const ENTRY_COPY_TEXT = "ENTRY_COPY_TEXT";
export type EntryCopyTextAction = ActionWithPayload<typeof ENTRY_COPY_TEXT, {
    body: Body;
    mode: EntryCopyTextMode;
    nodeName: string;
    media: MediaAttachment[] | null;
}>;
export const entryCopyText = (body: Body, mode: EntryCopyTextMode, nodeName: string,
                              media: MediaAttachment[] | null): EntryCopyTextAction => ({
    type: ENTRY_COPY_TEXT,
    payload: {body, mode, nodeName, media}
});

export const OPEN_ENTRY_COPY_TEXT_DIALOG = "OPEN_ENTRY_COPY_TEXT_DIALOG";
export type OpenEntryCopyTextDialogAction = ActionWithPayload<typeof OPEN_ENTRY_COPY_TEXT_DIALOG, {
    body: Body;
    nodeName: string;
    media: MediaAttachment[] | null;
}>;
export const openEntryCopyTextDialog = (body: Body, nodeName: string,
                                        media: MediaAttachment[] | null): OpenEntryCopyTextDialogAction => ({
    type: OPEN_ENTRY_COPY_TEXT_DIALOG,
    payload: {body, nodeName, media}
});

export const CLOSE_ENTRY_COPY_TEXT_DIALOG = "CLOSE_ENTRY_COPY_TEXT_DIALOG";
export type CloseEntryCopyTextDialogAction = Action<typeof CLOSE_ENTRY_COPY_TEXT_DIALOG>;
export const closeEntryCopyTextDialog = (): CloseEntryCopyTextDialogAction => ({
    type: CLOSE_ENTRY_COPY_TEXT_DIALOG
});

export type EntryCopyTextDialogAnyAction =
    EntryCopyTextAction
    | OpenEntryCopyTextDialogAction
    | CloseEntryCopyTextDialogAction;
