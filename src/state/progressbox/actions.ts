import { Action } from 'redux';

import { ActionWithPayload } from "state/action-types";

export const OPEN_PROGRESS_BOX = "OPEN_PROGRESS_BOX";
export type OpenProgressBoxAction = ActionWithPayload<typeof OPEN_PROGRESS_BOX, {
    done: number;
    total: number;
}>;
export const openProgressBox = (done: number = 0, total: number = 0): OpenProgressBoxAction => ({
    type: OPEN_PROGRESS_BOX,
    payload: {done, total}
});

export const UPDATE_PROGRESS_BOX = "UPDATE_PROGRESS_BOX";
export type UpdateProgressBoxAction = ActionWithPayload<typeof UPDATE_PROGRESS_BOX, {
    done: number;
    total: number;
}>;
export const updateProgressBox = (done: number, total: number): UpdateProgressBoxAction => ({
    type: UPDATE_PROGRESS_BOX,
    payload: {done, total}
});

export const CLOSE_PROGRESS_BOX = "CLOSE_PROGRESS_BOX";
export type CloseProgressBoxAction = Action<typeof CLOSE_PROGRESS_BOX>;
export const closeProgressBox = (): CloseProgressBoxAction => ({
    type: CLOSE_PROGRESS_BOX
});

export type ProgressBoxAnyAction =
    OpenProgressBoxAction
    | UpdateProgressBoxAction
    | CloseProgressBoxAction;
