import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";

export type OpenProgressBoxAction = ActionWithPayload<"OPEN_PROGRESS_BOX", {
    done: number;
    total: number;
}>;
export const openProgressBox = (done: number = 0, total: number = 0): OpenProgressBoxAction =>
    actionWithPayload("OPEN_PROGRESS_BOX", {done, total});

export type UpdateProgressBoxAction = ActionWithPayload<"UPDATE_PROGRESS_BOX", {
    done: number;
    total: number;
}>;
export const updateProgressBox = (done: number, total: number): UpdateProgressBoxAction =>
    actionWithPayload("UPDATE_PROGRESS_BOX", {done, total});

export type CloseProgressBoxAction = ActionWithoutPayload<"CLOSE_PROGRESS_BOX">;
export const closeProgressBox = (): CloseProgressBoxAction =>
    actionWithoutPayload("CLOSE_PROGRESS_BOX");

export type ProgressBoxAnyAction =
    OpenProgressBoxAction
    | UpdateProgressBoxAction
    | CloseProgressBoxAction;
