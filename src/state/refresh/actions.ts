import { actionWithoutPayload, ActionWithoutPayload } from "state/action-types";

export type RefreshShowAction = ActionWithoutPayload<"REFRESH_SHOW">;
export const refreshShow = (): RefreshShowAction =>
    actionWithoutPayload("REFRESH_SHOW");

export type RefreshHideAction = ActionWithoutPayload<"REFRESH_HIDE">;
export const refreshHide = (): RefreshHideAction =>
    actionWithoutPayload("REFRESH_HIDE");

export type RefreshAnyAction =
    RefreshShowAction
    | RefreshHideAction;
