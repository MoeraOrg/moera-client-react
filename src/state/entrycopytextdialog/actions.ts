import { Action } from 'redux';

import { ActionWithPayload } from "state/action-types";
import { Body } from "api/node/api-types";

export type EntryCopyTextMode = "ask" | "text" | "html";

export const ENTRY_COPY_TEXT = "ENTRY_COPY_TEXT";
export type EntryCopyTextAction = ActionWithPayload<typeof ENTRY_COPY_TEXT, {
    body: Body;
    mode: EntryCopyTextMode;
}>;
export const entryCopyText = (body: Body, mode: EntryCopyTextMode): EntryCopyTextAction => ({
    type: ENTRY_COPY_TEXT,
    payload: {body, mode}
});

export const OPEN_ENTRY_COPY_TEXT_DIALOG = "OPEN_ENTRY_COPY_TEXT_DIALOG";
export type OpenEntryCopyTextDialogAction = ActionWithPayload<typeof OPEN_ENTRY_COPY_TEXT_DIALOG, {
    body: Body;
}>;
export const openEntryCopyTextDialog = (body: Body): OpenEntryCopyTextDialogAction => ({
    type: OPEN_ENTRY_COPY_TEXT_DIALOG,
    payload: {body}
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
