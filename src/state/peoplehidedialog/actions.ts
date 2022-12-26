import { Action } from 'redux';

import { ActionWithPayload } from "state/action-types";

export const OPEN_PEOPLE_HIDE_DIALOG = "OPEN_PEOPLE_HIDE_DIALOG";
export type OpenPeopleHideDialogAction = ActionWithPayload<typeof OPEN_PEOPLE_HIDE_DIALOG, {
    nodeName: string | null;
    feedName: string | null;
}>;
export const openPeopleHideDialog = (nodeName: string | null, feedName: string | null): OpenPeopleHideDialogAction => ({
    type: OPEN_PEOPLE_HIDE_DIALOG,
    payload: {nodeName, feedName}
});

export const CLOSE_PEOPLE_HIDE_DIALOG = "CLOSE_PEOPLE_HIDE_DIALOG";
export type ClosePeopleHideDialogAction = Action<typeof CLOSE_PEOPLE_HIDE_DIALOG>;
export const closePeopleHideDialog = (): ClosePeopleHideDialogAction => ({
    type: CLOSE_PEOPLE_HIDE_DIALOG
});

export type PeopleHideDialogAnyAction =
    OpenPeopleHideDialogAction
    | ClosePeopleHideDialogAction;
