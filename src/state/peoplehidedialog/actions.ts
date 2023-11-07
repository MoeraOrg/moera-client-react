import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";

export type OpenPeopleHideDialogAction = ActionWithPayload<"OPEN_PEOPLE_HIDE_DIALOG", {
    nodeName: string | null;
    feedName: string | null;
}>;
export const openPeopleHideDialog = (nodeName: string | null, feedName: string | null): OpenPeopleHideDialogAction =>
    actionWithPayload("OPEN_PEOPLE_HIDE_DIALOG", {nodeName, feedName});

export type ClosePeopleHideDialogAction = ActionWithoutPayload<"CLOSE_PEOPLE_HIDE_DIALOG">;
export const closePeopleHideDialog = (): ClosePeopleHideDialogAction =>
    actionWithoutPayload("CLOSE_PEOPLE_HIDE_DIALOG");

export type PeopleHideDialogAnyAction =
    OpenPeopleHideDialogAction
    | ClosePeopleHideDialogAction;
